const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  // These are just visual pathing ideas. For the the most part the will change when the logic Javascript file is finished.

  app.get("/signin", function (req, res) {
    res.render("signin");
  });

  app.get("/home", function (req, res) {
    res.render("home");
  });

  app.get("/friend-page", function (req, res) {
    res.render("friend-page");
  });

  app.get("/game-page", function (req, res) {
    res.render("game-page");
  });

  app.get("/", function (req, res) {
    // If the user already has an account send them to the home page
    if (req.user) {
      res.redirect("/home");
    } else {
      res.render("signup");
    }
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the home page
    if (req.user) {
      res.redirect("/home");
    } else {
      res.render("login");
    }
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/home", isAuthenticated, function (req, res) {
    res.render("signup");
  });
};
