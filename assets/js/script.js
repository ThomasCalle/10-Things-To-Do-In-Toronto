// 0. Global Variables
const latToronto = 43.651070; // Latitude of Toronto
const lonToronto = -79.347015; // Longitude of Toronto
const apiKeySeatGeek = "MzE3MDE3ODN8MTY3NTExMzI2My43OTE4ODI4" // API key for SeatGeek
const range = "30mi"; // Default = 30miles (when not specified) // Feel free to change
let fetchedDataSection = document.getElementById("event-buttons"); // New event list section to click 
let savedDataSection = document.getElementById("search-buttons"); // Saved event list section to click
let selectedEventSection = document.getElementById("selected-event"); // Saved event list section to click
// Blank objects to store data {key, [value[0], value[1], value[2], ... , value[8]]}
let fetchedData = {} // Fetched (new) data will be stored here 
let savedData = {} // Saved (in Local Storage) data will be stored here
// key = eventID (from SeatGeek)
// value[0] = event category
// value[1] = event (short) name
// value[2] = event date/time
// value[3] = performer
// value[4] = venue name
// value[5] = venue address
// value[6] = URL (link)
// value[7] = venue latitude
// value[8] = venue longitude


// 1-1. Initial actions when the page is loaded
function init(){
  fetchNewEvent(); // Get event data from SeatGeek
  getSavedEvent(); // Get event data from Local Storage
}

// 1-2. Fetch event data from SeatGeek
function fetchNewEvent(){
  let today = dayjs();
  let dayOfWeek = today.format("d"); // Sun = 0, Mon = 1, Sat = 6
  let comingSat = today.add(6 - dayOfWeek,"day"); 
  let comingMon = comingSat.add(2,"day");
  let startDate = comingSat.format("YYYY-MM-DD");
  let endDate = comingMon.format("YYYY-MM-DD");
  let perPage = 50;
  let apiUrlSeatGeek = `https://api.seatgeek.com/2/events?lat=${latToronto}&lon=${lonToronto}&range=${range}&datetime_local.gte=${startDate}&datetime_local.lte=${endDate}&per_page=${perPage}&client_id=${apiKeySeatGeek}`; 
    fetch(apiUrlSeatGeek)
    .then(function (response) {
      if (response.ok===false) { // When there's an error, show the alert message below and do not continue subsequent executions
        // $(function(){ // dialog function using jQuery
        //   $("#dialog").dialog();
        // });
        // in HTML, the following lines need to be added
        // <div id="dialog" title="Warning"><p>Error</p></div> in <main> or <body>
        // jquery & jquery-ui links in <script> at the end of <body>
        return;
      } else {
        return response.json();
      } 
    })
    .then(function (data) {
      console.log(data);
      for (a = 0; a < data.events.length; a++){ // Input fetched data into the object "fetchedData"
        let id = data.events[a].id;
        let category = data.events[a].type; // Theater, etc.
        let title = data.events[a].short_title; // Title (short title)
        let datetime = data.events[a].datetime_local;
        let performer = data.events[a].performers[0].name;
        let venueName = data.events[a].venue.name;
        let venueAddress = data.events[a].venue.address;
        let eventUrl = data.events[a].url;
        let venueLat = data.events[a].venue.location.lat;
        let venueLon = data.events[a].venue.location.lon;
        fetchedData[id] = [category, title, datetime, performer, venueName, venueAddress, eventUrl, venueLat, venueLon];
      }
      createEventList(fetchedData, fetchedDataSection); // Create list of events/buttons in the new event list section
    })
  }


// let eventCategory = {};
// let apiUrlSeatGeekTax = `https://api.seatgeek.com/2/taxonomies?client_id=${apiKeySeatGeek}`; 
// fetch(apiUrlSeatGeekTax)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (dataTax) {
//     for (e = 0; e < dataTax.taxonomies.length; e++){
//       let categoryId = dataTax.taxonomies[e].slug;
//       let categoryName = dataTax.taxonomies[e].name;
//       eventCategory[categoryId] = categoryName; 
//     }
//   });


// 1-3. Get saved event data from Local Storage
function getSavedEvent(){
  savedData = JSON.parse(localStorage.getItem("eventData")); 
    if (savedData !== null) {
      createEventList(savedData, savedDataSection) // Create list of events/buttons in the searched event list section
    }  
}


// 2-1. Create lists & buttons for either 'fetchedData' or 'savedData'
function createEventList(data, location){ // (data, location) are input variables. They need to be specified when this function is called.
  for (b = 0; b < Object.keys(data).length; b++){ 
    let eventButton = document.createElement("button");
    location.appendChild(eventButton);
    eventButton.textContent = Object.values(data)[b][0] + ", " + Object.values(data)[b][1] + ", " + Object.values(data)[b][2];
    eventButton.setAttribute("data-key", Object.keys(data)[b]);
    for (c = 0; c < 9; c++){
      eventButton.setAttribute(`data-value${c}`, Object.values(data)[b][c]);
    }
  }
};


