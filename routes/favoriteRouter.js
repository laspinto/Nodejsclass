const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
// to use cors pre-flight options
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {    
    Favorite.find({ user: req.user._id })

    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
            req.body.forEach(favorite => {
                if(!req.campsites.includes(favorite)){
                    req.campsites.push(favorite);
                } else {
                    console.log('favorite document exists');
                }
            });
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        } else {
            Favorite.create({user: req.user._id, campsites: req.body})
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }
    })  
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({"user": req.user._id})
    .then((favorite) => {
        res.statusCode = 200;
        if(favorite){
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete');
        }
    }).catch(err = next(err));
});

// campsiteId

favoriteRouter.route('/:campsiteId')
// to use cors pre-flight options
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {   
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.campsiteId); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {

    Favorite.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {       
            req.body.forEach(favorite => {
                if (!favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId);
                } else {
                    console.log('you already have a favorite campsite in this list')
                }
            });
            favorite.save()
                    .then((favorite) => {
                        console.log('Favorite Created ', favorite);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
        }
        else {
            Favorite.create({"user": req.user._id, "campsites": [req.params.campsiteId]})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.campsiteId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
// When the user performs a DELETE operation on '/favorites/:campsiteId', use findOne to find the favorites document for the user. 
Favorite.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {       
            req.body.forEach(favorite => {
                if (favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.deleteOne()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err));
                    favorite.save()
                    .then((favorite) => {
                        console.log('Favorite deleted', favorite);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                } 
            });
        }
        else {
            res.setHeader('Content-Type', 'text/plain')
            res.end('You do not have any favorites to delete')
        }
    });
});

module.exports = favoriteRouter;