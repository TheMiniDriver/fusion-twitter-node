var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var OAuth2Strategy = require("passport-oauth2").Strategy;
var passOAuth = require("passport-oauth2");
var { FusionAuthClient } = require("@fusionauth/typescript-client");
var session = require("express-session");
const { ensureLoggedIn } = require('connect-ensure-login');

var indexRouter = require("./routes/index");
var membersRouter = require("./routes/membersonly");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const fusionClient = new FusionAuthClient(
  "KNn4rJJktJjRnbajCtDvFhe9b0nnD5jfQEf_YpK_Mb2GP0kuGUxbzOZc",
  "https://fusionauth.ritza.co"
);

app.use(session({ secret: "TOPSECRET" }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://fusionauth.ritza.co/oauth2/authorize",
      tokenURL: "https://fusionauth.ritza.co/oauth2/token",
      clientID: "0403d66c-992c-4f6c-94fb-66f574a70e72",
      clientSecret: "BPnj73hkCNA_vcC9aFfDgiu0F8pomPvWsQ15xIUCzss",
      callbackURL: "http://localhost:3000/auth/example/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      // Get the user profile from Fusion:
      fusionClient
        .retrieveUserUsingJWT(accessToken)
        //.retrieveUserByEmail("shared@ritza.co")
        .then((clientResponse) => {
          console.log(
            "User:",
            JSON.stringify(clientResponse.response.user, null, 2)
          );
          return cb(null, clientResponse.response.user);
        })
        .catch((err) => {
          console.error(err);
        });
      // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
);

app.get(
  "/auth/example/callback",
  passport.authenticate("oauth2", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.use("/", indexRouter);
app.get("/login", passport.authenticate("oauth2"))

//app.use(isAuthenticated);
app.use("/membersonly", ensureLoggedIn('/login'), membersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, user);
  });
});

passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, user);
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else return res.redirect("/login");
}

module.exports = app;
