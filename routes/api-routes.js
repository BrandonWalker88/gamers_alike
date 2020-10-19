const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://rapidapi.p.rapidapi.com/games",
  headers: {
    "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
    "x-rapidapi-key": "09195d092amshff92067eafd4eeap1cb6a0jsn32c3b856499c",
  },
};

module.exports = function (app) {
  app.get(
    "/auth/steam",
    passport.authenticate("steam", {
      failureRedirect: "/login",
    }),
    function (req, res) {
      // The request will be redirected to Steam for authentication, so
      // this function will not be called.
    }
  );

  app.get(
    "/auth/steam/return",
    passport.authenticate("steam", {
      failureRedirect: "/login",
    }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect("/");
    }
  );
  app.get("/login", function (req, res) {
    res.send("Failed to Login");
  });
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Just the thing the sign in/sign up needs to work and easily grab user data
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Sign actually builds the user out
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

  // Testing Routes. Should give basic routing structure

  // Just displaying users on test page
  app.get("/allUsers", function (req, res) {
    console.log("hello");
    db.User.findAll({}).then((user) => {
      res.render("test", { user: user });
    });
  });

  // Send Friend Invites
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
  });

  // Send Game invite
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

  // Getting incoming friend requests
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

  // Adding to friends to friend table or simply put, Saying yes to a friend request
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

  // Deleting a request from the table of friend requests or simply put rejecting a friend request
  app.post("/api/IncomingFriends", function (req, res) {
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
    } else {
      res.status(401).redirect("/login");
    }
  });

  // Displaying user friends
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
    } else {
      res.status(401).redirect("/login");
    }
  });

  //----------------------------------------------------
  //                                                   |
  //   GAME INVITE SECTION                             |
  //---------------------------------------------------|

  // Grabbing incoming game invites and displaying it
  app.get("/GameInvites", function (req, res) {
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        return user.getInviter().then((users) => {
          res.render("testgameinvites", { user: users });
        });
      });
    }
  });

  // Accepting game invite and destroying of the row where it lies in the table of gameInvites
  // Probably should set when it destroys of the row at a timer ie. "15 mins"
  app.post("/api/GameInvites", function (req, res) {
    console.log(req.user.id);
    console.log("Grouping up...");
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        // We should grab the acceptedId user discord channel invite
        // If they don't have one give them the user discord channel invite
        // else say they can buddy up cause of no discord links
        return user.removeInviter(req.body.acceptedId).then((result) => {
          console.log(result);
          res.redirect("/IncomingFriends");
        });
      });
    } else {
      res.status(401).redirect("/login");
    }
  });

  // Reject Game invite and removes the row of from the table of invites
  app.post("/api/GameInvites", function (req, res) {
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        return user.removeInviter(req.body.rejectedId).then((results) => {
          console.log(results);
          res.redirect("/GameInvites");
        });
      });
    } else {
      res.status(401).redirect("/login");
    }
  });

  // ----------------------------------------------
  //                                              |
  // GETTING USER ATTRIBUTE DATA                  |
  // ---------------------------------------------|

  // This is purely an abstract visual version of how it should look and work
  // Ideally this should be done in an async version of the first immediate user data call and set there
  // Plus you really don't need it be pulled out this way
  // just "user => res.render("target-handlebar-file" ex. "home", {name-of-extraction: user} ex. {userdata: user} )
  // If done this way remember to use {{#dataValues}}whatever data you are grabbing{{/dataValues}} to grab the real stuff


  app.get("/home", async function(req,res) {
    try{
      console.log("trying to phone home...")
      const user = await db.User.findOne({
        where: {
          id: req.user.id,
        },
      });
  
      const friends = await user.getFriends();
  
      const inFriendReq = await user.getRequesters();
  
      const inGameInvites = await user.getInviter();
  
      // axios call for game data;
      
      console.log(user);
      console.log(friends);
      await res.render("home", {user: user, friends: friends, friendReq: inFriendReq, gameInvites: inGameInvites})
    } catch (err) {
      console.log(err);
    }
  })

  app.post("/api/UpdateUserRating", function (req, res) {
    if (req.user) {
      db.User.findOne({
        where: {
          id: req.user.id,
        },
      }).then((user) => {
        return user.addBeingRated(req.body.raterID).then((result) => {
          console.log(result);
          user.rating += req.body.rating;
        });
      });
    }
  });

  // Simple version that does require {{#dataValues}} grab the dat in handlebars
  // But it does grab friend or potential user you want check out and give access to their data
  app.get("/friend-page/:id", async function (req, res) {
    try{
      
      const friend = await db.User.findOne({
        where: {
          id: req.body.id,
        },
      });
  
      const user = await db.User.findOne({
        where: {
          id: req.user.id,
        },
      });
      // axios call to get games data
      await res.render("friend-page", { friendData: friend , userData: user});
    } catch(err) {
      console.log(err);
    }
  });
  
  //-----------------------------------------------|
  //                                               |
  // STARTING GAME API CALLS                       |
  //                                               |
  // ----------------------------------------------|
};
