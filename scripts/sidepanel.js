chrome.storage.session.onChanged.addListener((changes) => {
    const AV_data = changes['AV_data'];
    if (!AV_data) {
      return;
    }
    console.log('Chrome storage change event fired :', AV_data);
    updateSidePanel(AV_data.newValue);
});

function updateSidePanel(data) {
   console.log("updateSidePanel Data", data);
   $('#age').text(data.age);
   $('#sex').text(data.sex);
   $('#height').text(data.height);
   $('#weight').text(data.weight);
   $('#bmi').text(data.bmi);
}

console.log("side panel js running");
chrome.storage.session.get('AV_data').then( ({AV_data}) => { 
    console.log("side panel load: ",AV_data); 
    if (AV_data){
        updateSidePanel(AV_data);
    }
});