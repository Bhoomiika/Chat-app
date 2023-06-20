const socket = io('http://localhost:8000');
//const uname = prompt("Enter your name to join");
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement)
    function playAudio() {
        audio.play();
    }
    if (position === 'left') {
        playAudio();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message !== '') {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);

    }
    messageInput.value = '';
})


let uname = prompt("Enter your name to join");
while (!uname || uname.trim() === '') {
    uname = prompt("Enter your name to join");
}
socket.emit('new-user-joined', uname);

socket.on('user-joined', uname => {
    append(`${uname} joined the chat`, 'right')
})

socket.on('receive', data => {
    append(`${data.uname}:${data.message}`, 'left')
})

// socket.on('left', uname => {

//     append(`${uname} left the chat`, 'left')
// })

// Client-side code
socket.on('left', uname => {
    append(`${uname} left the chat`, 'left');
});

