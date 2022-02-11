const DateTime = luxon.DateTime;
var launchSitesArr = [];

var nextLaunchData = function () {
  fetch("https://api.spacexdata.com/v4/launches/upcoming").then(function (response) {

    if (response.ok) {
      response.json().then(function (data) {

        displayNextLaunch(data[0]);
        // console.log(data);
      });

    } else {
      var error = document.createElement("h3");
      error.textContent = "Could not retrieve data. Please try again later.";
      upcomingEl.appendChild(error);
    }
  });
};

var displayNextLaunch = function (data) {

  var date = DateTime.fromISO(data.date_local).toLocaleString(DateTime.DATETIME_SHORT);
  var siteId = data.launchpad;
  var siteUrl = "https://api.spacexdata.com/v4/launchpads/" + siteId;
  var payloadUrl = "https://api.spacexdata.com/v4/payloads/" + data.payloads[0];
  var flight = data.flight_number;
  var reddit = data.links.reddit.campaign;
  var siteImg = "No Image Available";
  for (var i = 0; i < launchSitesArr.length; i++) {
    if (launchSitesArr[i].id != siteId) {
      siteImg = siteImg;
    } else {
      siteImg = launchSitesArr[i].img;
    }
  };
  var crew = "";
  if (data.crew.length == 0) {
    crew = "N/A";
  } else if (data.crew.length > 0) {
    for (var i = 0; i < data.crew.length; i++) {
      crew = data.crew.join(", ");
    }
  };

  fetch(payloadUrl).then(function (response) {
    response.json().then(function (payloadData) {
      let payload = payloadData.name;
    });
  });

  fetch(siteUrl).then(function (response) {
    response.json().then(function (launchpadData) {
      let launchpad = launchpadData.full_name;
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
