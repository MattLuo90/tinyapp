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
};

const passwordCheck = (matchedEmail, passwordToBeChecked) => {
  for (const key in users) {
    if (users[key].email === matchedEmail) {
      if (users[key].password === passwordToBeChecked) {
        return true;
      }
    }
  }
  return false;
};

const idCheck = (matchedEmail) => {
  for (const key in users) {
    if (users[key].email === matchedEmail) {
      return key;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  idCheck,
  emailCheck,
  passwordCheck
}