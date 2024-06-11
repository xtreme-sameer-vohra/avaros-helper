// Cash loading
var waitForJQuery = setInterval(function () {
    if (typeof $ != 'undefined') {
        // place your code here.
        loadData().then(updateMedCalcForm);
        clearInterval(waitForJQuery);
    }
}, 10);

var DAV_data;

function loadData() {
    return chrome.storage.session.get('AV_data').then( ({AV_data}) => { 
        console.log("med calc content avaros data load: ",AV_data); 
        DAV_data = AV_data;
        return AV_data;
    });
}

function updateMedCalcForm(AV_data){
    console.log("updateMedCalc got :", AV_data);
    $('input[name="age"]').val(AV_data.age);
    $('input[name="weight"]').val(AV_data.weight);
    $('input[name="height"]').val(AV_data.height);

}