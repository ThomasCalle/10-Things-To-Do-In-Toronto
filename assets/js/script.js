// GLOBAL
const latToronto = 43.651070; // Latitude of Toronto
const lonToronto = -79.347015; // Longitude of Toronto
const apiKeySeatGeek = "MzE3MDE3ODN8MTY3NTExMzI2My43OTE4ODI4" // API key for SeatGeek
const range = "30mi"; // Default = 30miles (when not specified) // Feel free to change


// 1-1. Create blank objects to store data 
// key = eventID from SeatGeek
// value = [event category, event (short) name, event date/time, performer, venue name, venue address, venue latitude, venue longitude] 
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



// 1-4. Get saved (in Local Storage) data and put it in 'savedData'


// 2-1. Create lists & buttons for 'fetchedData' (lefthand side section)


// 2-2. Create lists & buttons for 'savedData' (middle section)


// Event Listeners
// When a button of 'fetchedData' is clicked


// When a button of 'savedData' is clicked


// 3-1. Show data of the clicked event ('fetchedData') in the right-top section


  // 3-1-1. Fetch map data from OpenStreetMaps and show it in the right-bottom section


// 3-2. Show data of the clicked event ('savedData') in the right-top section


  // 3-2-1. Fetch map data from OpenStreetMaps and show it in the right-bottom section







