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

//   app.get("/api/user/:id", function (req, res) {
//     if (!req.user) {
//       res.redirect(401, "/");
//     } else {
//     }
//   });

  app.post("/api/sendFriendInvite/", function (req, res) {
      console.log(req.body);
      res.json(req.body);
    //   db.User.findOne({
    //       where: {
    //           id = 1
    //       }
    //   }).then(user => {
    //       console.log(user);
    //       res.json(user);
    //       return req.user = user;
    //   }) 
    // if (req.body.requesteeId != req.user.id) {
    //   console.log("Send friend request");
    //   req.user
    //     .addRequestees(req.body.requesteeId)
    //     .then((result) => res.status(201).send(result));
    // } else {
    //   res.status(400).send("Cannot friend yourself");
    // }
  });

  app.put("/api/sendGameInvite", function (req,res) {
      req.user.id = 1;
      if (req.body.requesteeId != req.user.id) {
          req.user.addBeingInvited(req.body.requesteeId)
          .then(result => {
              console.log(result);
              res.status(201).send(result);
          })
      }
  })

  app.get("/api/IncomingFriends", function (req,res) {
      
  })


  app.get("/allUsers", function (req,res) {
      console.log("hello");
      db.User.findAll({}).then(user => {
          res.render("test", {user: user});
      })
  })
};
