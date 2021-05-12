//packages that installed through npm
const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

//function to generate 6 new random charactors.
const generateRandomString = () => {
  let random = '';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 6; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return random;
};

//milldeware
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieParser())

//hard code of database
const urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};

//use template as the view engine
app.set('view engine', 'ejs');

//handle request from brower
app.get("/", (req, res) => {
  res.send("hello");
});

//perform a function that shows urlDatabase on urls page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase
  };
  templateVars.username = req.cookies["username"];
  res.render("urls_index", templateVars)
});

//perform a function that can generate a new random string for a long URL.
app.post("/urls", (req, res) => {                                 
  const randomString = generateRandomString();
  const newShortURL = `http://localhost:${PORT}/urls/${randomString}`;
  urlDatabase[randomString] = `http://${req.body.longURL}`; 
  res.redirect(newShortURL);        
});

//perform a function that can delete a exist URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const URLToBeDeleted = req.params.shortURL;
  delete urlDatabase[URLToBeDeleted];
  res.redirect("/urls")
});

//Perform a function that can update a exist shortURL's longURL
app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = `http://${req.body.newLongURL}`
  res.redirect("/urls")
});

//function to login to web
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls")
});

//function to logout from web
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls")
});

//the page operate a function that create a new short & long URL pair.
app.get("/urls/new", (req, res) => { 
  const templateVars = {
    urls: urlDatabase
  };
  templateVars.username = req.cookies["username"];
  res.render("urls_new", templateVars);
});

//the page that shows the new short & long URL pair.
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
})

//the request that can redirect to a shortURL page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//the function declare the port that the server runing on.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});