const ws = new WebSocket("ws://localhost:8080");
const mess_list = document.getElementById("messages_list");
const chat_mess = document.getElementById("chat_mess");
const send_btn = document.getElementById("send_btn");

class User {
  #_username;
  #message;

  constructor(name) {
    this.#_username = name;
  }

  set name(new_name){
    new_name = new_name.trim();

    if(new_name === ''){
        throw new Error('Name cannot be empty');
    this.#_username = new_name;
  }
}

  set message(new_message){
    new_message = new_message.trim();

    this.#message = new_message;
  }

  get name(){
    return this.#_username;
  }

  get message(){
    return this.#message;
  }
}

// constructing a class using stored username in localStorage
const user_name = localStorage.getItem('user_name');
const user = new User(user_name);

console.log(user.name);

ws.onmessage = (event) => {
  // this code resolves the Object blob 
  const blob = event.data;
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;

    const p = document.createElement("p");
    p.textContent = text;
    p.classList.add('youre-message');
    mess_list.appendChild(p);

  };

  reader.readAsText(blob);
};

send_btn.addEventListener("click", () => {
  const message = chat_mess.value;
  ws.send(message);
  chat_mess.value = "";
});

chat_mess.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    send_btn.click();
  }
});
