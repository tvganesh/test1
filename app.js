
/**
 * This Bluemix app uses Watson's QAAPI as a service and was created using NodeExpress
 * Designed and developed by: Tinniam V Ganesh
 * Date: 10 Oct 2014
 * File: app.js
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , question = require('./routes/question')
  , simplesync = require('./routes/simplesync')
  , evidence = require('./routes/evidence')
  , evidencereq = require('./routes/evidencereq')
  , items = require('./routes/items')
  , itemsreq = require('./routes/itemsreq')
  , format = require('./routes/format')
  , formatreq = require('./routes/formatreq')  
  , connect = require('connect')
  , url = require('url')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//Get the VCAP environment variables to connect Watson service to the Bluemix application
 if (process.env.VCAP_SERVICES) {
	   var VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
	   // retrieve the credential information from VCAP_SERVICES for Watson QAAPI
	   hostname   = VCAP_SERVICES["Watson QAAPI-0.1"][0].name;               
	   passwd = VCAP_SERVICES["Watson QAAPI-0.1"][0].credentials.password; 
	   userid = VCAP_SERVICES["Watson QAAPI-0.1"][0].credentials.userid; 
       watson_url = VCAP_SERVICES["Watson QAAPI-0.1"][0].credentials.url;
      
      parts = url.parse(watson_url);
      console.log("********************************************");
      console.log("Host:" + parts.hostname + "  Password:" + passwd );
      console.log("Userid:" + userid + "  Watson-URL:"+ watson_url);
      console.log("********************************************");
      
 }
      

 
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// Ask Watson a simple synchronous query
app.get('/question',question.list);
app.post('/simplesync',simplesync.list);

// Ask Watson for responses based on evidence provided
app.get('/evidence',evidence.list);
app.post('/evidencereq',evidencereq.list);

// Ask Watson to provide specified number of responses to a query
app.get('/items',items.list);
app.post('/itemsreq',itemsreq.list);

// Get a formatted response from Watson for a query
app.get('/format',format.list);
app.post('/formatreq',formatreq.list);

//Start a Web server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
