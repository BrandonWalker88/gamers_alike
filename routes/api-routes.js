const db = require("../models");
const passport = require("../config/passport");
const { Op } = require("sequelize");

module.exports = function (app) {
  app.get(
    "/signin/auth/steam",
    passport.authenticate("steam", { failureRedirect: "/signin" }),
    function (req, res) {
      res.redirect("/signin");
    }
  );

  app.get(
    "/signin/auth/steam/return",
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
          id: req.user.id,
        },
      }
    ).then(function () {
      req.logout();
      res.redirect("/login");
    });
  });

  app.post("/api/sendFriendInvite/", function (req, res) {
    console.log(req.body.requesteeId);
    if (req.body.requesteeId != req.user.id) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      })
        .then((user) => {
          return user.addRequestees(req.body.requesteeId);
        })
        .then((result) => {
          console.log(result);
        });
    } else {
      res.status(400).send("Cannot friend yourself");
    }

    // if (req.body.requesteeId != testUser.id) {
    //   console.log("Send friend request");
    //   testUser
    //     .addRequestees(req.body.requesteeId)
    //     .then((result) => res.status(201).send(result));
    // } else {
    //   res.status(400).send("Cannot friend yourself");
    // }
  });

  app.post("/api/sendGameInvite/", function (req, res) {
    console.log(req.body.requesteeId);
    if (req.body.requesteeId != req.user.id) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      })
        .then((user) => {
          return user.addBeingInvited(req.body.requesteeId);
        })
        .then((result) => {
          console.log(result);
        });
    } else {
      console.log("an error occurred");
      res.status(400).send("Cannot friend yourself");
    }
  });

  app.get("/IncomingFriends", function (req, res) {
    console.log("incoming friends");
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        return user.getRequesters().then((users) => {
          // console.log(users);
          res.render("testfriendsin", { user: users });
        });
      });
    } else {
      res.status(401).send("You are not allowed here");
    }
  });

  app.post("/api/IncomingFriends", function (req, res) {
    console.log(req.user.id);
    console.log("adding friend...");
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        return user.addFriends(req.body.newFriendId).then((result) => {
          console.log(result);
          return user.removeRequesters(req.body.newFriendId).then((results) => {
            console.log(results);
            res.redirect("/IncomingFriends");
          });
        });
      });
    } else {
      res.status(401).redirect("/login");
    }
  });

  app.delete("/api/IncomingFriends", function (req, res) {
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        return user
          .removeRequesters(req.body.rejectFriendId)
          .then((results) => {
            console.log(results);
            res.redirect("/IncomingFriends");
          });
      });
    }
  });

  app.get("/Friends", function (req, res) {
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        return user.getFriends().then((friends) => {
          res.render("testfriendslist", { user: friends });
        });
      });
    }
  });

  app.get("/GameInvites", function (req, res) {
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        return user.getInviters().then((users) => {
          res.render("testgameinvites", { user: users });
        });
      });
    }
  });

  app.get("/allUsers", function (req, res) {
    console.log("hello");
    db.User.findAll({}).then((user) => {
      res.render("test", { user: user });
    });
  });
};
