var http = require('http');
var pg = require('pg');
var url = require('url');
var querystring = require('querystring');

//var conString = "postgres://postgres:1234@localhost/postgres";
var conString = "postgres://postgres:westhove@localhost:5432/test";

var server = http.createServer(function(req, res) {
  var page   = url.parse(req.url, true).pathname;
  console.log( 'Page: ' + page);
  // get a pg client from the connection pool
  pg.connect(conString, function(err, client, done) {

    var handleError = function(err) {
      // no error occurred, continue with the request
      if(!err) return false;

      // An error occurred, remove the client from the connection pool.
      // A truthy value passed to done will remove the connection from the pool
      // instead of simply returning it to be reused.
      // In this case, if we have successfully received a client (truthy)
      // then it will be removed from the pool.
      done(client);
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred:' + err);
      return true;
    };
//    res.writeHead(200, {"Content-Type": "text/plain"});
	
    // GET + Pad:
	   if  (page == '/contactpersonen') {
	     var query = 'SELECT "ID",name  FROM roel.contactpersonen order by name';      
	     console.log('query : ' + query);
      client.query(query, function(err, result) {	  
        console.log('result : ' + result);
        // handle an error from the query
        if(handleError(err)) return;		
        // return the client to the connection pool for other requests to reuse
        done();		
        console.log('***');
        // return the client to the connection pool for other requests to reuse
        res.setHeader('Content-Type', 'text/json');
        res.writeHead(res.statusCode);
        if (result.rowCount==0) {
          res.end('Er werd geen rij gevonden');
          return;
        }
        var JSONString=JSON.stringify(result.rows)
        res.write(JSONString);
        res.end();
      });
    }  
	   else if (page == '/contracttypes') {
      console.log('PG: query contracttypes');
	     var query = 'select id "ID",name from public.finecr$contract_types order by name';
	     console.log('query : ' + query);
      client.query(query, function(err, result) {	  
        console.log('result : ' + result);
        // handle an error from the query
        if(handleError(err)) return;		
        // return the client to the connection pool for other requests to reuse
        done();		
        console.log('***');
        // return the client to the connection pool for other requests to reuse
        res.setHeader('Content-Type', 'text/json');
        res.writeHead(res.statusCode);
        if (result.rowCount==0) {
          res.end('Er werd geen rij gevonden');
          return;
        }
        var JSONString=JSON.stringify(result.rows)
        res.write(JSONString);
        res.end();
      });
    } 
    
    else if (page == '/POST') {
      res.write('Hello POSTman');
      res.end();	
    }
    
    else {
      res.writeHead(404, {'content-type': 'text/plain'});
      res.write('Dit pad is niet gedefinieerd');
      res.end();
      console.log('pad ' + page +'niet gevonden.');
    }
    console.log('Server is gestart (POSTGRESQL)');
  })
});

server.listen(3001)