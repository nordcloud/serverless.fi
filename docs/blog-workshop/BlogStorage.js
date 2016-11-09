'use strict';

class BlogStorage {

  constructor(dynamodb, serviceName, stage) {
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
    const newPost = post;
    newPost.id = Date.now().toString();

    const params = Object.assign({}, this.baseParams, { Item: newPost });
    this.dynamodb.put(params, (error) => {
      if (error) {
        return cb(error);
      }
      return cb(null, { post });
    });
  }

  // Edit post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  updatePost(id, post, cb) {
    const updatedPost = post;
    updatedPost.id = id;

    const params = Object.assign({}, this.baseParams, { Item: updatedPost });

    this.dynamodb.put(params, (error) => {
      if (error) {
        return cb(error);
      }
      return cb(null, { post });
    });
  }

  // Delete post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
  deletePost(id, cb) {
    const params = Object.assign({}, this.baseParams,
      { Key: { id } }
    );

    this.dynamodb.delete(params, (error, response) => {
      if (error) {
        return cb(error);
      }
      return cb(null, response);
    });
  }
}

module.exports = BlogStorage;
