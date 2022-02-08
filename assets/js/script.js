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
        console.log(data[index]);

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
  launchInfoEl.textContent = "Next Launch:";
  upcomingEl.appendChild(launchInfoEl);
  var redditEl = document.createElement("a");
  redditEl.setAttribute("href", reddit);
  redditEl.textContent = "Mission discussion (reddit)";
  upcomingEl.appendChild(redditEl);
  var dateEl = document.createElement("p");
  dateEl.innerHTML = "<strong>Launch date:</strong> " + date;
  upcomingEl.appendChild(dateEl);
  var flightEl = document.createElement("p");
  flightEl.innerHTML = "<strong>Flight number:</strong> " + flight;
  upcomingEl.appendChild(flightEl);
  var crewEl = document.createElement("p");
  crewEl.innerHTML = "<strong>Crew members:</strong> " + crew;
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
      payloadEl.innerHTML = "<strong>Payload:</strong> " + payload;
      upcomingEl.appendChild(payloadEl);
    });
  });

  fetch(launchpadUrl).then(function (response) {
    response.json().then(function (launchpadData) {
      var launchpad = launchpadData.full_name;

      var launchpadEl = document.createElement("p");
      launchpadEl.innerHTML = "<strong>Launch site: </strong><a href='" + launchSiteLink + "' target='_blank'>" + launchpad + "</a>";
      upcomingEl.appendChild(launchpadEl);
      var imgEl = document.createElement("img");
      imgEl.setAttribute("src", launchSiteImg);
      imgEl.setAttribute("style", "height:30%; width:30%;");
      upcomingEl.appendChild(imgEl);
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
          lon: data[1].longitiude,
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
          lon: data[5].longitiude,
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
          lon: data[4].longitiude,
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
          lon: data[2].longitiude,
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
  launchSiteCard.setAttribute(
    "style",
    "border:1px solid black; text-align:center; flex: 1 20%;"
  );

  var nameEl = document.createElement("h2");
  nameEl.textContent = obj.name;
  launchSiteCard.appendChild(nameEl);

  var locationEl = document.createElement("h3");
  locationEl.textContent = obj.loc;
  launchSiteCard.appendChild(locationEl);

  var imageLinkEl = document.createElement("a");
  imageLinkEl.setAttribute("href", obj.link);
  imageLinkEl.setAttribute("target", "_blank");
  imageLinkEl.innerHTML =
    "<img src='" + obj.img + "' style='height:50%; width:75%;' />";
  launchSiteCard.appendChild(imageLinkEl);

  launchSitesEl.appendChild(launchSiteCard);
};

launchSitesData();
nextLaunchData();

// fetch("https://api.spacexdata.com/v4/crew/[id string]").then(function(response) {
//     response.json().then(function(data) {
//         console.log(data); 
//     })
// })