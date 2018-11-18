const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// CORS error handling
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Orgin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Orgin,X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

const productsRoute = require('./api/routes/products');
const appointmentsRoute = require('./api/routes/appointments');

//database
mongoose.connect('mongodb://dental-user:'+ process.env.MONGO_ATLAS_PW +'@cluster0-shard-00-00-gsvla.mongodb.net:27017,cluster0-shard-00-01-gsvla.mongodb.net:27017,cluster0-shard-00-02-gsvla.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{
    useMongoClient:true
});


//logging
app.use(morgan('dev'));

//parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/products',productsRoute);
app.use('/appointments',appointmentsRoute);

// send not found error, to error handling method
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status=404;
    next(error);
});

//error handling
app.use((error, req, res, next) => {
res.status(error.status);
res.json({
    error:{
        message:error.message
    }
});
});
    

module.exports=app;