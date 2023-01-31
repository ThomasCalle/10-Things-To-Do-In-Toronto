// apiKeyEventbrite = "QICUWJMRDQKIKMA25ERX";
apiKeySeatGeek = "MzE3MDE3ODN8MTY3NTExMzI2My43OTE4ODI4"
city = "toronto"

// let apiUrlSeatGeek1 = `https://api.seatgeek.com/2/events?city=${city}&client_id=${apiKeySeatGeek}`; // City name doesn't work for event search
//   fetch(apiUrlSeatGeek1)
//   .then(function (response) {
//     if (response.ok===false) { // When there's an error, show the alert message below and do not continue subsequent executions
//     alert("Please check the city name again. It may be incorrect.");
//     return;
//     } else {
//       return response.json();
//     } 
//   })
//   .then(function (data) {
//     console.log("City");
//     console.log(data);
//   });

let lat = 43.651070; // Latitude of Toronto
let lon = -79.347015; // Longitude of Toronto
let range = "30mi"; // We can change this. Default = 30miles
// let today = new Date();
// let dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, 6 = Saturday
// console.log(dayOfWeek);
// let targetSrartDate = today + 6 - dayOfWeek; // Coming Saturday
// let targetEndDate = targetStartDate + 1; // Coming Sunday
let startDate = "2023-02-04" // Use DayJS to make these codes simpler
let endDate = "2023-02-04"

  let apiUrlSeatGeek2 = `https://api.seatgeek.com/2/events?lat=${lat}&lon=${lon}&range=${range}&datetime_utc.gte=${startDate}&datetime_utc.lte=${endDate}&client_id=${apiKeySeatGeek}`; 
  fetch(apiUrlSeatGeek2)
  .then(function (response) {
    if (response.ok===false) { // When there's an error, show the alert message below and do not continue subsequent executions
    // alert("Please check the city name again. It may be incorrect.");
    return;
    } else {
      return response.json();
    } 
  })
  .then(function (data) {
    console.log(data);
    let category = data.events[0].type; // Theater, etc.
    let title = data.events[0].short_title; // Title (short title)
    let datetime = data.events[0].datetime_local;
    let performer = data.events[0].performers[0].name;
    let eventUrl = data.events[0].url;
    let venueAddress = data.events[0].venue.address;
    let venueLat = data.events[0].venue.location.lat;
    let venueLon = data.events[0].venue.location.lon;
    console.log(category); // Check the data for event [0]
    console.log(title);
    console.log(datetime);
    console.log(performer);
    console.log(eventUrl);
    console.log(venueAddress);
    console.log(venueLat);
    console.log(venueLon);
    
    let centerLon = venueLon;
    let centerLat = venueLat;
    let leftLon = centerLon - 0.0030; // center + -0.002979934215559865
    let bottomLat = centerLat - 0.0014; // -0.0013757602265016544
    let rightLon = centerLon + 0.0030; // 0.0029799342155314434
    let topLat = centerLat + 0.0014; // 0.0013757287018094644

    document.getElementById("embeddedMap").setAttribute("src", `https://www.openstreetmap.org/export/embed.html?bbox=${leftLon}%2C${bottomLat}%2C${rightLon}%2C${topLat}&amp;layer=mapnik&amp;marker=${centerLat}%2C${centerLon}`);
  });