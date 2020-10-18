const express = require("express");
const app = express();
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const session = require("express-session");
const exphbs = require("express-handlebars");

const db = require("./models");
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      // returnURL: "https://gamers-alike.herokuapp.com/auth/steam/return",
      // realm: "https://gamers-alike.herokuapp.com/",
      apiKey: "D94580D5312585B718FA616F6F1CB4F0",
    },
    function (identifier, profile, done) {
      process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use(
  session({
    secret: "secret secret Haha",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  if (req.user)
    res.send(
      "Stored in session when logged : <br><br> " +
        JSON.stringify(req.user) +
        "<br><br>" +
        '<a href="/logout">Logout</a>'
    );
  else
    res.send(
      'Not connected : <a href="/auth/steam"><img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_small.png"></a>'
    );
});

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
