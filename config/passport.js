const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

// if (steam) {
//   passport.use(
//     new SteamStrategy(
//       {
//         returnURL: "http://localhost:3000/auth/steam/return",
//         realm: "http://localhost:3000/",
//         apiKey: "Your API key here",
//       },
//       function (identifier, profile, done) {
//         // asynchronous verification, for effect...
//         process.nextTick(function () {
//           // To keep the example simple, the user's Steam profile is returned to
//           // represent the logged-in user.  In a typical application, you would want
//           // to associate the Steam account with a user record in your database,
//           // and return that user instead.
//           db.User.findOne({
//             where: {
//               username: identifier,
//             },
//           });

//           profile.identifier = identifier;
//           return done(null, profile);
//         });
//       }
//     )
//   );
// } else {
  passport.use(
    new LocalStrategy(
      // Our user will sign in using a username
      {
        usernameField: "username",
      },
      function (user, password, done) {
        // When a user tries to sign in this code runs
        db.User.findOne({
          where: {
            username: user,
          },
        }).then(function (dbUser) {
          // If there's no user with the given email
          if (!dbUser) {
            return done(null, false, {
              message: "Incorrect username.",
            });
          }
          // If there is a user with the given email, but the password the user gives us is incorrect
          else if (!dbUser.validPassword(password)) {
            return done(null, false, {
              message: "Incorrect password.",
            });
          }
          // If none of the above, return the user
          return done(null, dbUser);
        });
      }
    )
  );
// }

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
