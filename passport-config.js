const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  console.log("passport-config after initialize onto authenticateUser");
  console.log("passport-config "+ getUserByEmail);
  const authenticateUser = async (email, password, done) => {
    console.log("passport-config after authenticateUser");
    const user = getUserByEmail(email)
    console.log(`passport-config user ${user}`);
    console.log(`passport-config user.id ${user.id}`)
    console.log(`passport-config user.password ${user.password}`)
    console.log(`passport-config email ${email}`);
    console.log(`passport-config password ${password}`);
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  console.log("passport-config adding to passport");
  //console.log(`passport-config user=  ${user}`);

  //id => {console.log(`server.js user w/id`); return users.find(user => user.id === id)}
  passport.serializeUser((user, done) => {console.log(`passport-config passport.serializeUser`);
       return done(null, user.id)});
  passport.deserializeUser((id, done) => {console.log(`passport-config passport.deserializeUser`);
    return done(null, getUserById(id))});
  
  console.log("passport-config after all passport");
}

module.exports = initialize