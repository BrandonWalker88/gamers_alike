const path = require("path");

const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
    // These are just visual pathing ideas. For the the most part the will change when the logic Javascript file is finished.

    app.get("/", function(req,res) {
        res.sendFile(path.join(__dirname, "../views/signin.html"))
    });

    app.get("/home", function(req,res) {
        res.sendFile(path.join(__dirname, "../views/layouts/home.html"))
    });
};