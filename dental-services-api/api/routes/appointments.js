const express = require('express');
const routes = express.Router();

routes.get('/', (req, res, next) => {
    res.status(200).json({
        'Message': '/appointment handled in get'
    });
});

routes.get('/:appointmentId', (req, res, next) => {
    const id=req.params.appointmentId;
    res.status(200).json({
        'Message': 'appointment Id is '+id
    });
});

routes.post('/', (req, res, next) => {
    res.status(200).json({
        'Message': '/appointment handled in post'
    });
});

routes.patch('/:appointmentId', (req, res, next) => {
    const id=req.params.appointmentId;
    res.status(200).json({
        'Message': 'Update appointment Id is '+id
    });
});

routes.delete('/:appointmentId', (req, res, next) => {
    const id=req.params.appointmentId;
    res.status(200).json({
        'Message': 'Delete appointment Id is '+id
    });
});


module.exports=routes;