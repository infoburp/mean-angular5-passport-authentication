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
    res.json({ success: false, msg: "Please pass username and password." });
  }
  else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, msg: "Username already exists." });
      }
      res.json({ success: true, msg: "Successful created new user." });
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
          msg: "Authentication failed. User not found."
        });
      }
      else {
        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret);
            // return the information including token as JSON
            res.json({ success: true, token: "JWT " + token });
          }
          else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. Wrong password."
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
            created_by: req.user,
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
                  console.log(error);
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
      Action.find().deepPopulate("cause")
        .sort('-created_at')
        .exec(function(err, actions) {
          if (err) console.log(err);
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
      Action.find({ _id: req.params.id })
        .deepPopulate("cause")
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

router.delete(
  "/action/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Cause.update({ actions: this._id }, { $pull: { actions: this._id } })
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
      Action.find({ name: { '$regex': req.params.id, '$options': 'i' } })
        .deepPopulate("cause")
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
      Cause.find({ children: req.params.id }, function(err, children) {
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
      Effect.find(function(err, effects) {
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
        created_by: req.user
      });

      newAction.save(function(err) {
        if (err) {
          return res.json({ success: false, msg: "Save action failed." });
        }
        res.json({ success: true, msg: "Successful created new action." });
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
    Cause.find().deepPopulate("children effect")
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
      Cause.find({ _id: req.params.id })
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

router.delete(
  "/cause/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Effect.update({ causes: this._id }, { $pull: { causes: this._id } })
        .exec(function(err) {
          if (err) return next(err);
          Action.find({ cause: req.params.id })
            .remove().exec(function(err) {
              if (err) return next(err);
              Cause.find({ _id: req.params.id }).remove().exec(function(err) {
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
      Cause.find({ name: { '$regex': req.params.id, '$options': 'i' } })
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

router.get(
  "/cause/:id/actions",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Cause.findOne({ _id: req.params.id })
        .populate("children").populate("effect")
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
      Effect.findOne({ _id: req.params.id })
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
        created_by: req.user,
        effect: req.params.id
      });

      newCause.save(function(err) {
        if (err) {
          return res.json({ success: false, msg: "Save cause failed." });
        }
        Effect.findOneAndUpdate({ _id: req.params.id }, { $push: { children: newCause._id } },
          function(error, success) {
            if (error) {
              console.log(error);
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
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Effect.find()
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
      Effect.find({ _id: req.params.id })
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

router.delete(
  "/effect/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Effect.find({ _id: req.params.id })
        .exec(function(err, effect) {
          if (err) return next(err);
          Action.find({ effect: req.params.id })
            .remove().exec(function(err) {
              if (err) return next(err);
              Cause.find({ effect: req.params.id }).remove().exec(function(err) {
                if (err) return next(err);
                Effect.find({ _id: req.params.id }).remove().exec(function(err) {
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
      Effect.find({ name: { '$regex': req.params.id, '$options': 'i' } })
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
        created_by: req.user
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
