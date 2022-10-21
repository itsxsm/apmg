console.log("Loading WebSocket server.")

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082 });

wss.on("connection", ws => {
    console.log("New client connected!");

    ws.on("close", event => {
        if (event.wasClean) {
            console.log(
                `[close] Connection closed cleanly, code=${event.code}`
                + ` reason=${event.reason}`
            );
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log("Connection died.");
        }
    });

    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`);

        // TODO: why is toString() needed here?
        // It seems to be required to work,
        // but this tutorial works without it:
        // https://www.youtube.com/watch?v=FduLSXEHLng
        ws.send(data.toString().toUpperCase());
    });

    ws.on("error", data => {
        try {
            console.log(`ERROR: WebSocket error encountered: ${data}`);
        } catch (err) {
            console.log("ERROR: WebSocket error encountered: (non-printable)");
        }
    })
});

console.log("WebSocketChat server loaded.")