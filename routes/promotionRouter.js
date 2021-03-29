
const express = require('express');

const Promotion = require("../models/promotion");
const authenticate = require('../authenticate');
const router = express.Router();

const cors = require('./cors');


router .get("/", (req, res) => { 
        Promotion.find()
            .then(promotions => {
                res.send(promotions);
             })
            .catch(err => res.status(400).send(err));
    })

    router.post("/", authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {

        Promotion.create(req.body)
            .then(promotion => {
                
            res.send(promotion);
            })
            .catch(err => res.status(400).send(err));
        
    })


    router.put("/", authenticate.verifyUser,(req, res) => {
        res.status(403).send("Put not supported");
        

    })

    router.delete("/", authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Promotion.deleteMany()
            .then(response => {
            res.send(response);
         })

            .catch(err => res.status(400).send(err));
    });


  router.get("/:promotionId", (req, res) => {
        Promotion.findById(req.params.promotionId, (err, promotion) => {
            if (err)  {
                res.status(400).send(err);
            }
             res.send(promotion); 
             
        });
            
    

    router.post("/:promotionId", authenticate.verifyUser,(req, res) => {
        res.status(400).send(`POST operation not supported on /promotions/${req.params.promotionId}`
        );
    }
    );

    router.put(
        "/:promotionId",
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
          Promotion.findByIdAndUpdate(
            req.params.promotionId,
            {
              $set: req.body
            },
            { new: true }
          )
            .then(promotion => {
              res.send(promotion);
            })
            .catch(err => res.status(400).send(err));
        }
      );
        
         router.delete("/:promotion", authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {

        Promotion.findByIdAndDelete(req.params.promotionId)
            .then(promotion => {
                res.send(promotion);
            })

            .catch(err => res.status(400).send(err));
  
                
})


//promotionRouter.route('/:promotionId/comments')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {

     Promotion.findById(req.params.promotionId)
            .then(promotion => {
                if (promotion) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion.comments);

                } else {
                    err = new Error(`Promotion ${req.params.promotionId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })

            .catch(err => next(err));
    })

    .post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {

        Promotion.findById(req.params.promotionId)
            .then(promotion => {
                if (promotion) {
                    promotion.comments.push(req.body);
                    promotion.save()
                        .then(promotion => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotion);

                        })
                        .catch(err => next(err));

                } else {
                    err = new Error(`Promotion ${req.params.promotionId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })

            .catch(err => next(err));
    })

    .put(cors.corsWithOptions  ,authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /promotions/${req.params.promotionId}/comments`);
    })
    .delete ( ecors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {

        Promotion.findById(req.params.promotionId)
            .then(promotion => {

                if (promotion) {
                    for (let i = (promotion.comments.length - 1); i >= 0; i--) {
                        partner.comments.id(promotion.comments[i]._id).remove();
                    }
                    promotion.save()
                        .then(promotion => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotiomn);

                        })
                        .catch(err => next(err));

                } else {
                    err = new Error(`Campsite ${req.params.promotionId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));

            
    });

   // promotionRouter.route('/:promotionId/comments/:commentID')

    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {

    
        Promotion.findById(req.params.promotionId)
            .then(promotion => {
                if (promotion && promotion.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion.comments.id(req.params.commentId));
                } else if (!partner) {
                    err = new Error(`Promotion ${req.params.promotionId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })

    .post(cors.corsWithOptions,authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotion/${req.params.promotionId}/comments/${req.params.commentId}`);

    })
    .put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then(partner => {
                if (promotion && promotion.comments.id(req.params.commentId)) {
                    if (req.body.rating) {
                        promotion.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.text) {
                        promotion.comments.id(req.params.commentId).text = req.body.text;
                    }
                    promotion.save()
                        .then(promotion => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotion);
                        })

                        .catch(err => next(err));

                } else if (!promotion) {
                    err = new Error(`Promotion ${req.params.promotionId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })

            .catch(err => next(err));

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then(promotion => {
                if (promotion && promotion.comments.id(req.params.commentId)) {
                    promotion.comments.id(req.params.commentId).remove();
                    promotion.save()
                        .then(promotion => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotion);
                        })

                        .catch(err => next(err));

                } else if (!promotion) {
                    err = new Error(`Promotiomn ${req.params.promotiomnId} not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Comment ${req.params.commentId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })

            .catch(err => next(err));
    });


module.export = router;