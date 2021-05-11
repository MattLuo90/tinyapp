const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const generateRandomString = () => {
  let random = '';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 6; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return random;
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));


const urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};


app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  const randomString = generateRandomString();
  const newShortURL = `http://localhost:${PORT}/urls/${randomString}`;
  urlDatabase[randomString] = `http://${req.body.longURL}`; 
  res.redirect(newShortURL);        
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const URLToBeDeleted = req.params.shortURL;
  delete urlDatabase[URLToBeDeleted];
  res.redirect("/urls")
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});