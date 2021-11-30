import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../model/User';

const initAuth = () => {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username })
          .exec();
        if (user && await user.validatePassword(password)) {
          return done(null, user);
        }
        return done(null, false);
      } catch (e) {
        return done(e);
      }
    },
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, { id });
  });
};

export default initAuth;
