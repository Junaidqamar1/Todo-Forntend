import { io } from "socket.io-client";

const socket = io("https://todo-backend-production-6db3.up.railway.app"); // replace with backend URL in prod

export default socket;

