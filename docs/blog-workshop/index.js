'use strict';

const BlogStorage = require('./BlogStorage');
const AWS = require('aws-sdk');

const config = {
  region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1',
};

const dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports.handler = (event, context, cb) => {
  const storage = new BlogStorage(dynamodb);

  switch (event.method) {
    case 'GET':
      storage.getPosts({})
        .then(response => cb(null, response))
        .catch(cb);
      break;
    case 'POST':
      storage.savePost(event.body)
        .then(response => cb(null, response))
        .catch(cb);
      break;
    case 'PUT':
      storage.updatePost(event.path.id, event.body)
        .then(response => cb(null, response))
        .catch(cb);
      break;
    case 'DELETE':
      storage.deletePost(event.path.id)
        .then(response => cb(null, response))
        .catch(cb);
      break;
    default:
      cb(`Unknown method "${event.method}".`);
  }
};