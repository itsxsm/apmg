console.log("Loading WebSocket server.")

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082 });

wss.on("connection", ws => {
	console.log("New client connected!");

	ws.on("close", () => {
		console.log("Client has disconnected!")
	});

	ws.on("message", data => {
		console.log(`Client has sent us: ${data}`);

		// TODO: why is toString() needed here?
		// It seems to be required to work,
		// but this tutorial works without it:
		// https://www.youtube.com/watch?v=FduLSXEHLng
		ws.send(data.toString().toUpperCase());
	});
});

console.log("WebSocketChat server loaded.")