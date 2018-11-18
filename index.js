"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');


const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(request, response) {
 
   const agent = new WebhookClient({ request, response });
  

  function makeAppointment (agent) {
    // Use the Dialogflow's date and time parameters to create Javascript Date instances, 'dateTimeStart' and 'dateTimeEnd',
    // which are used to specify the appointment's time.
    const appointmentDuration = 1;// Define the length of the appointment to be one hour.
    const dateTimeStart = convertParametersDate(agent.parameters.date, agent.parameters.time);
    const dateTimeEnd = addHours(dateTimeStart, appointmentDuration);
    const appointmentTimeString = getLocaleTimeString(dateTimeStart);
    const appointmentDateString = getLocaleDateString(dateTimeStart);
    
    $.ajax( { url: "https://api.mlab.com/api/1/dat",
		  data: JSON.stringify(
        { 
          "Name" : '',
          "AppointmentDate" : agent.parameters.date,
          "AppointmentStart": dateTimeStart,
          "AppointmentEnd": dateTimeEnd
        } ),
		  type: "POST",
      contentType: "application/json",
      success:function(data){
           agent.add(`Got it. I have your appointment scheduled on ${appointmentDateString} at ${appointmentTimeString}. See you soon. Good-bye.`);
      },
      error:function(xhr,status,err){
       agent.add(`Sorry, we're booked not able to book. Is there anything else I can do for you?`);
      }
    } );
    
  }
  let intentMap = new Map();
  intentMap.set('Make Appointment', makeAppointment);  // It maps the intent 'Make Appointment' to the function 'makeAppointment()'
  agent.handleRequest(intentMap);

});




// A helper function that receives Dialogflow's 'date' and 'time' parameters and creates a Date instance.
function convertParametersDate(date, time){
  return new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('-')[0] + timeZoneOffset));
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


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
