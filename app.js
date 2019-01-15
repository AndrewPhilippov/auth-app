var express             = require('express'),
  mongoose              = require('mongoose'),
  passport              = require('passport'),
  bodyParser            = require('body-parser'),
  User                  = require('./models/user'),
  LocalStrategy         = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose');


var dburl = 'mongodb://127.0.0.1:27017/auth-app';
mongoose.connect(dburl,{ useNewUrlParser: true });


var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(require('express-session')({
  secret: 'Andrew is the most efficient web dev',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ================ //
// ==== ROUTES ==== //
// ================ //

app.get('/', function(req,res){
  res.render('home');
});

app.get('/secret', isLoggedIn, function(req,res){
  res.render('secret');
});

// Auth route
app.get('/register', function(req,res){
  res.render('register');
});

// Handling user's sign up
app.post('/register', function(req,res){
  req.body.username
  req.body.password
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register')
    } else {
      passport.authenticate('local')(req,res,function(){
        res.redirect('/secret');
      })
    }
  });
});

// LOGIN ROUTES
// Render login form
app.get('/login', function(req,res){
  res.render('login');
});
// Login logic
// middleware
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}),function(req,res){
});

// Log out User
app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.listen(process.env.PORT || '8080', process.env.IP || '127.0.0.1', function(){
  console.log('Server has been started...............');
});
