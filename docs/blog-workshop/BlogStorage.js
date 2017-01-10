'use strict';

class BlogStorage {
  constructor(dynamodb) {
    this.dynamodb = dynamodb;
    this.baseParams = {
      TableName: process.env.TABLE_NAME,
    };
  }

  // Get all posts
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  getPosts() {
    const params = Object.assign({}, this.baseParams, {
      AttributesToGet: [
        'id',
        'title',
        'content',
        'date',
      ],
    });

    return this.dynamodb.scan(params).promise();
  }

  // Add new post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  savePost(post) {
    const date = Date.now();
    const id = date.toString();
    const payload = Object.assign({}, post, { id, date });
    const params = Object.assign({}, this.baseParams, { Item: payload });
    return this.dynamodb.put(params).promise()
      .then(() => ({ post: payload }));
  }

  // Edit post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  updatePost(id, post) {
    const payload = Object.assign({}, post, { id });
    const params = Object.assign({}, this.baseParams, { Item: payload });

    return this.dynamodb.put(params).promise()
      .then(() => ({ post: payload }));
  }

  // Delete post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
  deletePost(id) {
    const params = Object.assign({}, this.baseParams,
      { Key: { id } }
    );

    return this.dynamodb.delete(params).promise();
  }
}

module.exports = BlogStorage;