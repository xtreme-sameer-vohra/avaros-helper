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

   if (data.lmp){
      $('#lmp').text(data.lmp);
      $('#edd').text(data.edd);
      $('#lmp').closest('tr').show();
      $('#edd').closest('tr').show();
   } else {
      $('#lmp').closest('tr').hide();
    $('#edd').closest('tr').hide();
   }


   $('#preventative-health').empty();
   if (data['preventative-health'].length > 0){
      header = $('<h3>Preventative Health</h3>');
      $('#preventative-health').append(header);
      _.forEach(data['preventative-health'], (value, key) => {
            console.log(key, value);
            header = $('<h4></h4>');
            header.text(key);
            details = $('<ul></ul>');
            _.forEach(value, (item) => {
                details.append($('<li></li>').text(item));
            });
            $('#preventative-health').append(header);
            $('#preventative-health').append(details);
    });
   }
}

console.log("side panel js running");
chrome.storage.session.get('AV_data').then( ({AV_data}) => { 
    console.log("side panel load: ",AV_data); 
    if (AV_data){
        updateSidePanel(AV_data);
    }
});