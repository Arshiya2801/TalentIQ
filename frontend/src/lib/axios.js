import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.warn(
    "[axios] VITE_API_URL is not defined. Requests will go to the frontend origin (this often causes 404s)."
  );
} else {
  console.warn(`[axios] Using API base URL: ${baseURL}`);
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
});

export default axiosInstance;
