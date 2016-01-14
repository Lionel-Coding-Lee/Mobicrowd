var express = require('express');       // call express
var app = express();                // define our app using express
var server = require('http').Server(app);
var sio = require('socket.io')(server);

var users = [];
var agents = [];
map = new Object();
var buildings = [];

var initData = function() {
    for (var i = 1; i <= 10; i++) {
        agent = new Object(),
        agent.id = i,
        agent.x = i*10,
        agent.y = i*10,
        agent.r = 5,
        agents.push(agent)
    };
    
    building1 = new Object(),
    building1.id = 1,
    building1.x = 20,
    building1.y = 20,
    building1.r = 80,
    buildings.push(building1);

    building2 = new Object(),
    building2.id = 2,
    building2.x = 500,
    building2.y = 300,
    building2.r = 80,
    buildings.push(building2);

    map.width = 800;
    map.height = 500;
}

var changeData = function() {
    for (var i = 1; i <= 10; i++) {
        agents[i].x += 1;
        agents[i].y += 1;
    }
}

var initSystem = function() {
    
    initData();

    var port = 8080;
    server.listen(port);

    app.use("/", express.static('../site/'));

    console.log('运行在端口： ' + port);
    sio.sockets.on('connection', function (client) {

        users.push(client);
        console.log('用户已经连接');
        client.emit('map', map);
        client.emit('buildings', buildings);
        client.emit('agents', agents);

        client.on('clickID', function (agentID) {
            console.log(agentID);
            for(var agent in agents)
            {
                if(agent.id == agentID)
                {
                    agents.splice(agents.indexOf(agent), 1);
                    agent.r = agent.r * 2;
                    agents.push(agent);
                }    
            }
            console.log('尝试点击');
            changeData();
            for(var pos in users)
            {
                var user = users[pos];
                user.emit('agents', agents);
            }
        });

        //When this client disconnects
        client.on('disconnect', function () {
            users.splice(users.indexOf(client), 1);
            console.log('用户已经断开');
        }); //client.on disconnect

    }); //sio.sockets.on connection
}


var render = function() {

}


initSystem();
