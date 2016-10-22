var AWS=require('aws-sdk');
var IAM = new AWS.IAM(); 
IAM.getUser(function(err, data) {
  console.log(data.User.UserName) 
});
