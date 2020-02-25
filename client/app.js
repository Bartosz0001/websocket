const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));

const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

let userName;
let currentMessage = {};

loginForm.addEventListener('submit', login);

function login(event) {
    event.preventDefault();
    if(userNameInput.value === '') alert('You have to input your name!');
    else {
      userName = userNameInput.value;
      messagesSection.classList.add('show');
      loginForm.classList.remove('show');
      socket.emit('logged', userName);
    }
}

addMessageForm.addEventListener('submit', sendMessage);

function initDate() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentDate = hours + ':' + minutes;
  return currentDate;
}

function sendMessage(event) {
    event.preventDefault();
    if(messageContentInput.value === '') alert('No message!');
    else {
      addMessage(userName, messageContentInput.value);
      socket.emit('message', { author: userName, content: messageContentInput.value });
      messageContentInput.value = '';
    }
}

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) message.classList.add('message--self');
    if(author === 'Chat Bot') message.classList.add('message--chatbot');
    if(author === currentMessage.author) {
      message.innerHTML = `
        <div class="message__content">
          ${content}
        </div>
      `;
    }
    else {
      message.innerHTML = `
        <h3 class="message__author">${userName === author ? 'You' : author }</h3>
        <div class="message__content">
          ${content}
        </div>
      `;
    }
    
    messagesList.appendChild(message);
    currentMessage = {author: author, content: content};
  }
