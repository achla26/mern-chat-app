export default function initializeSocket(io) {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });

        // Add more socket event listeners here
    });
}
