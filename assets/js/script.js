// GLOBAL
const latToronto = 43.651070; // Latitude of Toronto
const lonToronto = -79.347015; // Longitude of Toronto
const apiKeySeatGeek = "MzE3MDE3ODN8MTY3NTExMzI2My43OTE4ODI4" // API key for SeatGeek
const range = "30mi"; // Default = 30miles (when not specified) // Feel free to change
let fetchedDataSection = document.getElementById("event-buttons"); // New event list section to click 
let savedDataSection = document.getElementById("history-buttons"); // Saved event list section to click


// 1-1. Create blank objects to store data {key, [value[0], value[1], value[2], ... , value[7]]}
// key = eventID (from SeatGeek)
// value[0] = event category
// value[1] = event (short) name
// value[2] = event date/time
// value[3] = performer
// value[4] = venue name
// value[5] = venue address
// value[6] = venue latitude
// value[7] = venue longitude
let fetchedData = {} // Fetched (new) data will be stored here 
let savedData = {} // Saved (in Local Storage) data will be stored here


// 1-2. Get today's date using DayJS
// This is to specify dates to search events on coming weekend
let today = dayjs();
let dayOfWeek = today.format("d"); // Sun = 0, Mon = 1, Sat = 6
let comingSat = today.add(6 - dayOfWeek,"day");
let comingSun = comingSat.add(1,"day");
let startDate = comingSat.format("YYYY-MM-DD");
let endDate = comingSun.format("YYYY-MM-DD");
console.log(startDate);
console.log(endDate);


// 1-3. Fetch data from SeatGeek
let apiUrlSeatGeek = `https://api.seatgeek.com/2/events?lat=${latToronto}&lon=${lonToronto}&range=${range}&datetime_utc.gte=${startDate}&datetime_utc.lte=${endDate}&client_id=${apiKeySeatGeek}`; 
  fetch(apiUrlSeatGeek)
  .then(function (response) {
    if (response.ok===false) { // When there's an error, show the alert message below and do not continue subsequent executions
    // Add dialog using JQUERY to JS and HTML files later 
      return;
    } else {
      return response.json();
    } 
  })
  .then(function (data) {
    console.log(data);
    for (a = 0; a < data.events.length; a++){
      let id = data.events[a].id;
      let category = data.events[a].type; // Theater, etc.
      let title = data.events[a].short_title; // Title (short title)
      let datetime = data.events[a].datetime_local;
      let performer = data.events[a].performers[0].name;
      let eventUrl = data.events[a].url;
      let venueAddress = data.events[a].venue.address;
      let venueLat = data.events[a].venue.location.lat;
      let venueLon = data.events[a].venue.location.lon;
      fetchedData[id] = [category, title, datetime, performer, eventUrl, venueAddress, venueLat, venueLon];
    }
    console.log(fetchedData);
    createFetchedEventList(fetchedData);
  });


// 1-4. Get saved (in Local Storage) data and put it in 'savedData'
savedData = JSON.parse(localStorage.getItem("eventData")); // Get the latest list of events from Local Storage
  if (savedData === null) {
    savedData = {}; // If Local Storage has no data, "savedData" is a blank object
  } else {
    console.log(savedData);
    showSavedEventList(savedData)
  }  


// 2-1. Create lists & buttons for 'fetchedData' (lefthand side section)
function createFetchedEventList(fetchedData){
  console.log(fetchedData);
  // let fetchedDataUl = document.createElement("div");
  // fetchedDataSection.appendChild(fetchedDataUl);
  // fetchedDataUl.setAttribute("id", "fetchedDataUl");

  for (b = 0; b < Object.keys(fetchedData).length; b++){ // Create event buttons
    let fetchedEveBtn = document.createElement("button");
    document.getElementById("event-buttons").appendChild(fetchedEveBtn);
    fetchedEveBtn.textContent = Object.values(fetchedData)[b][0] + ", " + Object.values(fetchedData)[b][1] + ", " + Object.values(fetchedData)[b][2];
    fetchedEveBtn.setAttribute("data-key", Object.keys(fetchedData)[b]);
    fetchedEveBtn.setAttribute("data-value0", Object.values(fetchedData)[b][0]);
    fetchedEveBtn.setAttribute("data-value1", Object.values(fetchedData)[b][1]);
    fetchedEveBtn.setAttribute("data-value2", Object.values(fetchedData)[b][2]);
    fetchedEveBtn.setAttribute("data-value3", Object.values(fetchedData)[b][3]);
    fetchedEveBtn.setAttribute("data-value4", Object.values(fetchedData)[b][4]);
    fetchedEveBtn.setAttribute("data-value5", Object.values(fetchedData)[b][5]);
    fetchedEveBtn.setAttribute("data-value6", Object.values(fetchedData)[b][6]);
    fetchedEveBtn.setAttribute("data-value7", Object.values(fetchedData)[b][7]);
  }
};


// 2-2. Create lists & buttons for 'savedData' (middle section)
function showSavedEventList(savedData){  
  for (c = 0; c < Object.keys(savedData).length; c++){ // Create history search buttons
    let historyEveBtn = document.createElement("button");
    document.getElementById("history-buttons").appendChild(historyEveBtn);
    historyEveBtn.textContent = Object.values(savedData)[c][0] + ", " + Object.values(savedData)[c][1] + ", " + Object.values(savedData)[c][2];
    historyEveBtn.setAttribute("data-key", Object.keys(savedData)[c]);
    historyEveBtn.setAttribute("data-value0", Object.values(savedData)[c][0]);
    historyEveBtn.setAttribute("data-value1", Object.values(savedData)[c][1]);
    historyEveBtn.setAttribute("data-value2", Object.values(savedData)[c][2]);
    historyEveBtn.setAttribute("data-value3", Object.values(savedData)[c][3]);
    historyEveBtn.setAttribute("data-value4", Object.values(savedData)[c][4]);
    historyEveBtn.setAttribute("data-value5", Object.values(savedData)[c][5]);
    historyEveBtn.setAttribute("data-value6", Object.values(savedData)[c][6]);
    historyEveBtn.setAttribute("data-value7", Object.values(savedData)[c][7]);
  }
}


// Event Listeners
// 3-1. When a button of 'fetchedData' is clicked
fetchedDataSection.addEventListener("click", function(event){
  event.preventDefault();
  // showFetchedSelectedEvent(event);
  saveNewData(event); 
});


// 3-2. When a button of 'savedData' is clicked
// savedDataSection.addEventListener("click", function(){
//   // Each button should have an attribute whose value = event ID (unique ID from SeatGeek)
//   // event.target ............. Get the event ID of the clicked event
//   showSavedSelectedEvent()
// });


// 4-1. Save new data to Local Storage
function saveNewData(event){
  console.log(event.target)
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
  ]
  console.log(savedData);
  localStorage.setItem("eventData", JSON.stringify(savedData));
  clearSavedEventList();
  showSavedEventList(savedData);
}


// 4-2. Update the search history section
function clearSavedEventList(){ 
  while (savedDataSection.firstChild) {
    savedDataSection.removeChild(savedDataSection.firstChild)
  }
}  


// 5-1. Show data of the clicked event ('fetchedData') in the right-top section
// function showFetchedSelectedEvent(event){
//   event.preventDefault();
// }


  // 5-1-1. Fetch map data from OpenStreetMaps and show it in the right-bottom section


// 5-2. Show data of the clicked event ('savedData') in the right-top section
// function showSavedSelectedEvent(event){
//   event.preventDefault();
// }

  // 5-2-1. Fetch map data from OpenStreetMaps and show it in the right-bottom section
