var express = require('express')
var AWS = require('aws-sdk')
var fs = require('fs')

var s3 = new AWS.S3();

var app = express()

var bucketName = 'mp499test';

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


app.get('/',function(req, res) {

})

function uploadChanges(filePath){
	params = {Bucket: bucketName, Key: filePath}

	s3.putObject(params, function(err, data) {
			 if (err) {
					 console.log(err)
			 } else {
					 console.log("Successfully changes to " + myBucket, data);
			 }
	});


}
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
