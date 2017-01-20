var inquirer = require("inquirer");
var http = require("http");
var fs = require("fs");
var exec = require("child_process").exec;
var os = require("os");
var path = require("path");

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
    /* fs.readFile("./index.html", "utf-8", (error, content) => {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
    }); */

    var js = 'var socket=io.connect("' + network.address + ':' + port + '");var header=document.querySelector("header");var shell=document.querySelector("#search");var footer=document.querySelector("footer");document.body.addEventListener("keydown",(e)=>{if(e.keyCode==13){if(shell.value=="cls"||shell.value=="clear"){footer.innerHTML="";}else{socket.emit("message",shell.value);} shell.value="";}});socket.on("message",(message)=>{Object.keys(message).forEach((id)=>{if(!!message[id]){if(id=="basedir"){header.textContent=message[id];}else{footer.innerHTML="<div class=\\"" + id + "\\">"+message[id].replace(/\\n/g,"<br>")+"</div><br>"+footer.innerHTML;}}});});';
    var css = '*{margin:0;padding:0;background:#2D2D2D}input:focus{outline-width:0}#shell{box-sizing:border-box;width:100%}header{display:inline-block;padding:4px 10px;background:#6998CC;font-family:"Lucida Console";font-size:14px;color:#2D2D2D}#search{display:inline-block;position:relative;left:0;padding:2px;border-color:transparent;font-family:"Lucida Console";color:#CCD7AF}footer{position:absolute;top:26px;left:4px;bottom:0px;right:4px;font-family:"Lucida Console";font-size:13px}.stdout{color:#D8C8B8}.stderr{color:#B63C2E;font-weight:bold}';

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<!DOCTYPE html><html><head><meta charset="utf-8" /><title>oShell</title><style type="text/css">' + css + '</style></head><body><div id="shell"> <header></header> <input id="search" autofocus></input> <footer></footer></div> <script src="/socket.io/socket.io.js"></script> <script>' + js + '</script> </body></html>');
    res.end();
  });

  var io = require("socket.io").listen(server);
  var basedir = path.dirname("oShell.js"), restorePath = "";

  io.sockets.on("connection", (socket) => {
    socket.emit("message", {basedir: basedir});

    socket.on("message", (message) => {
      command = message.split(" ");
      if(command[0] == "cd" && command.length == 2){
        restorePath = basedir;

        if(path.isAbsolute(command[1])){
          basedir = command[1];
        } else {
          basedir = path.resolve(basedir + path.sep, command[1]);
        }

        fs.stat(basedir, (err, stats) => {
          if(err || !stats.isDirectory()){
            basedir = restorePath;
            return;
          } else {
            socket.emit("message", {basedir: basedir});
          }
        });
      } else {
        exec(message, {cwd: basedir}, (error, stdout, stderr) => {
          socket.emit("message", {stdout: stdout, stderr: stderr});
        });
      }
    });
  });

  server.listen(port, network.address, () => {
    console.log("Server listening on " + network.address + ":" + port + "...");
  });
});