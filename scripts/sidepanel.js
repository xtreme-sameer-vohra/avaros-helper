chrome.storage.session.onChanged.addListener((changes) => {
    const AV_data = changes['AV_data'];
    if (!AV_data) {
      return;
    }
    console.log('Chrome storage change event fired :', AV_data);
    updateBMI(AV_data.newValue);
});

function updateBMI(data) {
   console.log("updateBMI Data", data);
   $('#height').text(data.height);
   $('#weight').text(data.weight);
   $('#bmi').text(data.bmi);
}

console.log("side panel js running");
chrome.storage.session.get('AV_data').then( ({AV_data}) => { 
    console.log("side panel load: ",AV_data); 
    if (AV_data){
        updateBMI(AV_data);
    }
});