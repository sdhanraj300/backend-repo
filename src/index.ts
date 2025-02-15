export default {
  register() {},
  bootstrap({ strapi }: { strapi: any }) {
    const { Server } = require("socket.io");

    if (!strapi.server.httpServer) {
      console.error("⚠️ Strapi HTTP server is not available.");
      return;
    }

    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    io.on("connection", (socket : any) => {
      console.log("✅ A user connected:", socket.id);

      // Echo message back to the same user
      socket.on("send-message", (msg : any) => {
        console.log(`📩 Received from ${socket.id}: ${msg}`);

        // Server responds with the same message
        socket.emit("receive-message", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ A user disconnected:", socket.id);
      });
    });

    strapi.io = io;
    console.log("🚀 Socket.IO initialized successfully!");
  },
};
