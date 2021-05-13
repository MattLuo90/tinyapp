const generateRandomString = () => {
  let random = '';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 6; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return random;
};

const emailCheck = (obj,emailToBeChecked) => {
  for (const key in obj) {
    if (obj[key].email === emailToBeChecked ) {
      return true;
    }
  }
  return false;
};

const passwordCheck = (obj,matchedEmail, passwordToBeChecked) => {
  for (const key in obj) {
    if (obj[key].email === matchedEmail) {
      if (obj[key].password === passwordToBeChecked) {
        return true;
      }
    }
  }
  return false;
};

const idCheck = (obj,matchedEmail) => {
  for (const key in obj) {
    if (obj[key].email === matchedEmail) {
      return key;
    }
  }
  return false;
};

const urlsForUser = (database, cookie) => {
  for (const key in database) {
    if (database[key].id === cookie){
      return true;
    }
  }
  return false;
}

module.exports = {
  generateRandomString,
  idCheck,
  emailCheck,
  passwordCheck,
  urlsForUser
}