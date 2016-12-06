

var http = require("http");
var server = http.createServer(handle);
var fs = require("fs");
var mime = require("mime");
var io = require("socket.io")(server);

function handle(req,res){
	var filePath = "";
	if(req.url == "/"){
		filePath = "./public/html/index.html"
	}else{
		filePath = "./public" + req.url;
	}
	serverStatic(res,filePath)
}

function serverStatic(res,filePath) {
	fs.exists(filePath,function(exists){
		if(exists){
			fs.readFile(filePath,function(err,data){
				if(err){
					send404(res);
				}
				res.writeHead(200,{
					"Content-Type":mime.lookup(filePath)
				});
				res.end(data);
			})
		}else{
			send404(res)
		}
	})
}

function send404(res){
	res.writeHead(404,{
		"Content-Type":"text/plain"
	})
	res.end("404!sorry,not found");
}

var num = 1;
var arr = [];
io.on('connection', function (socket) {
	num ++;
	socket.on('message', function (data) {
		arr.push(data.info);
		socket.emit('news', { name: 'zjf', num: num,content:arr});
	})
})

server.listen(3000,function(){
	console.log("go!go!go!");
})