var http = require("http");

var app = http.createServer(function(req, res) {
  console.log("createServer");
});
app.listen(3000);

var io = require("socket.io").listen(app);

io.on("connection", function(socket) {
  socket.on("Client 2 Server Message", function(message) {
    console.log(message);
    io.emit("Server 2 Client Message", message);
  });
});
