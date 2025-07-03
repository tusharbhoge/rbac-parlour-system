import { Server, Socket } from "socket.io";

export const setupAttendanceSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    socket.on("attendance:punch", (data) => {
      console.log("Punch Event:", data);

      io.emit("attendance:update", data); 
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
