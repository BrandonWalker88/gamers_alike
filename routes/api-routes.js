const db = require("../models");
const passport = require("../config/passport");
const { Op } = require("sequelize");

module.exports = function (app) {
  app.get(
    "api/auth/steam",
    passport.authenticate("steam", { failureRedirect: "/signin" }),
    function (req, res) {
      res.redirect("/");
    }
  );

  app.get(
    "api/auth/steam/return",
    passport.authenticate("steam", { failureRedirect: "/signin" }),
    function (req, res) {
      // We have to get data from Steam API and use it to make a user model
      res.redirect("/home");
    }
  );

  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  app.post("/api/signup", function (req, res) {
    db.User.create({
      user_name: req.body.username,
      password: req.body.password,
      user_icon: req.array.images,
      current_status: "true",
      ratings: "4.0",
      user_attr1: req.body.attr1,
      user_attr2: req.body.attr2,
      user_attr3: req.body.attr3,
      user_attr4: req.body.attr4,
      user_attr5: req.body.attr5,
      user_attr6: req.body.attr6,
      discord_account_linked: req.body.check,
      discord_user: req.body.discordId,
    })
      .then(function () {
        res.redirect(307, "/login");
      })
      .catch(function (err) {
        res.redirect(401, "/signup");
      });
  });

  app.get("/logout", function (req, res) {
    db.User.update(
      { current_status: false },
      {
        where: {
          id: req.params.userId,
        },
      }
    ).then(function () {
      req.logout();
      res.redirect("/login");
    });
  });

  app.get("/api/user/:id", function (req, res) {
    if (!req.user) {
      res.redirect(401, "/");
    } else {
        
    }
  });

  app.post("api/send_invite", function (req,res) {
    if (!req.user) {
        res.redirect(401, "/");
    } else {
        db.userInvites.create({
            receive_id: req.params.id,
            accepted: false,
            voice_chat: false
        }).then(function(){
            res.body.message = `${req.params.username} has been sent the invite`
        })
    }
  })
};
