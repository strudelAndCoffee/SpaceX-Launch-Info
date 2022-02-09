var upcomingEl = document.querySelector("#upcoming");
var launchSitesEl = document.querySelector("#launch-sites");

var launchSitesArr = [];

var nextLaunchData = function () {
  fetch("https://api.spacexdata.com/v4/launches/upcoming").then(function (response) {

    if (response.ok) {
      response.json().then(function (data) {

        var index = 0;

        if (data[index].launch_library_id) {
          index++;
        }

        displayNextLaunch(data[index]);
      });

    } else {
      var error = document.createElement("h3");
      error.textContent = "Could not retrieve data. Please try again later.";
      upcomingEl.appendChild(error);
    }
  });
};

var displayNextLaunch = function (data) {

  var date = data.date_local;
  var flight = data.flight_number;
  var reddit = data.links.reddit.campaign;
  var crew = "";

  if (data.crew.length == 0) {
    crew = "N/A";
  } else if (data.crew.length > 0) {
    for (var i = 0; i < data.crew.length; i++) {
      crew = data.crew.join(", ");
    }
  }

  var launchInfoEl = document.createElement("h2");
  launchInfoEl.setAttribute("style", "color:blue; padding-bottom:15px;");
  launchInfoEl.textContent = "Next Launch:";
  upcomingEl.appendChild(launchInfoEl);
  var dateEl = document.createElement("p");
  dateEl.innerHTML = "<strong style='color:blue;'>Launch date:</strong> " + date;
  upcomingEl.appendChild(dateEl);
  var flightEl = document.createElement("p");
  flightEl.innerHTML = "<strong style='color:blue;'>Flight number:</strong> " + flight;
  upcomingEl.appendChild(flightEl);
  var crewEl = document.createElement("p");
  crewEl.innerHTML = "<strong style='color:blue;'>Crew members:</strong> " + crew;
  upcomingEl.appendChild(crewEl);

  var launchpadId = data.launchpad;
  var launchpadUrl = "https://api.spacexdata.com/v4/launchpads/" + launchpadId;
  var launchSiteLink = "";
  var launchSiteImg = "";
  var payloadId = data.payloads[0];
  var payloadUrl = "https://api.spacexdata.com/v4/payloads/" + payloadId;

  for (var i = 0; i < launchSitesArr.length; i++) {
    if (launchSitesArr[i].id != launchpadId) {
      launchSiteLink = launchSiteLink;
      launchSiteImg = launchSiteImg;
    } else if (launchSitesArr[i].id == launchpadId) {
      launchSiteLink = launchSitesArr[i].link;
      launchSiteImg = launchSitesArr[i].img;
    } else {
      launchSiteLink = "./index.html"
    }
  }

  fetch(payloadUrl).then(function (response) {
    response.json().then(function (payloadData) {
      var payload = payloadData.name;

      var payloadEl = document.createElement("p");
      payloadEl.innerHTML = "<strong style='color:blue;'>Payload:</strong> " + payload;
      upcomingEl.appendChild(payloadEl);
      var redditEl = document.createElement("a");
    redditEl.setAttribute("href", reddit);
    redditEl.textContent = "Mission discussion (reddit)";
    upcomingEl.appendChild(redditEl);
    });
  });

  fetch(launchpadUrl).then(function (response) {
    response.json().then(function (launchpadData) {

      console.log(launchpadData);

      var launchpad = launchpadData.full_name;
      var lat = launchpadData.latitude;
      var lon = launchpadData.longitude;

      var launchpadEl = document.createElement("p");
      launchpadEl.innerHTML = "<strong style='color:blue;'>Launch site: </strong><a href='" + launchSiteLink + "' target='_blank'>" + launchpad + "</a>";
      upcomingEl.appendChild(launchpadEl);
      var imgEl = document.createElement("img");
      imgEl.setAttribute("src", launchSiteImg);
      // style settings are temporary
      imgEl.setAttribute("style", "width:40%; border:1px solid blue; border-radius:4px;");
      upcomingEl.appendChild(imgEl);

      // weather info
      fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=13ddc6bf74170f310b01600989915eea")
      .then(function(response) {
        response.json()
        .then(function(data) {
          console.log(data);

          var temp = data.current.temp + "°F";
          var uvi = data.current.uvi;
          var vis = data.current.visibility + " meters";
          var iconUrl = "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";

          var weatherEl = document.createElement("div");
          weatherEl.setAttribute("style", "background-color:black; width:300px;");
          var textData = document.createElement("div");
          textData.innerHTML = "<h3 style='padding-bottom:10px;'>Current Weather at Location</h3><p><strong style='color:blue;'>Temperature: </strong>" + temp + "<br /><strong style='color:blue;'>UV Index: </strong>" + uvi + "<br /><strong style='color:blue;'>Visibility: </strong>" + vis;
          weatherEl.appendChild(textData);
          var imgEl = document.createElement("div");
          imgEl.innerHTML = "<img src='" + iconUrl + "' />";
          weatherEl.appendChild(imgEl);
          upcomingEl.appendChild(weatherEl);
        })
      });
    });
  });
};

