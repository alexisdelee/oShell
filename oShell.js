var inquirer = require("inquirer");
var http = require("http");
var exec = require("child_process").exec;
var os = require("os");

var networks = [];
var ifaces = os.networkInterfaces();
Object.keys(ifaces).forEach((ifname) => {
  ifaces[ifname].forEach((iface) => {
    if("IPv4" !== iface.family || iface.internal !== false){
      return;
    }

    networks.push(iface.address);
  });
});

inquirer.prompt([{
  type: "list",
  message: "Network(s) detected",
  name: "address",
  choices: networks
},
{
  type: "input",
  message: "Port",
  name: "port",
  default: "8080"
}]).then((network) => {
  var port = parseInt(network.port);
  if(isNaN(port)) return console.log("error port");
  else if(port < 1 || port > 47823) return console.log("error port");

  var server = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<!DOCTYPE html><html> <head> <meta charset="utf-8"/> <title>oShell</title> <style type="text/css"> *{margin: 0; padding: 0;}#search{position: absolute; top: 10px; left: 0; padding-left: 10px; width: 100%; box-sizing: border-box; border-color: transparent;}</style> </head> <body> <input id="search" placeholder="Command line..." autofocus></input> <script src="/socket.io/socket.io.js"></script> <script>var socket=io.connect("' + network.address + ':' + port + '"); var shell=document.querySelector("#search"); document.body.addEventListener("keydown", (e)=>{if(e.keyCode==13){socket.emit("message", shell.value); shell.value="";}}); socket.on("message", (message)=>{Object.keys(message).forEach((id)=>{if(!!message[id]){console.log(message[id]);}});}); </script> </body></html>');
    res.end();
  });

  var io = require("socket.io").listen(server);

  io.sockets.on("connection", (socket) => {
    socket.on("message", (message) => {
      exec(message, (error, stdout, stderr) => {
        socket.emit("message", {stdout: stdout, stderr: stderr});
      });
    });
  });

  server.listen(port, network.address, () => {
    console.log("Server listening on " + network.address + ":" + port + "...");
  });
});