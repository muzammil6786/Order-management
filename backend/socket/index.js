let io;

function setupSocket(server) {
    io = require('socket.io')(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}

module.exports = { setupSocket, get io() { return io; } };
