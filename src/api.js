import axios from "axios";

const API = axios.create({
  baseURL: "https://todo-backend-production-6db3.up.railway.app/api",
});

export default API;
