var MongoClient = require('mongodb').MongoClient

function MongodbBackend(startupTime, config, emitter) {

  this.startupTime = startupTime
  this.config = config
  this.mongoConfig = config.mongoConfig || {}
  this.emitter = emitter

}

MongodbBackend.prototype.flush = function (timestamp, metrics) {
  this.client.db(this.mongoConfig.db_name).collection('statsd_irfan').insertOne({timestamp, metrics})
}

MongodbBackend.prototype.status = function (callback) {

  callback(null, 'mongodb', 'startupTime', this.startupTime)

}

MongodbBackend.prototype._init = function () {

  var self = this

  this.client = new MongoClient(this.mongoConfig.url + '/' + this.mongoConfig.db_name)

  this.client.connect(function (result) {

    console.log(result)

    if (self.config.debug) {
      console.log('connected')
    }

    self.emitter.on('flush', function (timestamp, metrics) {
      self.flush(timestamp, metrics);
    })

    self.emitter.on('status', function (callback) {
      self.status(callback)
    })

  })

}

exports.init = function (startupTime, config, events) {
  new MongodbBackend(startupTime, config, events)
  return true
}
