const express = require('express');
const Campsite = require('../models/campsite');

const campsiteRouter = express.Router();


campsiteRouter.route('/')

.get((req, res, next) => {
    Campsite.find()
    .then(campsites => {
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json');
        res.json(campsites);
    })
        
    // delete this : res.end('Will send all the campsites to you');

    .catch(err => next(err));
})

.post((req, res, next) => {
    
    Campsite.create(req.body)
    .then(campsite => {
        console.log('Campsite Created ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})


  //delete this;  res.end(`Will add the campsite: ${req.body.name} with description: ${req.body.description}`);

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next) => {
    
        Campsite.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });

   //  Delete this;  res.end('Deleting all campsites');


campsiteRouter.route('/:campsiteId')

 
.get((req, res, next) => {

    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})


    // delete this: res.end (`Will send details of  the campsite:${req.params.campsiteId}to you`);

.post((req, res) => {
    res. statusCode = 403;
   
   // res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);correct one
})
  //  res.end(`Will add the campsite: ${req.body.name} with description: ${req.body.description}`);

.put((req, res, next ) => {

    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, { new: true })
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
   
    //res.statusCode = 403;
    //res.end('PUT operation not supported on /campsites');

.delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));

   //delete this : res.end('Deleting all campsites');
});


module.exports = campsiteRouter;