const ws = new WebSocket("ws://localhost:8080");
const mess_list = document.getElementById("messages_list");
const chat_mess = document.getElementById("chat_mess");
const send_btn = document.getElementById("send_btn");

class User {
  #_username;
  #message;
  // picLInk will hopefully hold the link for an avatar image
  // then that link will be used as an src attribute
  #_picLink;

  constructor(name) {
    this.#_username = name;
  }

  set pic(link) {
    if (link === "") {
      throw new Error("Cannot assingn an empty link");
    }

    this.#_picLink = link;
  }

  set name(new_name) {
    new_name = new_name.trim();

    if (new_name === "") {
      throw new Error("Name cannot be empty");
    }

    this.#_username = new_name;
  }

  set message(new_message) {
    new_message = new_message.trim();

    this.#message = new_message;
  }

  // getter starts here
  get picLink() {
    console.log(`User pic link = ${this.#_picLink}`);
    return this.#_picLink;
  }

  get name() {
    return this.#_username;
  }

  get message() {
    return this.#message;
  }
}

class Avatar_provider{

  #avatar_weblink = [];

  constructor(link){
    if(link === ''){
      throw new Error('Cannot use an empty link for a user avatar');
    }

    this.#avatar_weblink.push(link);
  }

  // setter methods
  set new_link(link){
    if(link === ''){
      throw new Error('Cannot use an empty link for a user avatar');
    }

    this.#avatar_weblink.push(link);
  }

  // getter methods
  get random_link(){
    const index = Math.floor(Math.random() * this.#avatar_weblink.length);

    return this.#avatar_weblink[index];

  }
}

const link = new Avatar_provider('https://i.pinimg.com/564x/85/cc/6f/85cc6f5b64aed0e13ebe2e090a2d0f9c.jpg');
link.new_link = 'https://i.pinimg.com/564x/85/cc/6f/85cc6f5b64aed0e13ebe2e090a2d0f9c.jpg';
link.new_link = 'https://i.pinimg.com/736x/d6/3e/7c/d63e7caf134bb42002536a77699773f8.jpg';
// constructing a class using stored username in localStorage
const user_name = localStorage.getItem("user_name");
const user = new User(user_name);
user.pic = link.random_link;

console.log(user.picLink);

ws.onmessage = (event) => {
  // this code resolves the Object blob
  const blob = event.data;
  const reader = new FileReader();

  reader.onload = function (e) {
    // a div to contain the text and the user avatar
    const user_prompt = document.createElement("div");
    // a div to wrap the image for easier styling
    const user_image = document.createElement("div");
    // a div that will display the user name
    const username_div = document.createElement("p");
    const text = e.target.result;

    const p = document.createElement("p");
    p.textContent = text;
    p.classList.add("youre-message");

    const avatar = document.createElement("img");
    avatar.src = user.picLink;
    // append the image to the image container first
    user_image.appendChild(avatar);
    user_image.classList.add("avatar");

    username_div.textContent = user.name;
    username_div.classList.add("user_name");

    // append them to the div
    user_prompt.appendChild(p);
    user_prompt.appendChild(user_image);
    user_prompt.appendChild(username_div);

    mess_list.appendChild(user_prompt);
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


