// 0. Global Variables
const latToronto = 43.651070; // Latitude of Toronto
const lonToronto = -79.347015; // Longitude of Toronto
const apiKeySeatGeek = "MzE3MDE3ODN8MTY3NTExMzI2My43OTE4ODI4" // API key for SeatGeek
const range = "30mi"; // Default = 30miles (when not specified) // Feel free to change!
let fetchedDataSection = document.getElementById("event-buttons"); // New event list section to click 
let savedDataSection = document.getElementById("search-buttons"); // Saved event list section to click
let selectedEventSection = document.getElementById("selected-event"); // Detailed information section
// Blank objects to store data {key, [value[0], value[1], value[2], ... , value[8]]}
let fetchedData = {} // Fetched (new) data will be stored here 
let savedData = {} // Saved (in Local Storage) data will be stored here
// Structure of these objects:
//   key = eventID (from SeatGeek)
//   value[0] = event category
//   value[1] = event (short) name
//   value[2] = event date/time
//   value[3] = performer
//   value[4] = venue name
//   value[5] = venue address
//   value[6] = URL (link)
//   value[7] = venue latitude
//   value[8] = venue longitude

//Global variables for light & dark mode
let themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
let themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');


// 1-1. Initial actions when the page is loaded
function init(){
  fetchNewEvent(); // Get event data from SeatGeek
  getSavedEvent(); // Get event data from Local Storage
}


// 1-2. Fetch event data from SeatGeek
function fetchNewEvent(){
  let today = dayjs();
  let dayOfWeek = today.format("d"); // Sun = 0, Mon = 1, Sat = 6
  let comingSat = today.add(6 - dayOfWeek,"day"); // Get the coming Saturday's date
  let comingMon = comingSat.add(2,"day"); // Get the coming Monday's date
  let startDate = comingSat.format("YYYY-MM-DD"); // Saturday 0am
  let endDate = comingMon.format("YYYY-MM-DD"); // Monday 0am
  let perPage = 10; // Number of events to get from SeatGeek // Feel free to change!
  let apiUrlSeatGeek = `https://api.seatgeek.com/2/events?lat=${latToronto}&lon=${lonToronto}&range=${range}&datetime_local.gte=${startDate}&datetime_local.lte=${endDate}&per_page=${perPage}&sort=datetime_local.asc&client_id=${apiKeySeatGeek}`; 
    fetch(apiUrlSeatGeek) // Fetch data from SeatGeek
    .then(function (response) {
      if (response.ok===false) { 
        return; // When there's an error, do Nothing
      } else {
        return response.json();
      } 
    })
    .then(function (data) {
      for (a = 0; a < data.events.length; a++){ // Input fetched data into the object "fetchedData" so that the relevant data can be assigned to buttons' attributes
        let id = data.events[a].id;
        let category = data.events[a].type; // Theater, Family, Minor_League_Hockey etc.
        let title = data.events[a].short_title; // Title (short title)
        let datetime = data.events[a].datetime_local;
        let performer = data.events[a].performers[0].name;
        let venueName = data.events[a].venue.name;
        let venueAddress = data.events[a].venue.address;
        let eventUrl = data.events[a].url;
        let venueLat = data.events[a].venue.location.lat;
        let venueLon = data.events[a].venue.location.lon;
        fetchedData[id] = [category, title, datetime, performer, venueName, venueAddress, eventUrl, venueLat, venueLon]; // Put data into the object (key = event ID)
      }
      createEventList(fetchedData, fetchedDataSection); // Create list of events/buttons (1st variable) in the new event list section (2nd variable)
    })
  }


// 1-3. Get saved event data from Local Storage
function getSavedEvent(){
  savedData = JSON.parse(localStorage.getItem("eventData")); // Get data from Local Storage
    if (savedData !== null) { // If the data from Local Storage is blank, skip the following step
      createEventList(savedData, savedDataSection) // Create list of events/buttons (1st variable) in the searched event list section (2nd variable)
    }  
}


