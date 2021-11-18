const MongoClient = require('mongodb').MongoClient

function ServerMongo(startupTime, config, emitter) {

  const self = this
  this.lastFlush = startupTime
  this.lastException = startupTime
  this.config = config.mongoConfig || {}
  this.client = new MongoClient(this.config.url + "/" + this.config.name)
  this.client.connect()
  emitter.on('flush', function (timestamp, metrics) {
    self.flush(timestamp, metrics);
  });
  emitter.on('status', function (callback) {
    self.status(callback);
  });

}

ServerMongo.prototype.flush = function (timestamp, metrics) {

  //createdAt ekle

  this.client.db(this.config.name).collection("statsd").insertOne({timestamp, metrics})
}

exports.init = function (startupTime, config, events) {
  const ins = new ServerMongo(startupTime, config, events)
  return true
}