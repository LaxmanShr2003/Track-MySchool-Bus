// // src/kafka/consumers/chatConsumer.ts
// import { kafka as messageKafka } from "../config/kafka.client.message";
// import { Server } from "socket.io";
// import { insertChat, insertAlert, insertAttendance } from "../../services/insertService";

// const miscConsumer = messageKafka.consumer({ groupId: "misc-message-group" });

// export async function runMiscConsumer(io: Server) {
//   await miscConsumer.connect();
//   await miscConsumer.subscribe({ topic: "chat", fromBeginning: false });
//   await miscConsumer.subscribe({ topic: "alert", fromBeginning: false });
//   await miscConsumer.subscribe({ topic: "attendance", fromBeginning: false });

//   await miscConsumer.run({
//     eachMessage: async ({ topic, message }) => {
//       if (!message.value) return;
//       const payload = JSON.parse(message.value.toString());
//       const routeId = payload.routeId;
//       if (!routeId) return;

//       switch (topic) {
//         case "chat":
//           io.to(routeId).emit("chat:message", payload);
//           await insertChat(payload);
//           break;
//         case "alert":
//           io.to(routeId).emit("alert", payload);
//           await insertAlert(payload);
//           break;
//         case "attendance":
//           io.to(routeId).emit("attendance:update", payload);
//           await insertAttendance(payload);
//           break;
//       }
//     },
//   });

//   console.log("💬 Misc consumer running (chat, alert, attendance)");
// }
