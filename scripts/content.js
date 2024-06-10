console.log("Hi from Avros Helper wow");

var waitForJQuery = setInterval(function () {
    if (typeof $ != 'undefined') {
        // place your code here.
        $('html').addClass ( 'dom-loaded' );
        $('<footer>Appended with Cash</footer>').appendTo ( document.body );
        clearInterval(waitForJQuery);
    
    }
}, 10);

// VARs
var myCookies;
var bearerToken;
var patientMeasurements;


// Compute BMI
function getBMI(){
    height = _.find(patientMeasurements.measurements, function(o){ return o.type == "HT" }).dataField;
    heightInMeters = height / 100;
    weight = _.find(patientMeasurements.measurements, function(o){ return o.type == "WT" }).dataField;

    bmi = weight / (heightInMeters * heightInMeters);
    console.log("Patients BMI is ", bmi);
}

// QUERY API

function fetchMeasurements(){
    const rHeaders = new Headers();

    rHeaders.append("Content-Type", "application/json");
    rHeaders.append("Authorization", "bearer" + " " + bearerToken);
    rHeaders.append("Accept","application/json");
    
    const request = new Request("https://services.avaros.ca/av/api/chart/measurements/", {
        method: "POST",
        body: '{"demographics":[{"demographicNo":"48125","clientName":"river"}]}',
        headers: rHeaders
    });

    fetch(request)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Gott the data");
        console.log(data);
        patientMeasurements = data;
        getBMI();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// COOKIES

function parseCookies(cookies) {
    console.log("Got cookie")
    myCookies = cookies;
    jwt = _.find(cookies, function(o) { return o.name == "JWT"; });
    bearerToken = _.trim(jwt.value,'"');
}


cookieStore.getAll().then(parseCookies).then(fetchMeasurements);



