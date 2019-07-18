var socketio =require('socket.io');
var io ;
var guestNumber =1;
var nickNames ={};
var namesUsed = [];
var currentRoom = {};
exports.listen =function(server){
    
    io = socketio.listen(server);
    io.set('log level',1);
    io.on('connect',function(socket){
        console.log('正在连接')
    })
    io.sockets.on('connection',function(socket){ // 定义每个用户连接的处理逻辑
        guestNumber = assignGuestName(socket,guestNumber,nickNames, namesUsed); //用户在连接时赋予其一个访问 名
        joinRoom(socket,'Lobby');
        handleMessageBroadcasting(socket,nickNames); //处理用户的消息更名 以及聊天室的创建和变更

        handleNameChangeAttempts(socket,nickNames,namesUsed); 

        handleRoomJoining(socket);

        socket.on('rooms',function(){               //用户发出请求时 ， 向其提供已占用的聊天室的列表
            console.log('占用',io.sockets.adapter.rooms)
            socket.emit('rooms',io.sockets.adapter.rooms);
        });

        handleClientDisconnection(socket,nickNames,namesUsed); //定义用户断开连接后清除数据
    })
}

//分配称昵 
function assignGuestName(socket,guestNumber,nickNames,namesUsed){
    var name = 'Guest' + guestNumber;  //生成成称昵
    // console.log('[socket.id',socket.id)
       nickNames[socket.id] = name;   
       socket.emit('nameResult',{   //让用户知道他们的称昵
           success:true,
           name:name
       });
       namesUsed.push(name);       //放入已经被占用的称昵
       return guestNumber + 1;     //增加用来生成称昵的计数器
}

//进入聊天室相关的逻辑
function joinRoom(socket, room){
    console.log('----',room)
    socket.join(room);       //让用户进入房间
    var usersInRoom = io.sockets.adapter.rooms[room];  //确定有哪些用户在房间
    currentRoom[socket.id] = room;    
    socket.emit('joinResult',{room:room});  //让用户知道他们进入新了房间
    socket.broadcast.to(room).emit('message',{
        text:nickNames[socket.id] + '已经加入了' + room + '.'
    });
    var  atUsers = [];
    for(var index in usersInRoom.sockets){
        var userSocketId = index;
            // console.log(nickNames,'确认在房价的用户',nickNames[userSocketId])
            atUsers.push(nickNames[userSocketId]);
    }

    // console.log('--------',atUsers)
    io.sockets.in(room).emit('userList',{users:atUsers});

    if(usersInRoom.length > 1 ){
        var usersInRoomSummary = '用户目前在房间:' + room ;
       
        socket.emit('message',{text:usersInRoomSummary});  //将房间里的其他用户的汇总发送给这个用户
    }
}

//更名请求的处理逻辑
function handleNameChangeAttempts(socket,nickNames,namesUsed){
    socket.on('nameAttempt',function(name){    //添加名称的事件监听
        if(name.indexOf('Guest') === 0){
            socket.emit('nameResult',{
                success:false,
                message:'姓名不能以“Guest”开头".'
            });
        }else{
            if(namesUsed.indexOf(name) == -1){  
                console.log('id',socket.id)         //如果称昵还没有注册就注册上
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];  //删掉之前的称昵 让其他用户可以使用
                socket.emit('nameResult',{
                    success:true,
                    name:name
                });

                socket.broadcast.to(currentRoom[socket.id]).emit('message',{
                    text:previousName + '现在被称为' + name +'.'
                });
            }else{
                socket.emit('nameResult',{       //如果称昵已经被占用给客户端发送错误消息
                    success:false,
                    message:'这个名字已经在使用了'
                })

            }
        }
    })
}

//发送聊天消息 
function handleMessageBroadcasting(socket){
    socket.on('message',function(message){
        console.log('监听消息发送',message)

        socket.broadcast.to(message.room).emit('message',{
            text:nickNames[socket.id] + ':'+message.text
        })
    })
}

//创建房间 

function handleRoomJoining(socket){
    socket.on('join',function(room){
        console.log(currentRoom[socket.id],'创建房间',room)
        console.log('currentRoom',currentRoom[socket.id])
        socket.leave(currentRoom[socket.id]); //离开房间 
        joinRoom(socket,room.newRoom);
    })
}

//用户断开连接
function  handleClientDisconnection(socket){
    socket.on('disconnect',function(){
        var nameIndex  = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}