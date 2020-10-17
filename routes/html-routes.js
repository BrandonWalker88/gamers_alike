const path = require("path");

const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  // These are just visual pathing ideas. For the the most part the will change when the logic Javascript file is finished.

  app.get("/", function (req, res) {
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
};
