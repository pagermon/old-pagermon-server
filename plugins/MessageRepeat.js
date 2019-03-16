/*

MessageRepeat plugin - Desigened to forward incomming messages to another server

*/
var request = require('request')
var logger = require('../log')

function run (trigger, scope, data, config, callback) {


  if (config.repeatURI) {
    var uri = config.repeatURI
    var apikey = config.repeatAPIKEY

    if (config.uuid == 0 || !config.uuid) {
        //UUID is missing - gen
      }
    //Check for message loop
    if  (data.UUID == config.uuid) {
      //Loop detected - Close
      logger.main.info('MessageRepeat: Loop detected - Message not forwarded')
      callback()
    }

    var messageData = {
      address: data.address,
      message: data.message,
      source: data.source,
      UUID: config.uuid,
    }
    request.post({
      url: uri,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'content-type': 'application/json',
        'User-Agent': 'PagerMon Plugin - Message Repeat',
        apikey: apikey,
        json: true
      },
      form: messageData
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        logger.main.info('MessageRepeat: Message Sent')
      } else {
        logger.main.error('MessageRepeat: ' + error + response.statusCode + response.statusText)
      }
    })
    callback()
  } else {
    callback()
  }
}

module.exports = {
  run: run
}
