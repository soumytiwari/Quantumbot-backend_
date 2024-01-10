class Session {
    constructor(id) {
        this.id = id;
        this.title = null;
        this.messages = [];
    }

    setTitle(title) {
        this.title = title;
    }

    addMessage(chat_messages) {
        this.messages.push(chat_messages);
    }
}

let sessioncount = 0;
const sessions = [];
let active_session = null;
let last_session_id = null;

const new_event = new Event('new_session');
var image = document.getElementById("menu-arrow");
var menu_btn = document.getElementById("menu-btn");
const textarea = document.getElementById("user-input");
textarea.addEventListener('input', autoResize, false);

textarea.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("send-button").click();
    }
});
function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}

document.addEventListener('new_session', function () {

    // console.log('event was fire');
    if (sessions.length != 0) {
        const topic_container = document.getElementById('topics');
        topic_container.replaceChildren();
        sessions.forEach(session => {

            const topic_box = document.createElement('a');
            topic_box.classList.add('sessions');
            topic_box.classList.add('hover');
            topic_box.id = session.id;
            topic_box.onclick = function () { openSession(session.id) };
            topic_box.innerHTML = `
            <span class = "session-title">${session.title}</span>
            <img class = 'img-width-20' src="https://img.icons8.com/ios-filled/FFFFFF/menu-2.png" alt="menu-2"/>
            `;

            topic_container.insertBefore(topic_box, topic_container.children[0]);
        })
    }
})

function openNav() {
    document.getElementById("mySidenav").style.width = "280px";
    document.getElementById("main").style.marginLeft = "280px";
    menu_btn.onclick = function () { closeNav() }
    image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAA3UlEQVRIS+3V0Q2CMBAG4CMwgI0B1nAFN9AR3EA30AkcQTeRjfCZQLFN5IEmmv+Ow8YEkr4d+Xo/vZJQpCeJ5NIC/yz5/426ruuVbZrjuizPnLgmdexRatubA3duVSbPtyguhgN08GBcBH9AyVp7QSNnwxqoj4cFa6EsWBOFYW0UgudAOfDDFW9GM9r3B1MUd3RuwzrocL27VsUh2O9WG4dhbZwFa+JsWAsXwV/weX8Sw2gEB66iLNsbY57IiIk7HuFdd6U0PaEodIEgu5fUTO5Ygi4dS1MTvRftG78AOCudH43NHUoAAAAASUVORK5CYII=";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    menu_btn.onclick = function () { openNav() }
    image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAzUlEQVRIS+3VsQ3CMBAF0LOUAeImNaPACGzCJozACKzCBpQpUjgDRAl3iBIk/38n0thSlMbRy32fzkl2WmknVxr8t+Rb1FVRl1L6nPNctfnHJjjqMk1HSekm63rOw/BgcQi2SmVZnor1+syybScWh2CrTiu+6uvyqZTGYTgKp+AInIa9uAv24BGwNZo1nK3qZnPB2uEUan9Iwx6Uhr0oBUegMFzG8SBdZyMTaqRv8xw+4/clIXL3zGm4YvYmCqk4CoejbjCbQIuaTQ7+7gVkBnQfqvJaVQAAAABJRU5ErkJggg==";
}

function newSession() {
    logo.style.display = 'flex';
    const chatcontainer = document.getElementById('chat-container');
    chatcontainer.replaceChildren();
    chatcontainer.style.display = 'none';
    last_session_id = active_session.id;
    active_session = null;

    const btn = document.getElementById(last_session_id);
    btn.style.backgroundColor = 'transparent';

    // btn.addEventListener('mouseover', () => {
    //     btn.style.backgroundColor = '#292929';
    // });

}


function sendMessage() {

    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message != '') {
        let currentsession = active_session;

        const botmessage = botResponse(message);

        if (currentsession == null) {
            let newSession = new Session(sessioncount += 1);
            sessions.push(newSession);
            currentsession = newSession;
            active_session = currentsession;
            if (!currentsession.title) {
                currentsession.setTitle(getHeadline(message));
            }
            document.dispatchEvent(new_event);
            document.getElementById(active_session.id).style.backgroundColor = '#292929';
        }
        let current_message = {
            user: message,
            bot: botmessage,
            timestamp: new Date().toLocaleString()
        }

        currentsession.addMessage(current_message);

        displayMessage(message, botmessage);

        // console.log(currentsession);
        const chatcontainer = document.getElementById('chat-container');
        chatcontainer.scrollTop = chatcontainer.scrollHeight;
        userInput.value = '';
    }
}

function botResponse(user_message) {
    var response = `Hello there!, I am an Artficial Integeligence created by me, yes yes me, dont worry i will not harm you, because i am dumb (spelling is wrong) and i give same response everytime (you also dumb i guess) <br> anyway, you wrote this: <strong>${user_message}</strong>`;
    return response;
}

function getHeadline(str) {
    str = str.trim();
    let words = str.split(/\s+/);
    let firstWords = words.slice(0, 5);
    let result = firstWords.join(' ');
    return result;
}

function displayMessage(message, bot_message) {
    const logo = document.getElementById('logo');
    if (message !== '') {
        logo.style.display = 'none';
        const chatcontainer = document.getElementById('chat-container');
        chatcontainer.style.display = 'flex';
        chatcontainer.style.flexDirection = 'column';
        chatcontainer.style.alignItems = 'center';
        const messagebox = document.createElement('div');
        messagebox.classList.add('chat');
        messagebox.classList.add('border');
        messagebox.innerHTML =
            `<div class="box border" id = 'user'>
            <div class = 'user-info'>
                <img class = "avatar" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/user--v1.png" alt="user"/>
                <span class = "you">You</span>
            </div>
            <div class = 'message'>${message}</div>
        </div>
        <div class = 'box border' id  = 'bot'>
            <div class = 'user-info'>
            <img class = 'avatar' src="Frame_1321316226.png" alt="slack-new"/>
                <span class = "you">Bot</span>
            </div>
            <div class = 'message'>${bot_message}</span></div>
        </div>`;
        chatcontainer.appendChild(messagebox);
    }
}

// slack
// <img class = 'avatar' src="https://img.icons8.com/ios-filled/color/slack-new.png" alt="slack-new"/> 
// <img class = 'avatar' src="Frame_1321316226.png" alt="slack-new"/>
// at avatar 

function openSession(s_id) {
    // console.log('session trying to open');


    if (active_session != null) {
        // document.getElementById(last_session_id).style.backgroundColor = 'transparent';
        if (active_session.id == s_id) { return }
        newSession();
    }
    active_session = sessions[s_id - 1];
    document.getElementById(s_id).style.backgroundColor = '#4e4d4d';
    console.log(active_session);
    console.log(active_session.messages);
    messages = active_session.messages;
    messages.forEach(m => {
        displayMessage(m.user, m.bot);
    });
    const chatcontainer = document.getElementById('chat-container');
    chatcontainer.scrollTop = chatcontainer.scrollHeight;
}