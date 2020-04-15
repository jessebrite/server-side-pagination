const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Member = mongoose.model('Member');

passport.use( new LocalStrategy ({
  usernameField: 'email',
  },
  (username, password, done) => {
    Member.findOne({email: username}, (err, user) => {
      if (err) return done(err);
      else if (!user) {
        return done (null, false, {
          message: 'Incorrent email or passoword'
        });
      } else if (!user.validPassword(password)) {
        return done (null, false, {
          message: 'Incorrent email or password'
        });
      }
      return done(null, user);
    });
  }
));
