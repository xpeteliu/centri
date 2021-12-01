import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../model/User';

const initAuth = () => {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username })
          .exec();
        if (!user) {
          done(null, false, {
            code: 1,
            message: 'Nonexistent user',
          });
          return;
        }
        if (user.lockoutCounter >= 10) {
          done(null, false, {
            code: 2,
            message: 'User is locked out',
          });
          return;
        }
        if (!await user.validatePassword(password)) {
          done(null, false, {
            code: 3,
            message: 'Incorrect password',
          });
          user.lockoutCounter += 1;
          await user.save();
          setTimeout(
            async () => User.updateOne({ _id: user.id }, { lockoutCounter: 0 }),
            300000,
          );
          return;
        }
        await User.updateOne({ _id: user.id }, { lockoutCounter: 0 });
        done(null, user);
      } catch (e) {
        done(e);
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
