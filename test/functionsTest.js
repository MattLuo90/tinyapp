const { assert } = require('chai');

const { idCheck } = require('../functions.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('idCheck', function() {
  it('should return a user with valid email', function() {
    const user = idCheck("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user,expectedOutput);
  });
  it('should return undefined when there is no matched email found', function() {
    const user = idCheck("user@example3.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user,expectedOutput);
  })
});