// 3-1. [EVENT LISTENER] When a button of 'fetchedData' is clicked
fetchedDataSection.addEventListener("click", function(event){
  event.preventDefault();
  saveNewData(event);
  clearDetails(); 
  showDetails(event);
});


// 3-2. [EVENT LISTENER] When a button of 'savedData' is clicked
savedDataSection.addEventListener("click", function(event){
  event.preventDefault();
  clearDetails();
  showDetails(event);
});


// 4-1. Save new data to Local Storage
function saveNewData(event){
  savedData = JSON.parse(localStorage.getItem("eventData")); // Get the latest list of events from Local Storage
  if (savedData === null) {
    savedData = {}; // If Local Storage has no data, "savedData" is a blank object
  } 
  savedData[event.target.getAttribute("data-key")]=[
    event.target.getAttribute("data-value0"),
    event.target.getAttribute("data-value1"),
    event.target.getAttribute("data-value2"),
    event.target.getAttribute("data-value3"),
    event.target.getAttribute("data-value4"),
    event.target.getAttribute("data-value5"),
    event.target.getAttribute("data-value6"),
    event.target.getAttribute("data-value7"),
    event.target.getAttribute("data-value8"),
  ]
  localStorage.setItem("eventData", JSON.stringify(savedData));
  clearSavedEventList(); // In order to update the list, the current list is deleted
  createEventList(savedData, savedDataSection); // and new list with the new data will be listed
}


// 4-2. Update the search history section
function clearSavedEventList(){ 
  while (savedDataSection.firstChild) {
    savedDataSection.removeChild(savedDataSection.firstChild)
  }
}  


// 5-1. Clear the details section
function clearDetails(){
  while (selectedEventSection.firstChild) {
    selectedEventSection.removeChild(selectedEventSection.firstChild)
  }
}


// 5-2. Show detailed information of the clicked event in the right-top section
function showDetails(event){
  event.preventDefault();
  let detailSection = document.createElement("div");
  let detailH4 = document.createElement("h4");
  let detailList = document.createElement("div");
  let detailUl = document.createElement("ul");
  selectedEventSection.appendChild(detailSection);
  detailSection.appendChild(detailH4);
  detailSection.appendChild(detailList);
  detailList.appendChild(detailUl);
  detailH4.textContent = "Details of the Event";
  let titlesForLi = ["Category: ", "Event: ", "Date/Time: ", "Performed by: ", "Venue: ", "Address: "];
  for (c = 0; c < 6; c++){
    let detailLi = document.createElement("li");
    detailUl.appendChild(detailLi);
    detailLi.setAttribute("id", `detail-value${c}`);
    if (c === 1){
      let detailLink = document.createElement("a");
      document.getElementById("detail-value1").appendChild(detailLink);
      detailLink.setAttribute("href", event.target.getAttribute("data-value6"));
      detailLink.setAttribute("target", "_blank");
      detailLink.textContent = titlesForLi[c] + event.target.getAttribute(`data-value${c}`);
    } else {
    detailLi.textContent = titlesForLi[c] + event.target.getAttribute(`data-value${c}`);
    }
  }
  fetchMap(event);
}


// 5-3. Fetch map data from OpenStreetMaps and show it in the right-bottom section
function fetchMap(event){
  event.preventDefault();
  let centerLon = Math.floor(event.target.getAttribute("data-value8")*10000)/10000;
  let centerLat = Math.floor(event.target.getAttribute("data-value7")*10000)/10000;
  let leftLon = centerLon - 0.0030;
  let bottomLat = centerLat - 0.0014;
  let rightLon = centerLon + 0.0030;
  let topLat = centerLat + 0.0014;
  let mapSection = document.createElement("div");
  selectedEventSection.appendChild(mapSection);
  mapSection.setAttribute("id", "mapSection");
  let mapFrame = document.createElement("iframe");
  document.getElementById("mapSection").appendChild(mapFrame);
  mapFrame.setAttribute("id", "mapFrame");
  let mapAttributeKeys = ["width", "height", "frameborder", "scrolling", "marginheight", "marginwidth", "style"];
  let mapAttributeValues = [425, 350, 0, "no", 0, 0, "border: 1px solid black"];
  for (d = 0; d < 7; d++){
    mapFrame.setAttribute(mapAttributeKeys[d], mapAttributeValues[d]);
  }
  document.getElementById("mapFrame").setAttribute("src", `https://www.openstreetmap.org/export/embed.html?bbox=${leftLon}%2C${bottomLat}%2C${rightLon}%2C${topLat}&amp;layer=mapnik&amp;marker=${centerLat}%2C${centerLon}`);
}


init();