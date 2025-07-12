import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // replace with backend URL in prod

export default socket;