var launchSitesData = function () {
  fetch("https://api.spacexdata.com/v4/launchpads").then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

        console.log(data);

        // Cape Canaveral Space Force Station Space Launch Complex 40 info
        var linkObj1 = {
          id: data[1].id,
          name: data[1].full_name,
          img: data[1].images.large[0],
          loc: data[1].region,
          lat: data[1].latitude,
          lon: data[1].longitude,
          link: "./capeCanaveral.html"
        }
        launchSitesArr.push(linkObj1);
        displayLaunchSiteLinks(linkObj1);

        // Kennedy Space Center Historic Launch Complex 39A
        var linkObj5 = {
          id: data[5].id,
          name: data[5].full_name,
          img: data[5].images.large[0],
          loc: data[5].region,
          lat: data[5].latitude,
          lon: data[5].longitude,
          link: "./kennedy.html"
        }
        launchSitesArr.push(linkObj5);
        displayLaunchSiteLinks(linkObj5);

        // Vandenberg Space Force Base Space Launch Complex 4E
        var linkObj4 = {
          id: data[4].id,
          name: data[4].full_name,
          img: data[4].images.large[0],
          loc: data[4].region,
          lat: data[4].latitude,
          lon: data[4].longitude,
          link: "./vandenberg.html"
        }
        launchSitesArr.push(linkObj4);
        displayLaunchSiteLinks(linkObj4);

        // SpaceX South Texas Launch Site (under construction)
        var linkObj2 = {
          id: data[2].id,
          name: data[2].full_name + " (under construction...)",
          img: data[2].images.large[0],
          loc: data[2].region,
          lat: data[2].latitude,
          lon: data[2].longitude,
          link: "./southTexas.html"
        }
        launchSitesArr.push(linkObj2);
        displayLaunchSiteLinks(linkObj2);
      });
    }
    else {
      var error = document.createElement("h3");
      error.textContent = "Could not load data. Please try again later.";
      launchSitesEl.appendChild(error);
    }
  });
};

var displayLaunchSiteLinks = function (obj) {

  var launchSiteCard = document.createElement("div");
  // to set class for Bulma styling
  // launchSiteCar.className = "";
    launchSiteCard.setAttribute(
    "style",
    "border:1px solid blue; text-align:center; width:45vw;"
  );

  var nameEl = document.createElement("h2");
  nameEl.textContent = obj.name;
  launchSiteCard.appendChild(nameEl);

  var locationEl = document.createElement("h3");
  locationEl.setAttribute("style", "color:blue;");
  locationEl.textContent = obj.loc;
  launchSiteCard.appendChild(locationEl);

  var imageLinkEl = document.createElement("a");
  // these style settings are temporary
  imageLinkEl.innerHTML =
    "<img src='" + obj.img + "' style='width:75%; border-radius:4px;' />";
  launchSiteCard.appendChild(imageLinkEl);

  var coordinatesEl = document.createElement("p");
  coordinatesEl.innerHTML = "Latitude: " + obj.lat + "<br />" + "Longitude: " + obj.lon;
  launchSiteCard.appendChild(coordinatesEl);

  launchSitesEl.appendChild(launchSiteCard);
};

// fetch(apiUrl)
//     .then(function(response) {
//         if (response.ok) {
//             response.json()
//             .then(function(data) {

//                 if (!data[0]) {
//                     alert("City name not recognized. Please try again");
//                 } else {
//                     var city = data[0].name;
//                     var lat = data[0].lat;
//                     var lon = data[0].lon;
//                     var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&";
//                     displayCityWeather(city, url);
//                     saveCity(city, url);
//                 }
//             })
//         } else {
//             alert("Cannot complete request at this time.");
//         }
//     });


launchSitesData();
nextLaunchData();