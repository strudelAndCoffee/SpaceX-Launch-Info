const DateTime = luxon.DateTime;
var siteObjArr = [];

var nextLaunchData = function () {
  fetch("https://api.spacexdata.com/v4/launches/upcoming").then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayNextLaunch(data[0]);
      });
    }
  });
};

var displayNextLaunch = function (data) {

  // display elemnets
  let infoEl = document.querySelector("#next-info");
  let imgEl = document.querySelector("#next-img");
  let weatherEl = document.querySelector("#next-weather");

  // launch date
  infoEl.querySelector(".date").textContent = DateTime.fromISO(data.date_local).toLocaleString(DateTime.DATETIME_SHORT);
  // fight number
  infoEl.querySelector(".flight").textContent = data.flight_number;
  // reddit link
  infoEl.querySelector("a").href = data.links.reddit.campaign;

  // optional data
  // crew members
  if (data.crew.length == 0) {
    infoEl.querySelector(".crew").textContent = "N/A";
  } else if (data.crew.length > 0) {
    for (let i = 0; i < data.crew.length; i++) {
      var crew = data.crew.join(", ");
    }
    infoEl.querySelector(".crew").textContent = crew;
  };
  // mission details
  if (!data.details) {
    infoEl.querySelector(".details").textContent = "N/A";
  } else {
    infoEl.querySelector(".details").textContent = data.details;
  };
  // webcast
  if (!data.links.webcast) {
    infoEl.querySelector(".webcast").textContent = "N/A";
  } else {
    var link = data.links.webcast;
    infoEl.querySelector(".webcast").innerHTML = "<a href='" + link + "' target='_blank'>YouTube</a>";
  }

  // payload data
  let payloadUrl = "https://api.spacexdata.com/v4/payloads/" + data.payloads[0];
  fetch(payloadUrl).then(function (response) {
    response.json().then(function (payloadData) {
      infoEl.querySelector(".payload").textContent = payloadData.name;
    });
  });

  // launch site data
  let siteId = data.launchpad;
  let siteUrl = "https://api.spacexdata.com/v4/launchpads/" + siteId;
  fetch(siteUrl).then(function (response) {
    response.json().then(function (siteData) {

      let siteRegion = siteData.region;
      let lat = siteData.latitude;
      let lon = siteData.longitude;

      // weather data
      getWeatherData(lon, lat).then(weatherData => {
        let siteCity = weatherData.location.name;
        weatherEl.querySelector(".temp").textContent = weatherData.current.temp_f + " °F";
        weatherEl.querySelector(".vis").textContent = weatherData.current.vis_miles + " miles";
        weatherEl.querySelector("img").src = "https:" + weatherData.current.condition.icon;

        infoEl.querySelector(".city-state").textContent = siteCity + ", " + siteRegion;
        infoEl.querySelector(".name").textContent = siteData.full_name;
        imgEl.querySelector("img").src = siteData.images.large[0];
      });
    });
  });
};

var launchSitesData = function () {
  fetch("https://api.spacexdata.com/v4/launchpads").then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

        for (let i = 1; i < 6; i++) {

          var siteObj = {
            index: i,
            id: data[i].id,
            name: data[i].full_name,
            img: data[i].images.large[0],
            loc: data[i].region,
            lat: data[i].latitude,
            lon: data[i].longitude,
            details: data[i].details,
            launches: data[i].launches
          }

          switch(i) {
            case 1:
              siteObjArr.push(siteObj);
              displayLaunchSites(siteObj);
              break;
            case 2:
              siteObj.name = data[i].full_name + " (under construction)";
              siteObjArr.push(siteObj);
              displayLaunchSites(siteObj);
              break;
            case 3:
              break;
            case 4:
              siteObjArr.push(siteObj);
              displayLaunchSites(siteObj);
              break;
            case 5:
              siteObjArr.push(siteObj);
              displayLaunchSites(siteObj);
              break;
          };
        };
      });
    };
  });
};

var displayLaunchSites = function (obj) {

  let cardId = obj.index;
  let infoEl = document.querySelector("#site-info-" + cardId);
  let imgEl = document.querySelector("#site-img-" + cardId);
  let weatherEl = document.querySelector("#site-weather-" + cardId);

  infoEl.querySelector(".name").textContent = obj.name;
  infoEl.querySelector(".details").textContent = obj.details;
  imgEl.querySelector("img").src = obj.img;

  // weather and city name
  getWeatherData(obj.lon, obj.lat).then(weatherData => {
    console.log(weatherData);

    infoEl.querySelector(".city-state").textContent = weatherData.location.name + ", " + obj.loc;
    weatherEl.querySelector(".temp").textContent = weatherData.current.temp_f + " °F";
    weatherEl.querySelector(".vis").textContent = weatherData.current.vis_miles + " miles";
    weatherEl.querySelector("img").src = "https:" + weatherData.current.condition.icon;
  });
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

// modal code sourced from: https://bulma.io/documentation/components/modal/
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    console.log($target);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});

launchSitesData();
nextLaunchData();