// 2-1. Create lists & buttons for either 'fetchedData' or 'savedData' 
function createEventList(data, location){ // *** (data, location) are input variables. They NEED to be SPECIFIED when this function is called.
  for (b = 0; b < Object.keys(data).length; b++){ // Create buttons (based on the number of events to show)
    let eventButton = document.createElement("button");
    location.appendChild(eventButton);
    eventButton.textContent = Object.values(data)[b][1] + " , " + dayjs(Object.values(data)[b][2]).format("MMM D h:mma"); // Each button has the title and date/time information
    eventButton.setAttribute("class", "event-btn"); // Add class of "event-btn" to each button so that they can be styled in CSS
    eventButton.setAttribute("data-key", Object.keys(data)[b]); // Add event ID as an attribute to each key so that this information can be used when the button is clicked
    for (c = 0; c < 9; c++){ // Add other data as attributes to each key so that these information can be used when the button is clicked
      eventButton.setAttribute(`data-value${c}`, Object.values(data)[b][c]);
    }
  }
};


// 3-1. [EVENT LISTENER] When a button of 'fetchedData' is clicked
fetchedDataSection.addEventListener("click", function(event){
  event.preventDefault();
  if (event.target.getAttribute("class")==="event-btn"){ // This event will be triggered only when a button is clicked (not the space around buttons)
    saveNewData(event); // Save the clicked button's data in Local Storage
    clearDetails(); // Clear the detailed information section so that new information can be shown
    showDetails(event); // Show new detailed information
  }
});


// 3-2. [EVENT LISTENER] When a button of 'savedData' is clicked
savedDataSection.addEventListener("click", function(event){
  event.preventDefault();
  if (event.target.getAttribute("class")==="event-btn"){ // This event will be triggered only when a button is clicked (not the space around buttons)
    clearDetails(); // Clear the detailed information section so that new information can be shown
    showDetails(event); // Show new detailed information
  }
});


// 4-1. Save new data to Local Storage
function saveNewData(event){
  savedData = JSON.parse(localStorage.getItem("eventData")); // Get the latest list of events from Local Storage
  if (savedData === null) {
    savedData = {}; // If Local Storage has no data, "savedData" is a blank object
  } 
  savedData[event.target.getAttribute("data-key")]=[ // Add new data (clicked event's data) to the object "savedData"
    event.target.getAttribute("data-value0"), // event category
    event.target.getAttribute("data-value1"), // event (short) name
    event.target.getAttribute("data-value2"), // event date/time
    event.target.getAttribute("data-value3"), // performer
    event.target.getAttribute("data-value4"), // venue name
    event.target.getAttribute("data-value5"), // venue address
    event.target.getAttribute("data-value6"), // URL (link)
    event.target.getAttribute("data-value7"), // venue latitude
    event.target.getAttribute("data-value8"), // venue longitude
  ]
  localStorage.setItem("eventData", JSON.stringify(savedData)); // Save this object in Local Storage
  clearSavedEventList(); // In order to update the list of searched events, the current list is deleted
  createEventList(savedData, savedDataSection); // Show new list with the new "savedData"
}


// 4-2. Update the search history section
function clearSavedEventList(){ 
  while (savedDataSection.firstChild) { // Delete all the children elements of the Saved event list section
    savedDataSection.removeChild(savedDataSection.firstChild)
  }
}  


// 5-1. Clear the details section
function clearDetails(){
  while (selectedEventSection.firstChild) { // Delete all the children elements of the New event list section
    selectedEventSection.removeChild(selectedEventSection.firstChild)
  }
}


