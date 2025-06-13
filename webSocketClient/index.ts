import { io } from "socket.io-client";

const socket = io("ws://0.0.0.0:8080", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzMGYxNmZlMTFmYmI3ZGU5ZTk2NzhlM2U2Yjg4OTY3IiwidXNlck5hbWUiOiJKaXdhbjc3ODkiLCJyb2xlIjoiRFJJVkVSIiwiaWF0IjoxNzQ5ODIzNDE1LCJleHAiOjE3NTA0MjgyMTV9.z2LJZ-aWw0Ta77R40N0_tNVNsFlNGuNIatAiRvcyBjM" // Replace with a real JWT
  }
});

socket.on("connect", () => {
  console.log("🟢 Connected");

  setInterval(() => {
    const gpsData = {
      type: "GPS_UPDATE",
      routeId: "route-xyz123",
      latitude: 27.7122 + Math.random() * 0.001, // simulate slight movement
      longitude: 85.3240 + Math.random() * 0.001,
      speed: 45 + Math.random() * 5,
      accuracy: 4.5,
      heading: Math.floor(Math.random() * 360),
      timestamp: new Date().toISOString()
    };

    socket.emit("message", gpsData);
    console.log("📡 Sent GPS data:", gpsData);
  }, 3000); // 3 seconds
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected");
});

socket.on("connect_error", (err) => {
  console.error("⛔ Connection Error:", err.message);
});
