const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

const app = express();

app.use(express.urlencoded({extended: true}));

app.use('/assets', express.static('assets'));
app.use('/', express.static('/'));
app.use('/Users/valerio/Desktop/Courses/Website', express.static('website'));


app.use(cookieParser('un segreto'));

app.use(session ({
secret: 'un segreto',
resave: true,
saveUninitialized: true

}));

app.use(express.static('public'))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username, password,done){
    if(username === "Valerio" && password === "1234")
        return done(null, { id: 1, name: "username"});

    done(null, false);
}));

//serializacion

passport.serializeUser(function(user,done) {
    done(null,user.id);
});

//deserializacion
passport.deserializeUser(function(id,done){
    done(null, {id:1, name: "Valerio"});
})

app.set('view engine', 'ejs');

app.get("/",(req,res,next)=> {
    if(req.isAuthenticated()) return next();

    res.redirect("/login");
// se iniziamo la session mostreremo il benvenuto
}, (req,res)=>{ 
    res.send("Ciao!");
});

app.get("/login",(req,res)=> {
    // mostrare il form di login
    res.render("login");
} )

app.post("/login",passport.authenticate(('local'),{
    successRedirect: "/",
    failureRedirect: "/login"
    // ricevere le credenziali ed iniziare la session
} ));

app.listen(8080,()=> console.log("Server started"));