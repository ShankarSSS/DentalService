const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    mobile:String,
    email:String,
    source:String,
    appointment_date:Date,
    appointment_start_date:Date,
    appointment_end_date:Date,
    created_date:Date,
    created_by:String,
    product_id:String
});

module.exports = mongoose.model('Appointment',appointmentSchema);