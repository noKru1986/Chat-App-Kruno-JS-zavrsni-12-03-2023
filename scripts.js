const getRandomName = () => {
  const povrce = [
    "Krumpir",
    "Luk",
    "Poriluk",
    "Paradajz",
    "Mrkva",
    "Hren",
    "Vlasac",
    "Celer",
    "Karfiol",
    "Brokula",
    "Češnjak",
    "Peršin",
  ];
  return povrce[Math.floor(Math.random() * povrce.length)];
};

const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
};

const drone = new ScaleDrone("YuGu4CDH1ZbqsCbu", {
  data: {
    name: getRandomName(),
    color: getRandomColor(),
  },
});

const members = [];

drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Successfully connected to Scaledrone");
  const room = drone.subscribe("observable-room");
  room.on("open", (error) => {
    if (error) {
      return console.error(error);
    }
    console.log("Successfully joined room");
  });

  room.on("data", (text, member) => {
    if (member) {
      addMessage(text, member);
    }
  });
});

const messages = document.querySelector(".chat-window");
const message = document.querySelector(".message");
const input = document.querySelector(".input");
const form = document.querySelector(".form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value;
  if (value === "") {
    return;
  }
  input.value = "";
  drone.publish({
    room: "observable-room",
    message: value,
  });
});

const createMemberElement = (member) => {
  const { name, color } = member.clientData;
  const avatar = document.createElement("div");
  const user = document.createElement("div");
  user.appendChild(avatar);
  user.appendChild(document.createTextNode(name));
  user.className = "user-name";
  avatar.className = "avatar";
  avatar.style.backgroundColor = color;
  return user;
};

const createMessageElement = (text, member) => {
  const message = document.createElement("li");
  message.appendChild(createMemberElement(member));
  message.appendChild(document.createTextNode(text));
  message.className = "message";
  return message;
};

const addMessage = (text, member) => {
  const el = messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
  el.scrollTop = el.scrollHeight;
};