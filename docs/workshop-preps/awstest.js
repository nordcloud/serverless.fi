const AWS = require('aws-sdk');
const IAM = new AWS.IAM();
IAM.getUser(function(err, data) {
  if (error) {
    console.log(error);
  } else {
    console.log(data.User.UserName);
  }
});
