const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname, '/client')));

const messages = [];
const users = [];

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push({author: message.author, content: message.content}); 
    socket.broadcast.emit('message', message);
  });
  socket.on('logged', (user) => {
    console.log('User ' + socket.id + ' is logged! Its name is ' + user);
    users.push({name: user, id: socket.id});
    socket.broadcast.emit('message', { author: 'Chat Bot', content: `${user} has joined the conversation!` });
  });
  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    const index = users.findIndex(item => item.id === socket.id);
    socket.broadcast.emit('message', { author: 'Chat Bot', content: `${users[index].name} has left the conversation!` });
    users.splice(index, 1);
  });
  console.log('I\'ve added a listener on message event \n');

});