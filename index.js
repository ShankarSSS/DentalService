"use strict";
//Source for api call
//https://www.thepolyglotdeveloper.com/2017/10/consume-remote-api-data-nodejs-application/
const express = require("express");
const bodyParser = require("body-parser");
var Request = require("request");


const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');


const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

const timeZone = 'Asia/Calcutta';  // Change it to your time zone
const timeZoneOffset = '+05:30';  



restService.post("/", function(request, response) {
 
   const agent = new WebhookClient({ request, response });
  

  function makeAppointment (agent) {
   
  }

  function productList (agent) {    
    //agent.add(productList); 
   // agent.add(`Shankarnath : `+result); 
  }

  function appointmentList (agent) {    
  
  }

  function GetProducts(intentMap){

    Request.get("https://dental-services-api.herokuapp.com/products/List", (error, response, body) => {
      if(error) {
          return console.dir(error);
      }
     // console.dir(JSON.parse(body));
     var objectsOfObjects = JSON.parse(body);

     var productList='We are providing following services, ';   
      //iterating through 'objects of objects'
      for (var keyVal in objectsOfObjects) {
        if (objectsOfObjects.hasOwnProperty(keyVal)) {
         // Since dynamic, use [] since the key isn't literally named "keyVal"
          var obj = objectsOfObjects[keyVal]; 
          // NOW you can treat it like an obj
          productList += obj.name +' ,';
          //agent.add(new Suggestion(obj.name));
        }
    }
    //result=productList;
    productList = productList.slice(0,productList.length-1)
    agent.add(productList);

    // agent.add(new Card({
    //         title: `Title: this is a card title`,
    //         imageUrl: 'https://dialogflow.com/images/api_home_laptop.svg',
    //         text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //         buttonText: 'This is a button',
    //         buttonUrl: 'https://docs.dialogflow.com/'
    //       })
    //     );
    //     agent.add(new Suggestion(`Quick Reply`));
    //     agent.add(new Suggestion(`Suggestion`));
    //     agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});

    agent.handleRequest(intentMap);    
  });  
  }

  function GetAppointments(intentMap){

    Request.get("https://dental-services-api.herokuapp.com/appointments/List", (error, response, body) => {
      if(error) {
          return console.dir(error);
      }
     // console.dir(JSON.parse(body));
     var objectsOfObjects = JSON.parse(body);

     var appointmentList='';   
      //iterating through 'objects of objects'
      for (var keyVal in objectsOfObjects) {
        if (objectsOfObjects.hasOwnProperty(keyVal)) {
         // Since dynamic, use [] since the key isn't literally named "keyVal"
          var obj = objectsOfObjects[keyVal]; 
          // NOW you can treat it like an obj
          appointmentList += 'Patient Name : '+obj.name+', Appointment Date & Time : '+obj.appointment_start_date +',';
          //agent.add(new Suggestion(obj.name));
        }
    }
    //result=productList;
    //productList = productList.slice(0,productList.length-1)
    agent.add(appointmentList);

    agent.handleRequest(intentMap);    
  });  
  }
  
function SetAppointment(intentMap){
 // Use the Dialogflow's date and time parameters to create Javascript Date instances, 'dateTimeStart' and 'dateTimeEnd',
    // which are used to specify the appointment's time.
    const appointmentDuration = 1;// Define the length of the appointment to be one hour.
    var dateTimeStart = convertParametersDate(agent.parameters.date, agent.parameters.time);
    var dateTimeEnd = addHours(dateTimeStart, appointmentDuration);
    var appointmentTimeString = getLocaleTimeString(dateTimeStart);
    var appointmentDateString = getLocaleDateString(dateTimeStart);

    var currentDateTime = new Date().toLocaleString('en-US', {
      timeZone: timeZone
    });

    var dateTimeStartConverted = new Date(dateTimeStart).toLocaleString('en-US', {
      timeZone: timeZone
    });

    var dateTimeEndConverted = new Date(dateTimeEnd).toLocaleString('en-US', {
      timeZone: timeZone
    });

    // console.log(dateTimeStartConverted);
    // console.log(currentDateTime);

    Request.post({
      "headers": { "content-type": "application/json" },
      "url": "https://dental-services-api.herokuapp.com/appointments/",
      "body": JSON.stringify({         
          "name":agent.parameters.name,
          "mobile":agent.parameters.phoneNumber,
          "email":"shankar@gmail.com",
          "source":"",
          "appointment_date":dateTimeStartConverted,
          "appointment_start_date":dateTimeStartConverted,
          "appointment_end_date":dateTimeEndConverted,
          "created_date":currentDateTime,
          "created_by":""
      })
  }, (error, response, body) => {
      if(error) {
          return console.dir(error);
      }
      if(response.statusCode==200)
      {
        agent.add('Sorry, we are booked on '+appointmentDateString+' at '+appointmentTimeString);
      }
      else if(response.statusCode==409){
        agent.add('Dear '+agent.parameters.name+ ', your appointment scheduled on '+ appointmentDateString +' at '+ appointmentTimeString +'. See you soon. Good-bye');
      }
      else{
        agent.add('Sorry, booking failed');
      }
      agent.handleRequest(intentMap);  
  });    
}

  let intentMap = new Map();
  if (agent.intent == 'Make Appointment') {
    intentMap.set('Make Appointment', makeAppointment);  // It maps the intent 'Make Appointment' to the function 'makeAppointment()'
    SetAppointment(intentMap);
  }
  else if (agent.intent == 'Product List') {
    intentMap.set('Product List', productList); 
    GetProducts(intentMap);
  }
  else if (agent.intent == 'Appointment List') {
    intentMap.set('Appointment List', appointmentList); 
    GetAppointments(intentMap);
  }

});




// A helper function that receives Dialogflow's 'date' and 'time' parameters and creates a Date instance.
function convertParametersDate(date, time){
  return new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('+')[0] + timeZoneOffset));
}

// A helper function that adds the integer value of 'hoursToAdd' to the Date instance 'dateObj' and returns a new Data instance.
function addHours(dateObj, hoursToAdd){
  return new Date(new Date(dateObj).setHours(dateObj.getHours() + hoursToAdd));
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this time in English.
function getLocaleTimeString(dateObj){
  return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: timeZone });
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this date in English. 
function getLocaleDateString(dateObj){
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: timeZone });
}


restService.listen(process.env.PORT  || 8000, function() {
  console.log("Server up and listening");
});
