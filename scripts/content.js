// Cash loading
var waitForJQuery = setInterval(function () {
    if (typeof $ != 'undefined') {
        // place your code here.
        clearInterval(waitForJQuery);
    }
}, 10);

// VARs
var bearerToken;
var patientMeasurements;
var avarosHelperData = {};

// Compute BMI
function getBMI(data){
    if (! _.find(data.measurements, function(o){ return o.type == "HT" })){
        throw new Error('Height measurement not found');
    }
    if (! _.find(data.measurements, function(o){ return o.type == "WT" })){
        throw new Error('Weight measurement not found');
    }

    height = _.find(data.measurements, function(o){ return o.type == "HT" }).dataField;
    heightInMeters = height / 100;
    weight = _.find(data.measurements, function(o){ return o.type == "WT" }).dataField;
    bmi = weight / (heightInMeters * heightInMeters);

    avarosHelperData['height'] = height;
    avarosHelperData['weight'] = weight;
    avarosHelperData['bmi'] = bmi;
    console.log("Patients BMI is ", bmi);
}

// QUERY API

function fetchMeasurements(token){
    const rHeaders = new Headers();

    rHeaders.append("Content-Type", "application/json");
    rHeaders.append("Authorization", "bearer" + " " + token);
    rHeaders.append("Accept","application/json");
    
    url = window.location.href;
    demographicNo = _.last(_.split(url,"/"));

    const request = new Request("https://services.avaros.ca/av/api/chart/measurements/", {
        method: "POST",
        body: '{"demographics":[{"demographicNo":"' + demographicNo + '","clientName":"corktown"}]}',
        headers: rHeaders
    });

    return fetch(request)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched measurement data");
        patientMeasurements = data;
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// COOKIES

var myCookies;
function getJwtCookie(cookies) {
    var token;
    myCookies = cookies;
    jwt = _.find(cookies, function(o) { return o.name == "JWT"; });
    if (jwt) {
        token = _.trim(jwt.value,'"');
        bearerToken = token;
        return token;
    } else {
        console.log("JWT cookie not found. Please ensure user is logged in.");
        throw new Error('JWT cookie not found');
    }
}

// Storage
function updateStorage(){
    chrome.storage.session.set({ 'AV_data': avarosHelperData });
}

// Main

cookieStore.getAll().then(getJwtCookie).then(fetchMeasurements).then(getBMI).then(updateStorage);



