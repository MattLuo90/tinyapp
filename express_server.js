//packages that installed through npm
const bcrypt = require('bcrypt');
const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const {
  emailCheck,
  idCheck,
  generateRandomString,
  urlsForUser
} = require("./functions");


//milldeware
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

//hard code of url and users database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "aJ48lW" : {
    id:"aJ48lW",
    email: "mattluo604@hotmail.com",
    password: "$2b$10$6DD7PQUrZMefjUC2/piD6.rFzIj00ajJZrxlbxp4RtElO5DXAE.eG"
  }
};

//use template as the view engine
app.set('view engine', 'ejs');

//handle request from brower
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("registration");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//the page operate a function that create a new short & long URL pair.
app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      urls: urlDatabase,
    };
    templateVars.user = users[req.session.user_id];
    res.render("urls_new", templateVars);
    return;
  }
  res.redirect("/login");
});

//the page that shows the new short & long URL pair.
app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL
    };
    templateVars.user = users[req.session.user_id];
    res.render("urls_show", templateVars);
    return;
  }
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.session.user_id];
  res.render("askForLogin",templateVars);
});

//perform a function that shows urlDatabase on urls page
app.get("/urls", (req, res) => {
  if (urlsForUser(users,req.session.user_id)) {
    const templateVars = {
      urls: urlDatabase,
    };
    templateVars.user = users[req.session.user_id];
    res.render("urls_index", templateVars);
    return;
  }
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.session.user_id];
  res.render("askForLogin",templateVars);
});

//the request that can redirect to a longURL page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//function to register a new account
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.redirect(400, '/register');
  }
  if (emailCheck(users,req.body.email)) {
    res.send("This email address has alreay been registered., please use another one.");
    return;  // error msg sent
  }
  const randomUserID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newUser = {
    id: randomUserID,
    email: req.body.email,
    password: hashedPassword
  };
  users[randomUserID] = newUser;
  req.session.user_id = randomUserID;
  res.redirect("/urls");
});

//function to login to web
app.post("/login", (req, res) => {
  const loginPassword = req.body.password;
  const loginEmail = req.body.email;
  const hashedPassword = users[idCheck(loginEmail, users)].password;
  if (emailCheck(users,req.body.email) && bcrypt.compareSync(loginPassword, hashedPassword)) {
    req.session.user_id = idCheck(loginEmail, users);
    res.redirect("/urls");
    return;
  }
  res.redirect(403, "/login");
});

//perform a function that can generate a new random string for a long URL.
app.post("/urls", (req, res) => {
  const randomString = generateRandomString();
  const newShortURL = `/urls/${randomString}`;
  urlDatabase[randomString] = {
    longURL: `http://${req.body.longURL}`,
    userID: req.session.user_id
  };
  res.redirect(newShortURL);
});


//perform a function that can delete a exist URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.redirect(404, "/urls");
  }
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    const URLToBeDeleted = req.params.shortURL;
    delete urlDatabase[URLToBeDeleted];
    res.redirect("/urls");
    return;
  }
  res.send("you don't have permission to delete URL.");
});

//Perform a function that can update a exist shortURL's longURL
app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.redirect(404, "/urls");
  }
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    urlDatabase[req.params.shortURL].longURL = `http://${req.body.newLongURL}`;
    return res.redirect("/urls");
  }
  res.send("you don't have permission to edit URL.");
});


//function to logout from web
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//the function declare the port that the server runing on.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});