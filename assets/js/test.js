// useful urls
// "https://api.spacexdata.com/v4/launches/latest"
// "https://api.spacexdata.com/v5/launches/next"
// "https://api.spacexdata.com/v5/launches/upcoming"
// "https://api.spacexdata.com/v4/payloads/[id string]"
// "https://api.spacexdata.com/v4/rockets/[id string]"
// "https://api.spacexdata.com/v4/crew"
// "https://api.spacexdata.com/v4/crew/[id string]"


// fetch request
fetch("url").then(function(response) {
    response.json().then(function(data) {
        console.log(data); 
    })
})


// next launch date
// fetch("https://api.spacexdata.com/v5/launches/next").then(function(response) {
//     response.json().then(function(data) {
//         console.log(data.date_local); 
//     })
// })


// link to youtube webcast, streams lauch live, and archives video after launch 
// fetch("https://api.spacexdata.com/v4/launches/latest").then(function(response) {
//     response.json().then(function(data) {
//         console.log(data.links.webcast); 
//     })
// })


// Cape Canaveral Space Force Station Space Launch Complex 40 info
// fetch("https://api.spacexdata.com/v4/launchpads").then(function(response) {
//     response.json().then(function(data) {

//         // full info
//         console.log(data[1]);

//         // details
//         console.log(data[1].details);

//         // location
//         console.log(data[1].longitude);
//         console.log(data[1].latitude);

//         // image
//         console.log(data[1].images.large[0]);
//     })
// });

// Landing Zone 1, Cape Canaveral
// fetch("https://api.spacexdata.com/v4/landpads/5e9e3032383ecb267a34e7c7").then(function(response) {
//     response.json().then(function(data) {
//         console.log(data); 
//     })
// })
// Landing Zone 2, Cape Canaveral
// fetch("https://api.spacexdata.com/v4/landpads/5e9e3032383ecb90a834e7c8").then(function(response) {
//     response.json().then(function(data) {
//         console.log(data); 
//     })
// })

// Vandenberg Space Force Base Space Launch Complex 4E
// fetch("https://api.spacexdata.com/v4/launchpads").then(function(response) {
//     response.json().then(function(data) {

//         // full info
//         console.log(data[4]);

//         // details
//         console.log(data[4].details);

//         // location
//         console.log(data[4].longitude);
//         console.log(data[4].latitude);

//         // image
//         console.log(data[4].images.large[0]);
//     })
// });

// Landing Zone 4, Vandenberg Air Force Base
// fetch("https://api.spacexdata.com/v4/landpads/5e9e3032383ecb554034e7c9").then(function(response) {
//     response.json().then(function(data) {
//         console.log(data); 
//     })
// })

// Kennedy Space Center Historic Launch Complex 39A
// fetch("https://api.spacexdata.com/v4/launchpads").then(function(response) {
//     response.json().then(function(data) {

//         // full info
//         console.log(data[5]);

//         // details
//         console.log(data[5].details);

//         // location
//         console.log(data[5].longitude);
//         console.log(data[5].latitude);

//         // image
//         console.log(data[5].images.large[0]);
//     })
// });

// SpaceX South Texas Launch Site (under construction)
// fetch("https://api.spacexdata.com/v4/launchpads").then(function(response) {
//     response.json().then(function(data) {

//         // full info
//         console.log(data[2]);

//         // details
//         console.log(data[2].details);

//         // location
//         console.log(data[2].longitude);
//         console.log(data[2].latitude);

//         // image
//         console.log(data[2].images.large[0]);
//     })
// });