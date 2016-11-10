'use strict';

// Set the env vars for the function
require('../lib/envVars').config();

const BlogStorage = require('./BlogStorage');
const AWS = require('aws-sdk');

const config = {
  region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1',
};
const dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports.handler = (event, context, cb) => {
  const stage = process.env.SERVERLESS_STAGE;
  const service = process.env.SERVERLESS_PROJECT;
  const blog = new BlogStorage(dynamodb, service, stage);

  switch (event.method) {
    case 'GET':
      blog.getPosts({}, cb);
      break;
    case 'POST':
      blog.savePost(event.body, cb);
      break;
    case 'PUT':
      blog.updatePost(event.path.id, event.body, cb);
      break;
    case 'DELETE':
      blog.deletePost(event.path.id, cb);
      break;
    default:
      cb(`Unknown method "${event.method}".`);
  }
};
