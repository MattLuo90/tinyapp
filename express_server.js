//packages that installed through npm
const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {
  emailCheck, 
  passwordCheck,
   idCheck, 
   generateRandomString, 
   urlsForUser
  } = require("./functions")


//milldeware
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieParser())

//hard code of database
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
    password: "123456"
  }
};

//use template as the view engine
app.set('view engine', 'ejs');

//handle request from brower
app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/register", (req, res) => {
  res.render("registration");
})

app.get("/login", (req, res) => {
  res.render("login")
})

//the page operate a function that create a new short & long URL pair.
app.get("/urls/new", (req, res) => { 
  if(req.cookies['newID']) {
    const templateVars = {
      urls: urlDatabase,
    };
    templateVars.user = users[req.cookies['newID']];
    res.render("urls_new", templateVars);
    return;
  }
  res.redirect("/login");
});

//the page that shows the new short & long URL pair.
app.get("/urls/:shortURL", (req, res) => {
  if(req.cookies["newID"]) {
    console.log(req.params.shortURL)
    const templateVars = { 
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL].longURL
    };
    templateVars.user = users[req.cookies['newID']];
    res.render("urls_show", templateVars);
    return;
  }
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.cookies['newID']];
    res.render("askForLogin",templateVars);
});

//perform a function that shows urlDatabase on urls page
app.get("/urls", (req, res) => {
  if(urlsForUser(users,req.cookies["newID"])) {
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.cookies['newID']];
  res.render("urls_index", templateVars);
  return;
}
const templateVars = {
  urls: urlDatabase,
};
templateVars.user = users[req.cookies['newID']];
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
    return;
}
  const randomUserID = generateRandomString();
  const newUser = {
    id: randomUserID,
    email: req.body.email,
    password: req.body.password
  };
  users[randomUserID] = newUser;
  res.cookie('newID', randomUserID);
  // console.log('users:', users)
  res.redirect("/urls");
})

//function to login to web
app.post("/login", (req, res) => {
  console.log(req.body.password)
  if(emailCheck(users,req.body.email) && passwordCheck(users,req.body.email, req.body.password)) {
    res.cookie("newID", idCheck(users,req.body.email));
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
   userID: req.cookies["newID"]
  }
  res.redirect(newShortURL);    
});


//perform a function that can delete a exist URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL= req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.redirect(404, "/urls")
  }
  if(req.cookies["newID"] === urlDatabase[shortURL].userID) {
    const URLToBeDeleted = req.params.shortURL;
    delete urlDatabase[URLToBeDeleted];
    res.redirect("/urls");
    return;
  }
  res.send("you don't have permission to delete URL.")
});

//Perform a function that can update a exist shortURL's longURL
app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL= req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.redirect(404, "/urls")
  }
  if(req.cookies["newID"] === urlDatabase[shortURL].userID) {
    urlDatabase[req.params.shortURL].longURL = `http://${req.body.newLongURL}`
    return res.redirect("/urls")
  }
  res.send("you don't have permission to edit URL.")
});


//function to logout from web
app.post("/logout", (req, res) => {
  res.clearCookie("newID");
  res.redirect("/urls")
});


//the function declare the port that the server runing on.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});