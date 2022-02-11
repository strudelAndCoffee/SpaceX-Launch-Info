const DateTime = luxon.DateTime;
var launchSitesArr = [];

var nextLaunchData = function () {
  fetch("https://api.spacexdata.com/v4/launches/upcoming").then(function (response) {

    if (response.ok) {
      response.json().then(function (data) {
        displayNextLaunch(data[0]);
      });
    } else {
      var error = document.createElement("h3");
      error.textContent = "Could not retrieve data. Please try again later.";
      upcomingEl.appendChild(error);
    }
  });
};

var displayNextLaunch = function (data) {

  let date = DateTime.fromISO(data.date_local).toLocaleString(DateTime.DATETIME_SHORT);
  let siteId = data.launchpad;
  let siteUrl = "https://api.spacexdata.com/v4/launchpads/" + siteId;
  let payloadUrl = "https://api.spacexdata.com/v4/payloads/" + data.payloads[0];
  let flight = data.flight_number;
  let reddit = data.links.reddit.campaign;
  let crew = "";
  if (data.crew.length == 0) {
    crew = "N/A";
  } else if (data.crew.length > 0) {
    for (let i = 0; i < data.crew.length; i++) {
      crew = data.crew.join(", ");
    }
  };
  let details = "";
  if (!data.details) {
    details = "N/A";
  } else {
    details = data.details;
  };
  let webcast = "";
  if (!data.links.webcast) {
    webcast = "N/A";
  } else {
    webcast = data.links.webcast;
  }

  // payload data
  fetch(payloadUrl).then(function (response) {
    response.json().then(function (payloadData) {
      let payload = payloadData.name;
    });
  });

  // launch site data
  fetch(siteUrl).then(function (response) {
    response.json().then(function (siteData) {

      let siteFullName = siteData.full_name;
      let siteRegion = siteData.region;
      let siteImage = siteData.images.large[0];
      let siteDetails = siteData.details;
      let lat = siteData.latitude;
      let lon = siteData.longitude;

      // weather data
      getWeatherData(lon, lat).then(weatherData => {
        let siteCity = weatherData.location.name;
        let temp = weatherData.current.temp_f+" °F";
        let icon = weatherData.current.condition.icon;
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
          details: data[1].details,
          launches = data[1].launches
        }
        launchSitesArr.push(linkObj1);
        displayLaunchSites(linkObj1);

        // Kennedy Space Center Historic Launch Complex 39A
        var linkObj5 = {
          id: data[5].id,
          name: data[5].full_name,
          img: data[5].images.large[0],
          loc: data[5].region,
          lat: data[5].latitude,
          lon: data[5].longitude,
          details: data[5].details,
          launches = data[5].launches
        }
        launchSitesArr.push(linkObj5);
        displayLaunchSites(linkObj5);

        // Vandenberg Space Force Base Space Launch Complex 4E
        var linkObj4 = {
          id: data[4].id,
          name: data[4].full_name,
          img: data[4].images.large[0],
          loc: data[4].region,
          lat: data[4].latitude,
          lon: data[4].longitude,
          details: data[4].details,
          launches = data[4].launches
        }
        launchSitesArr.push(linkObj4);
        displayLaunchSites(linkObj4);

        // SpaceX South Texas Launch Site (under construction)
        var linkObj2 = {
          id: data[2].id,
          name: data[2].full_name + " (under construction...)",
          img: data[2].images.large[0],
          loc: data[2].region,
          lat: data[2].latitude,
          lon: data[2].longitude,
          details: data[2].details,
          launches = data[2].launches
        }
        launchSitesArr.push(linkObj2);
        displayLaunchSites(linkObj2);
      });
    }
    else {
      var error = document.createElement("h3");
      error.textContent = "Could not load data. Please try again later.";
    }
  });
};

var displayLaunchSites = function (obj) {

  // weather info
  // var weatherCard = document.createElement("div");
  // var tempEL = document.createElement("h2"); 
  // var cityNameEL = document.createElement("h2"); 
  // var imageEL=document.createElement("img")

  
  // getWeatherData(obj.lon, obj.lat).then(weatherData => {
  //   console.log(weatherData)

  //   tempEL.textContent= weatherData.current.temp_f+" °F";
  //   cityNameEL.textContent = weatherData.location.name;
  //   imageEL.src= "https:"+weatherData.current.condition.icon

  //   weatherCard.appendChild(cityNameEL);
  //   weatherCard.appendChild(tempEL);
  //   weatherCard.appendChild(imageEL)
  // });
};

// weather function
async function  getWeatherData(lon, lat) {

  // need to chain api calls in order to get weather png
  const response1 = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ String(lat) + "&lon="+ String(lon) + "&appid=35ba749d4db4fe6cbb94fc8036fea775");
  const data1 = await response1.json();
  const response2 = await fetch("https://api.weatherapi.com/v1/current.json?key=baafdcc671a24961b5e201219220102&q="+ data1.name + "&aqi=no");
  const data2 = await response2.json();
  return data2
};

launchSitesData();
nextLaunchData();