// 5-2. Show detailed information of the clicked event in the right-top section
function showDetails(event){
  event.preventDefault();
  let detailSection = document.createElement("div"); // Create <div> element at the top
  let detailH4 = document.createElement("h2"); // Create <h4> element below
  let detailList = document.createElement("div"); // Create <div> element to store <ul> element
  let detailUl = document.createElement("ul"); // Create <ul> element to store <li> elements
  selectedEventSection.appendChild(detailSection);
  detailSection.appendChild(detailH4);
  detailSection.appendChild(detailList);
  detailList.appendChild(detailUl);
  detailH4.textContent = "Details of the Event";
  let titlesForLi = ["Category: ", "Event: ", "Date: ", "Time: ", "Performed by: ", "Venue: ", "Address: "]; // Texts to be shown next to each information in the list are stored in an array so that it can be used within a FOR loop 
  for (c = 0; c < 7; c++){
    let detailLi = document.createElement("li"); // Create <li> element under <ul>
    detailUl.appendChild(detailLi);
    detailLi.setAttribute("id", `detail-value${c}`); // Add id to each <li> element
    if (c === 0){
      detailLi.textContent = titlesForLi[c] + event.target.getAttribute(`data-value${c}`);
    } else if (c === 1){ // For the event name <li>, add a link element <a> below it so that when you click the event name, it takes you to the SeatGeek page
      let detailLink = document.createElement("a");
      document.getElementById("detail-value1").appendChild(detailLink);
      detailLink.setAttribute("href", event.target.getAttribute("data-value6")); // href = SeatGeek URL
      detailLink.setAttribute("target", "_blank"); // When the link is clicked, open the page in a new tab
      detailLink.setAttribute("style", "text-decoration: underline ; text-decoration-color: var(--tan)"); // When the link is clicked, open the page in a new tab
      // detailLink.setAttribute("style", "text-decoration-color: #FFFFFF"); // When the link is clicked, open the page in a new tab
      detailLink.textContent = titlesForLi[c] + event.target.getAttribute(`data-value${c}`);
    } else if (c === 2) {
      detailLi.textContent = titlesForLi[c] + dayjs(event.target.getAttribute(`data-value${c}`)).format("MMMM D, dddd"); // For the date/time <li>, specify the date/time format using dayJS
    } else if (c === 3) {
      detailLi.textContent = titlesForLi[c] + dayjs(event.target.getAttribute(`data-value${c-1}`)).format("h:mma"); // For the date/time <li>, specify the date/time format using dayJS
    } else {
      detailLi.textContent = titlesForLi[c] + event.target.getAttribute(`data-value${c-1}`);
    }
  }
  fetchMap(event); // After showing the details of the event, fetch map data from OpenStreetMap
}


// 5-3. Fetch map data from OpenStreetMaps and show it in the right-bottom section
function fetchMap(event){
  event.preventDefault();
  let centerLon = Math.floor(event.target.getAttribute("data-value8")*10000)/10000; // Get the longitude data of the event venue from the clicked button's attribute
  let centerLat = Math.floor(event.target.getAttribute("data-value7")*10000)/10000; // Get the latitude data of the event venue from the clicked button's attribute
  let leftLon = centerLon - 0.0030; // Specify the longitude & latitude of the bottom left corner of the map
  let bottomLat = centerLat - 0.0014; // same as above
  let rightLon = centerLon + 0.0030; // Specify the longitude & latitude of the top right corner of the map
  let topLat = centerLat + 0.0014; // same as above
  let mapSection = document.createElement("div"); // Create a map <div> section
  selectedEventSection.appendChild(mapSection);
  mapSection.setAttribute("id", "mapSection");
  mapSection.setAttribute("class", "map-container center");
  let mapFrame = document.createElement("iframe"); // Create a map frame <iframe>
  document.getElementById("mapSection").appendChild(mapFrame);
  mapFrame.setAttribute("id", "mapFrame");
  let mapAttributeKeys = ["width", "height", "frameborder", "scrolling", "marginheight", "marginwidth", "style", "class"]; // Put <iframe>'s attributes/styles' keys to an array so that it can be used in the FOR loop
  let mapAttributeValues = [425, 425, 0, "no", 0, 0, "border: 0px solid black", "container center"]; // Put <iframe>'s attributes/styles' values to an array so that it can be used in the FOR loop
  for (d = 0; d < 8; d++){
    mapFrame.setAttribute(mapAttributeKeys[d], mapAttributeValues[d]); // Add attributes to the <iframe>
  }
  document.getElementById("mapFrame").setAttribute("src", `https://www.openstreetmap.org/export/embed.html?bbox=${leftLon}%2C${bottomLat}%2C${rightLon}%2C${topLat}&amp;layer=mapnik&amp;marker=${centerLat}%2C${centerLon}`); // Fetch map data from OpenStreetMap and add it to the page
}



// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

let themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {

    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
    
});

init(); // This code will be executed when the page is loaded

