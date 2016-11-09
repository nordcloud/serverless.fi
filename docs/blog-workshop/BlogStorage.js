'use strict';

class BlogStorage {

  constructor(dynamodb, stage, serviceName) {
    this.dynamodb = dynamodb;
    this.baseParams = {
      TableName: `${serviceName}-blog-${stage}`,
    };
  }

  // Get all posts
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  getPosts(query, cb) {
    const params = Object.assign({}, this.baseParams, {
      AttributesToGet: [
        'id',
        'title',
        'content',
        'date',
      ],
    });

    this.dynamodb.scan(params, (error, response) => cb(error, response));
  }

  // Add new post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  savePost(post, cb) {
    post.id = Date.now().toString();

    const params = Object.assign({}, this.baseParams, { Item: post });

    this.dynamodb.put(params, (error, response) => {
      if (!error) {
        return cb(null, { post });
      }
      return cb(error, response);
    });
  }

  // Edit post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  updatePost(id, post, cb) {
    post.id = id;

    const params = Object.assign({}, this.baseParams, { Item: post });

    this.dynamodb.put(params, (error, response) => {
      if (!error) {
        return cb(null, { post });
      }
      return cb(error, response);
    });
  }

  // Delete post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
  deletePost(id, cb) {
    const params = Object.assign({}, this.baseParams,
      { Key: { id } }
    );

    this.dynamodb.delete(params, (error, response) => {
      if (!error) {
        return cb(null, { post: id });
      }
      return cb(error, response);
    });
  }
}

module.exports = BlogStorage;
