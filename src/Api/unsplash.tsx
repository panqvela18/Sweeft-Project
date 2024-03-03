import axios from "axios";

export default axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: "Client-ID Rz6Y9hZ6FqLCbhbrrkrg0tw7YfGA4QvhQMWJguLPsfM",
  },
});
