exports.handler = function(event, context, cb) {
  event.time = new Date();
  console.log(‘Return’, event);
  cb(null, event);
};
