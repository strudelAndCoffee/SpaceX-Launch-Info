const DateTime = luxon.DateTime;
var upcomingEl = document.querySelector("#upcoming");
var launchSitesEl = document.querySelector("#launch-sites");

var launchSitesArr = [];

var nextLaunchData = function () {
  fetch("https://api.spacexdata.com/v4/launches/upcoming").then(function (response) {

    if (response.ok) {
      response.json().then(function (data) {

        console.log(data);

        var index = 0;

        // if (data[index].launch_library_id) {
        //   index++;
        // }

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

  var time = DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
  console.log(time);

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
      redditEl.setAttribute("target", "_blank");
      redditEl.textContent = "Mission discussion (reddit)";
      upcomingEl.appendChild(redditEl);

      fetch(launchpadUrl).then(function (response) {
        response.json().then(function (launchpadData) {
    
          var launchpad = launchpadData.full_name;
          // var lat = launchpadData.latitude;
          // var lon = launchpadData.longitude;
    
          var launchpadEl = document.createElement("p");
          launchpadEl.innerHTML = "<p><a href='#" + launchSiteLink + "' style='text-decoration:none;'><strong style='color:blue;'>Launch site: </strong>" + launchpad + "</p>";
          upcomingEl.appendChild(launchpadEl);
          var imgEl = document.createElement("img");
          imgEl.setAttribute("src", launchSiteImg);
          // style settings are temporary
          imgEl.setAttribute("style", "width:40%; border:1px solid blue; border-radius:4px;");
          upcomingEl.appendChild(imgEl);
        });
      });
    });
  });
};

var launchSitesData = function () {
  fetch("https://api.spacexdata.com/v4/launchpads").then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

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
  launchSiteCard.setAttribute("id", obj.link);
  launchSiteCard.setAttribute("style", "border:1px solid blue; text-align:center; width:45vw;");

  var locationEl = document.createElement("h2");
  locationEl.setAttribute("style", "color:blue;");
  locationEl.textContent = obj.loc;
  launchSiteCard.appendChild(locationEl);

  var nameEl = document.createElement("h2");
  nameEl.textContent = obj.name;
  launchSiteCard.appendChild(nameEl);

  var imageLinkEl = document.createElement("a");
  // these style settings are temporary
  imageLinkEl.innerHTML =
    "<img src='" + obj.img + "' style='width:75%; border-radius:4px;' />";
  launchSiteCard.appendChild(imageLinkEl);

  // var coordinatesEl = document.createElement("p");
  // coordinatesEl.innerHTML = "Latitude: " + obj.lat + "<br />" + "Longitude: " + obj.lon;
  // launchSiteCard.appendChild(coordinatesEl);

  // weather info
  var weatherCard = document.createElement("div");
  var tempEL = document.createElement("h2"); 
  var cityNameEL = document.createElement("h2"); 
  var imageEL=document.createElement("img")

  
  getWeatherData(obj.lon, obj.lat).then(weatherData => {
    console.log(weatherData)

    tempEL.textContent= weatherData.current.temp_f+" °F";
    cityNameEL.textContent = weatherData.location.name;
    imageEL.src= "https:"+weatherData.current.condition.icon


  
    weatherCard.appendChild(cityNameEL);
    weatherCard.appendChild(tempEL);
    weatherCard.appendChild(imageEL)


  });

  launchSiteCard.appendChild(weatherCard);
  launchSitesEl.appendChild(launchSiteCard);
};

// weather function
async function  getWeatherData(lon, lat) {

  // need to chain api calls in order to get weather png
  const response1 = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ String(lat) + "&lon="+ String(lon) + "&appid=35ba749d4db4fe6cbb94fc8036fea775");
  const data1 = await response1.json();
  const response2 = await fetch("https://api.weatherapi.com/v1/current.json?key=baafdcc671a24961b5e201219220102&q="+ data1.name + "&aqi=no");
  const data2 = await response2.json();
  return data2
}

launchSitesData();
nextLaunchData();
