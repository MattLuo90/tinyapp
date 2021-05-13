//packages that installed through npm
const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


//function to generate 6 new random charactors.
const generateRandomString = () => {
  let random = '';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 6; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return random;
};

const emailCheck = (emailToBeChecked) => {
  for (const key in users) {
    if (users[key].email === emailToBeChecked ) {
      return true;
    }
  }
  return false;
}
const passwordCheck = (matchedEmail, passwordToBeChecked) => {
  for (const key in users) {
    if (users[key].email === matchedEmail) {
      if (users[key].password === passwordToBeChecked) {
        return true;
      }
    }
  }
  return false;
}
const idCheck = (matchedEmail) => {
  for (const key in users) {
    if (users[key].email === matchedEmail) {
      return key;
    }
  }
  return false;
}


//milldeware
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieParser())

//hard code of database
const urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
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
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.cookies['newID']];
  res.render("urls_index", templateVars)
});

//the page that shows the new short & long URL pair.
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

//perform a function that shows urlDatabase on urls page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
  };
  templateVars.user = users[req.cookies['newID']];
  res.render("urls_index", templateVars)
});

//the request that can redirect to a shortURL page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.redirect(400, '/register');
  }
  if (emailCheck(req.body.email)) {
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
  if(emailCheck(req.body.email) && passwordCheck(req.body.email, req.body.password)) {
    res.cookie("newID", idCheck(req.body.email));
    res.redirect("/urls");
    return;
  }
  res.redirect(403, "/login");
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


//function to logout from web
app.post("/logout", (req, res) => {
  res.clearCookie("newID");
  res.redirect("/urls")
});


//the function declare the port that the server runing on.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});