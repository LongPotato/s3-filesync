var express = require('express')
var AWS = require('aws-sdk')
var fs = require('fs')
var watchr = require('watchr');

var s3 = new AWS.S3();

var app = express()

var bucketName = 'mp499test';

// This is how your enable CORS for your web service
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
	res.send('Hello World!');

})
app.get('/list', function(req, res){
	var params = {
	  Bucket: bucketName
	};
	s3.listObjects(params, 	function(err, data){
	  for(var i = 0; i < data.Contents.length; i++) {
	  	data.Contents[i].Url = 'https://s3-us-west-2.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
	  }
	  res.send(data.Contents);
	})
})


function uploadChanges(filePath){
	fs.readFile(filePath, function (err, data) {
		params = {Bucket: bucketName, Key: filePath, Body: data,ACL: 'public-read'}
		s3.putObject(params, function(err, data) {
			 if (err) {
					 console.log(err)
			 } else {
					 console.log("Successfully changes to " + bucketName, data);
			 }
	});
});
}

function deleteChanges(fileName){
	params = {Bucket: bucketName, Key: fileName}
	s3.deleteObject(params, function(err, data) {
  	if (err) console.log(err, err.stack); // an error occurred
  	else console.log("Successfully changes to " + bucketName, data);         // successful response
});
}

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');

	var path = process.cwd() + '/dropbox';
	function listener (changeType, fullPath, currentStat, previousStat) {
		switch (changeType) {
			case 'update':
				console.log('the file', fullPath, 'was updated', currentStat, previousStat)
				uploadChanges(fullPath);
				break
			case 'create':
				console.log('the file', fullPath, 'was created', currentStat)
				uploadChanges(fullPath);
				break
			case 'delete':
				console.log('the file', fullPath, 'was deleted', previousStat)
				deleteChanges(fullPath);
				break
		}
	}

	function next (err) {
		if ( err )  return console.log('watch failed on', path, 'with error', err)
		console.log('watch successful on', path)
	}

	var stalker = watchr.open(path, listener, next);
})
