const express = require('express');
const Partner = require('../models/partner');
const partnersRouter = express.Router();
const router = Router();
const authenticate = require('../authenticate');





router.get ("/", (req, res) => {
    Partner.find()
    .then(partners => {
     res.send(partners);
  })
    .catch(err => {
        res.status(400).send (err);
     });
    });


router.post("/" , authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {

    Partner.create(req.body)
    .then(partner => {
        res.send(partner);
        })

    .catch(err => res.status(400).send(err));
})
    

router.put("/", authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT not supported');
})
router.delete("/", authenticate.verifyUser, authenticate.verifyAdmin,(req, res ) => {
     Partner.deleteMany()
            .then(response => {
                res.statusCode = 200;
                
                res.send(response);
            })
            .catch(err => res.status(400).send(err));
    });

    module.export = router;



partnerRouter.route('/:partnerId')


router.get("/:partnerId", (req, res ) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        res.statusCode = 200;
        
        res.send(partner);
    })
    .catch(err => res.status400.send(err));
})

router.post("/:partner", authenticate.verifyUser,(req, res) => {
    res.status= 403;
    res.send (`POST operation not supported on /partners/${req.params.partnerId}`);

})

router.put("/:partner", authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    }, { new: true })
        .then(partner=> {
            res.send(partner);
         })

        .catch(err => resizeTo.status(400).send(err));

})
router.delete("/: partner", authenticate.verifyUser,authenticate.verifyAdmin,(req, res ) => {

    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.send(partner);

    })
    .catch(err => resizeTo.status(400).send(err));
});


partnerRouter.route('/:partnerId/comments')

    .get((req, res, next) => {

        Partner.findById(req.params.partnerId)
            .then(partner => {
                if (partner) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(partner.comments);

                } else {
                    err = new Error(`Partner ${req.params.partnerId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })

        .catch(err => next(err));
    })

    .post(authenticate.verifyUser,(req, res, next) => {

        Partner.findById(req.params.campsiteId)
            .then(partner => {
                if (partner) {
                    partner.comments.push(req.body);
                    partner.save()
                        .then(partner => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(partner);

                        })
                        .catch(err => next(err));

                } else {
                    err = new Error(`Partner ${req.params.partnerId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })

            .catch(err => next(err));
    })

     .put(authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /partners/${req.params.partnerId}`);
    })
    .delete(authenticate.verifyUser,(req, res, next) => {

        Partner.findById(req.params.partnerId)
            .then(partner => {

                if (partner) {
                    for (let i = (partner.comments.length - 1); i >= 0; i--) {
                        partner.comments.id(partner.comments[i]._id).remove();
                    }
                    partner.save()
                        .then(partner => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(partner);

                        })
                        .catch(err => next(err));

                } else {
                    err = new Error(`Campsite ${req.params.partnerId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

     partnerRouter.route('/:partnerId/comments/:commentId')

    .get((req, res, next) => {
        Partner.findById(req.params.partnerId)
            .then(partner => {
                if (partner && partner.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(partner.comments.id(req.params.commentId));
                } else if (!partner) {
                    err = new Error(`Partner ${req.params.partnerId} not found`);
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

    .post(authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /partner/${req.params.partnerId}/comments/${req.params.commentId}`);
   
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        Partner.findById(req.params.partnerId)
            .then(partner=> {
                if (partner && partner.comments.id(req.params.commentId)) {
                    if (req.body.rating) {
                        partner.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.text) {
                        partner.comments.id(req.params.commentId).text = req.body.text;
                    }
                    partner.save()
                        .then(partner=> {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(partner);
                        })

                        .catch(err => next(err));

                } else if (!partner) {
                    err = new Error(`Partner ${req.params.partnerId} not found`);
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
    .delete(authenticate.verifyUser,(req, res, next) => {
        Partner.findById(req.params.partnerId)
            .then(partner => {
                if (partner && partner.comments.id(req.params.commentId)) {
                    partner.comments.id(req.params.commentId).remove();
                    partner.save()
                        .then(partner => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(partner);
                        })

                        .catch(err => next(err));

                } else if (!partner) {
                    err = new Error(`Partner ${req.params.partnerId} not found`);
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



module.exports = router;