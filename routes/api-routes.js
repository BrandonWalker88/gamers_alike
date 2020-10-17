const db = require("../models");
const passport = require("../config/passport");
const { Op } = require("sequelize");

module.exports = function (app) {
  app.get(
    "/auth/steam",
    passport.authenticate("steam", { failureRedirect: "/signin" }),
    function (req, res) {
      res.redirect("/");
    }
  );

  app.get(
    "/auth/steam/return",
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
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
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

  //   app.get("/api/user/:id", function (req, res) {
  //     if (!req.user) {
  //       res.redirect(401, "/");
  //     } else {
  //     }
  //   });

  app.post("/api/sendFriendInvite/", function (req, res) {
      console.log(req.body.requesteeId);
      
      db.User.findOne({
          where: {
              id: 1
          }
      }).then(user => {
          return user.addRequestees(req.body.requesteeId)
      }).then(result => {
        console.log(result);
      })
      
      
    // if (req.body.requesteeId != testUser.id) {
    //   console.log("Send friend request");
    //   testUser
    //     .addRequestees(req.body.requesteeId)
    //     .then((result) => res.status(201).send(result));
    // } else {
    //   res.status(400).send("Cannot friend yourself");
    // }
  });

  app.put("/api/sendGameInvite/", function (req,res) {
    console.log(req.body.requesteeId);
      
    db.User.findOne({
        where: {
            id: 1
        }
    }).then(user => {
        return user.addRequestees(req.body.requesteeId)
    }).then(result => {
      console.log(result);
    })
  })

  app.get("/api/IncomingFriends", function (req,res) {
      
  })

  app.get("/api/IncomingFriends", function (req, res) {});

  app.get("/allUsers", function (req, res) {
    console.log("hello");
    db.User.findAll({}).then((user) => {
      res.render("test", { user: user });
    });
  });
};
