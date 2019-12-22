
const socket = io.connect("http://localhost:8000");
 let user = '';

window.onload = function () {

    let usss = [];
    let users_container = document.getElementById('userlist');
    let message_container = document.getElementById('messages');
    const from = document.getElementById("user_name");
    message_container.style.height = window.innerHeight - 200 + 'px';

    let btn = document.getElementById('btn');

    let message_input = document.getElementById('inp');

    // window.onload(message_container.scrollTop = message_container.scrollHeight);
    // загрузить имена пользователей, которые online

    socket.on('new user', function (data) {
        user = from.innerHTML;
        //  user = data.name;
        message_container.scrollTop = message_container.scrollHeight;

    })


    // загрузить сообщения других пользователей (при загрузке страницы)
    socket.emit('load messages');
    socket.on('messages loaded', function (data) {
        message_container.scrollTop = message_container.scrollHeight;
        let display_messages = data.messages.map((msg) => {
            return (`<div class ="panel well">
                         <h4>${msg.author}</h4>
                         <h5>${msg.text}</h5>
                    </div>`)
        });

        message_container.innerHTML = display_messages.join(' ');
        message_container.scrollTop = message_container.scrollHeight;

    });

    // загрузить текущее сообщение
    socket.on('chat message', function (message) {
        console.log(message)
        let display_message = `<div class ="panel well">
                                   <h4>${message.author}</h4>
                                   <h5>${message.text}</h5>
                               </div>`
        message_container.innerHTML += display_message;
        message_container.scrollTop = message_container.scrollHeight;
    });

    // получить имя пользователя


    window.addEventListener ("keypress", function (e) {
        if (e.keyCode !== 13) return;
        if (message_input.value!="") {
            socket.emit('send message', {text: message_input.value, author: user});
            document.getElementById("inp").value = "";
        }
    });

    btn.onclick = function () {
        // сгенерировать событие отправки сообщения

        if (message_input.value!="") {
            socket.emit('send message', {text: message_input.value, author: user});
            document.getElementById("inp").value = "";
        }

    }

}
