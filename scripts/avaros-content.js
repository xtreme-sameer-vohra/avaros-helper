// Cash loading
var waitForJQuery = setInterval(function () {
    if (typeof $ != 'undefined') {
        // place your code here.
        waitForHeaderToLoad().then(parseAge).then(parseSex).then(getAgeSexPreventativeHealth).then(updateStorage);
        clearInterval(waitForJQuery);
    }
}, 10);

// VARs
var bearerToken;
var patientMeasurements;
var avarosHelperData = {};
avarosHelperData['preventative-health'] = {};
var avarosClientName;

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
    bmi = _.floor(weight / (heightInMeters * heightInMeters));

    avarosHelperData['height'] = height;
    avarosHelperData['weight'] = weight;
    avarosHelperData['bmi'] = bmi;

}

// BMI Preventative Health
function getBMIPreventativeHealth(){
    if (avarosHelperData['bmi'] > 25){
        avarosHelperData['preventative-health']['Overweight / Obese'] = [];
        avarosHelperData['preventative-health']['Overweight / Obese'].push("Structured behavioural interventions for weight loss");
        avarosHelperData['preventative-health']['Overweight / Obese'].push("Screen for mental illness if obese");
        avarosHelperData['preventative-health']['Overweight / Obese'].push("Multidisciplinary approach");
    }
}

// Patient Age
function waitForHeaderToLoad(){
    return new Promise((resolve) => {
        var waitForHeaderText = setInterval(function () {
            if ($('.header-node') && $('.header-node').text() != "") {
                clearInterval(waitForHeaderText);
                resolve('resolved');
            }
        }, 10); 
    });
}

function parseAge(){
    headertext = $('.header-node').text();
    // Check for date in YYYY-MM-DD format
    result = headertext.match(/\d{4}-\d{2}-\d{2}/);
    if (!result || !result[0]){
        console.log("Unable to obtain age. No match:", result, " headertext: ", headertext);
        return;
    }
    date = result[0];
    avarosHelperData['dob'] = date;

    deltaTime = new Date() - new Date(date);
    days = deltaTime / (1000 * 60 * 60 * 24);
    years = _.floor(days / 365);
    console.log("DOB is :",date, " age is:", years);

    avarosHelperData['dob'] = date;
    avarosHelperData['age'] = years;
}

function getAgeSexPreventativeHealth(){
    if (avarosHelperData['age'] > 65 & avarosHelperData['sex'] == "Male"){
        avarosHelperData['preventative-health']['Over 65'] = [];
        avarosHelperData['preventative-health']['Over 65'].push("AAA screen (ultrasound once 65 to 80 yrs)");
    }
    if (avarosHelperData['age'] > 50 & avarosHelperData['sex'] == "Female"){
        avarosHelperData['preventative-health']['Over 50'] = [];
        avarosHelperData['preventative-health']['Over 50'].push("Mammography (50-74 yrs, q2-3 yrs)");
        avarosHelperData['preventative-health']['Over 50'].push("Acellular pertussis vaccine vaccine (≥50 yrs) (2 doses)");
    }
    if (avarosHelperData['age'] < 45 & avarosHelperData['sex'] == "Female"){
        avarosHelperData['preventative-health']['Under 45'] = [];
        avarosHelperData['preventative-health']['Under 45'].push("Human papillomavirus vaccine (up to 45 yrs)");
    }
    if (avarosHelperData['age'] > 25 & avarosHelperData['sex'] == "Female"){
        avarosHelperData['preventative-health']['Over 25'] = [];
        avarosHelperData['preventative-health']['Over 25'].push("Cervical Cytology q3 yrs (if ever sexually active and 25-69 yrs)");
    }

    if (avarosHelperData['age'] > 65){
        !avarosHelperData['preventative-health']['Over 65'] ? avarosHelperData['preventative-health']['Over 65'] = [] : null;
        avarosHelperData['preventative-health']['Over 65'].push("Hemoccult Multiphase 2 yrs (60 to 74 yrs) FOBT or FIT OR Sigmoidoscopy q10 yrs");
        avarosHelperData['preventative-health']['Over 65'].push("Audioscope (or inquire/whispered voice test)");
    }
    if (avarosHelperData['age'] > 55){
        avarosHelperData['preventative-health']['Over 55'] = [];
        avarosHelperData['preventative-health']['Over 55'].push("Low dose CT scan q1 yr (55-74 yrs) if risk factors (≥30 pack/yr, currently smoke or quit less than 15 yrs ago) up to 3 times");
    }
    if (avarosHelperData['age'] > 40){
        avarosHelperData['preventative-health']['Over 40'] = [];
        avarosHelperData['preventative-health']['Over 40'].push("Lipid Profile q1-5 yrs");
    }

}

// Patient Sex
function parseSex(){
    headertext = $('.header-node').text();
    // Check for date in YYYY-MM-DD format
    result = headertext.match(/years\)(\w)/);
    if (!result || !result[0]){
        console.log("Unable to obtain sex. No match:", result, " headertext: ", headertext);
        return;
    }
    abbvSex = result[1];

    if (abbvSex == "M" || abbvSex == "m") {
        avarosHelperData['sex'] = "Male";
    }else if (abbvSex == "F" || abbvSex == "f") {
        avarosHelperData['sex'] = "Female";
    }else if (abbvSex == "T" || abbvSex == "t") {
        avarosHelperData['sex'] = "Transgender";
    } else {
        avarosHelperData['sex'] = "Unknown";
    }
}

// QUERY API

function fetchMeasurements(token){
    const rHeaders = new Headers();

    rHeaders.append("Content-Type", "application/json");
    rHeaders.append("Authorization", "bearer" + " " + token);
    rHeaders.append("Accept","application/json");
    
    url = window.location.href;
    demographicNo = _.last(_.split(url,"/"));

    // clientName can be obtained from /demographics API endpoint
    const request = new Request("https://services.avaros.ca/av/api/chart/measurements/", {
        method: "POST",
        body: '{"demographics":[{"demographicNo":"' + demographicNo + '","clientName":"' + avarosClientName +'"}]}',
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

function fetchAvarosClientName(token){
    const rHeaders = new Headers();

    rHeaders.append("Content-Type", "application/json");
    rHeaders.append("Authorization", "bearer" + " " + token);
    rHeaders.append("Accept","application/json");

    url = window.location.href;
    demographicNo = _.last(_.split(url,"/"));

    // clientName can be obtained from /demographics API endpoint
    const request = new Request("https://services.avaros.ca/av/api/chart/link/demographic/?demographicNo=" + demographicNo, {
        method: "GET",
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
        avarosClientName = data.clientName;
        return token;
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

cookieStore.getAll().then(getJwtCookie).then(fetchAvarosClientName).then(fetchMeasurements).then(getBMI).then(getBMIPreventativeHealth).then(updateStorage);



