function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxx".replace(/[xy]/g, function(c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

  return uuid;
}

// GunDB
var peers = ['https://livecodestream-us.herokuapp.com/gun', 'https://livecodestream-eu.herokuapp.com/gun'];
var opt = { peers: peers, localStorage: false, radisk: false };
var app = Gun(opt).get('gunrtc');
const rooms = app.get("rooms");

/**
 * Singal - Enviar y escuchar mensajes de Firestore
 */
class Signal {
  constructor() {
    const urlQuery = new URLSearchParams(window.location.search);
    this.roomId = urlQuery.get("room");
    this.myId = create_UUID();
    this.messages = rooms.get(this.roomId).get("messages");
  }

  /**
   * Escuchar a nuevos mensajes en el room.
   * @param {void} cb
   */
  listenMessage(cb) {
    return this.messages.on(snap => {
	console.log('Got Message',snap);
        const data = snap;
        if (data.type === "added" && data.from != this.myId) {
          cb(data);
        }
    });
  }

  /**
   * Enviar mensaje
   * @param {object} msg
   */
  async sendMessage(msg) {
    await this.messages.put({
      from: this.myId,
      ...msg
    });
  }
}

window["SignalClient"] = Signal;
