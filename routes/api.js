var mongoose = require("mongoose");
var passport = require("passport");
var config = require("../config/database");
require("../config/passport")(passport);
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var User = require("../models/user");
var Action = require("../models/action");
var Cause = require("../models/cause");
var Effect = require("../models/effect");

router.post("/signup", function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: " failed, missing username and password." });
  }
  else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, msg: " failed, user already exists." });
      }
      res.json({ success: true, msg: "succeeded, welcome!" });
    });
  }
});

router.post("/signin", function(req, res) {

  User.findOne({
      username: req.body.username
    },
    function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: " failed, user not found."
        });
      }
      else {
        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token

            var token = jwt.sign({ username: req.body.username, password: req.body.password, _id: user._id }, config.secret, { expiresIn: '1h' });
            // return the information including token as JSON

            res.json({ success: true, token: "JWT " + token, username: user.username });
          }
          else {
            res.status(401).send({
              success: false,
              msg: " failed, incorrect password."
            });
          }
        });
      }
    }
  );
});

router.post(
  "/action/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Effect.findOne({ children: req.params.id })
        .exec(function(err, effect) {
          if (err) return next(err);

          var newAction = new Action({
            name: req.body.name,
            sentiment: req.body.sentiment,
            created_at: new Date(),
            created_by: jwt.decode(token)._id,
            cause: req.params.id,
            effect: effect._id
          });

          newAction.save(function(err) {
            if (err) {
              return res.json({ success: false, msg: "Save action failed." });
            }
            Cause.findOneAndUpdate({ _id: req.params.id }, { $push: { children: newAction._id } },
              function(error, success) {
                if (error) {
                  console.error(error)
                }
                else {
                  res.json(newAction);
                }
              }
            );
          });




        });


    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/action",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Action.find({ created_by: jwt.decode(token)._id }).deepPopulate("cause effect")
        .sort('-created_at')
        .exec(function(err, actions) {
          if (err)
            if (err) return next(err);
          res.json(actions);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/action/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Action.find({ _id: req.params.id, created_by: jwt.decode(token)._id })
        .deepPopulate("cause effect")
        .sort('-created_at')
        .exec(function(err, actions) {
          if (err) return next(err);
          res.json(actions);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.put(
  "/action/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Action.findByIdAndUpdate(
        // the id of the item to find
        req.params.id,

        // the change to be made. Mongoose will smartly combine your existing 
        // document with this change, which allows for partial updates too
        req.body,

        // an option that asks mongoose to return the updated version 
        // of the document instead of the pre-updated one.
        { new: true },

        // the callback function
        (err, action) => {
          // Handle any possible database errors
          if (err) return next(err);
          res.json(action);
        }
      )
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.delete(
  "/action/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Cause.update({ actions: this._id, created_by: jwt.decode(token)._id }, { $pull: { actions: this._id } })
        .exec(function(err) {
          if (err) return next(err);
          Action.find({ _id: req.params.id })
            .remove().exec(function(err) {
              if (err) return next(err);
              return res.status(200).send({ success: true, msg: "Deleted." });
            });
        });


    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);


router.get(
  "/action/search/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Action.find({ created_by: jwt.decode(token)._id, name: { '$regex': req.params.id, '$options': 'i' } })
        .deepPopulate("cause effect")
        .sort('-created_at')
        .exec(function(err, actions) {
          if (err) return next(err);
          res.json(actions);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/action/:id/causes",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Cause.find({ children: req.params.id, created_by: jwt.decode(token)._id }, function(err, children) {
        //db.categories.find( { children: "MongoDB" } )
        if (err) return next(err);
        res.json(children);
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/action/:id/effects",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Effect.find({ created_by: jwt.decode(token)._id }, function(err, effects) {
        if (err) return next(err);
        res.json(effects);
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.post(
  "/action",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      var newAction = new Action({
        name: req.body.name,
        sentiment: req.body.sentiment,
        created_at: new Date(),
        created_by: jwt.decode(token)._id
      });

      newAction.save(function(err) {
        if (err) {
          return res.json({ success: false, msg: "Save action failed." });
        }
        res.json(newAction);
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get("/cause", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  var token = getToken(req.headers);
  if (token) {

    Cause.find({ created_by: jwt.decode(token)._id }).deepPopulate("children effect")
      .sort('-created_at')
      .exec(function(err, children) {
        if (err) return next(err);
        res.json(children);
      });
  }
  else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

router.get(
  "/cause/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Cause.find({ _id: req.params.id, created_by: jwt.decode(token)._id })
        .deepPopulate("children effect")

        .exec(function(err, children) {
          if (err) return next(err);
          res.json(children);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.put(
  "/cause/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Cause.findByIdAndUpdate(
        // the id of the item to find
        req.params.id,

        // the change to be made. Mongoose will smartly combine your existing 
        // document with this change, which allows for partial updates too
        req.body,

        // an option that asks mongoose to return the updated version 
        // of the document instead of the pre-updated one.
        { new: true },

        // the callback function
        (err, cause) => {
          // Handle any possible database errors
          if (err) return next(err);
          res.json(cause);
        }
      )
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.delete(
  "/cause/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Effect.update({ causes: this._id, created_by: jwt.decode(token)._id }, { $pull: { causes: this._id } })
        .exec(function(err) {
          if (err) return next(err);
          Action.find({ cause: req.params.id, created_by: jwt.decode(token)._id })
            .remove().exec(function(err) {
              if (err) return next(err);
              Cause.find({ _id: req.params.id, created_by: jwt.decode(token)._id }).remove().exec(function(err) {
                if (err) return next(err);
                return res.status(200).send({ success: true, msg: "Deleted." });
              });

            });;

        });

    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/cause/search/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Cause.find({ created_by: jwt.decode(token)._id, name: { '$regex': req.params.id, '$options': 'i' } })
        .deepPopulate("children effect")

        .sort('-created_at')
        .exec(function(err, children) {
          if (err) return next(err);
          res.json(children);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get("/tree", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  var token = getToken(req.headers);
  if (token) {
    Effect.find()
      .deepPopulate(["children", "children.children"])
      .exec(function(err, children) {
        if (err) return next(err);
        res.json(children);
      });
  }
  else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

router.get(
  "/effect/:id/causes",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {

    var token = getToken(req.headers);

    if (token) {
      Effect.findOne({ _id: req.params.id, created_by: jwt.decode(token)._id })
        .populate("children.children")
        .exec(function(err, children) {
          if (err) return next(err);
          res.json(children);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.post(
  "/cause/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      var newCause = new Cause({
        name: req.body.name,
        sentiment: req.body.sentiment,
        created_at: new Date(),
        created_by: jwt.decode(token)._id,
        effect: req.params.id
      });

      newCause.save(function(err) {
        if (err) {
          return res.json({ success: false, msg: "Save cause failed." });
        }
        Effect.findOneAndUpdate({ _id: req.params.id, created_by: jwt.decode(token)._id }, { $push: { children: newCause._id } },
          function(error, success) {
            if (error) {
              console.error(error)
            }
            else {

              res.json(newCause);
            }
          }
        );
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/effect",
  passport.authenticate("jwt", { session: false }),
  function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
      Effect.find({ created_by: jwt.decode(token)._id })
        .deepPopulate("children.children")
        .sort('-created_at')
        .exec(function(err, children) {
          if (err) return next(err);
          res.json(children);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/effect/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Effect.find({ _id: req.params.id, created_by: jwt.decode(token)._id })
        .deepPopulate("children.children")
        .exec(function(err, children) {
          if (err) return next(err);
          res.json(children);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.put(
  "/effect/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Effect.findByIdAndUpdate(
        // the id of the item to find
        req.params.id,

        // the change to be made. Mongoose will smartly combine your existing 
        // document with this change, which allows for partial updates too
        req.body,

        // an option that asks mongoose to return the updated version 
        // of the document instead of the pre-updated one.
        { new: true },

        // the callback function
        (err, effect) => {
          // Handle any possible database errors
          if (err) return next(err);
          res.json(effect);
        }
      )
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);


router.delete(
  "/effect/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Effect.find({ _id: req.params.id, created_by: jwt.decode(token)._id })
        .exec(function(err, effect) {
          if (err) return next(err);
          Action.find({ effect: req.params.id, created_by: jwt.decode(token)._id })
            .remove().exec(function(err) {
              if (err) return next(err);
              Cause.find({ effect: req.params.id, created_by: jwt.decode(token)._id }).remove().exec(function(err) {
                if (err) return next(err);
                Effect.find({ _id: req.params.id, created_by: jwt.decode(token)._id }).remove().exec(function(err) {
                  if (err) return next(err);
                  return res.status(200).send({ success: true, msg: "Deleted." });
                });
              });

            });;
        });

    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/effect/search/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      Effect.find({ created_by: jwt.decode(token)._id, name: { '$regex': req.params.id, '$options': 'i' } })
        .deepPopulate("children.children")
        .sort('-created_at')
        .exec(function(err, children) {
          if (err) return next(err);
          res.json(children);
        });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.post(
  "/effect",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {

      var newEffect = new Effect({
        name: req.body.name,
        sentiment: req.body.sentiment,
        created_at: new Date(),
        created_by: jwt.decode(token)._id
      });

      newEffect.save(function(err) {
        if (err) {
          return res.json({ success: false, msg: "Save effect failed." });
        }
        res.json({ success: true, msg: "Successful created new effect." });
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/positive-action-count",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Action.count({ sentiment: 1 }, (err, count) => {
        if (err) {
          return console.error(err);
        }
        res.status(200).json(count);
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/counts",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Effect.count((err, effectCount) => {
        if (err) {
          return console.error(err);
        }
        Cause.count((err, causeCount) => {
          if (err) {
            return console.error(err);
          }
          Action.count((err, actionCount) => {
            if (err) {
              return console.error(err);
            }
            res.status(200).json({ effect: effectCount, cause: causeCount, action: actionCount });
          });

        });
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/neutral-action-count",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Action.count({ sentiment: 0 }, (err, count) => {
        if (err) {
          return console.error(err);
        }
        res.status(200).json(count);
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/negative-action-count",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Action.count({ sentiment: -1 }, (err, count) => {
        if (err) {
          return console.error(err);
        }
        res.status(200).json(count);
      });
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/average-sentiment",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Action.aggregate(
        [{
          $group: {
            _id: null,
            averageSentiment: { $avg: "$sentiment" }
          }
        }],
        (err, count) => {
          if (err) {
            return console.error(err);
          }
          res.status(200).json(count);
        }
      );
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

router.get(
  "/average-daily-sentiment",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Action.aggregate(
        [{
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            // "created_on": { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            //"_id": { $dayOfYear: "$created_at"},
            average_sentiment: { $avg: "$sentiment" }
          }
        }],
        (err, count) => {
          if (err) {
            return console.error(err);
          }
          res.status(200).json(count);
        }
      );
    }
    else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    }
    else {
      return null;
    }
  }
  else {
    return null;
  }
};

module.exports = router;
