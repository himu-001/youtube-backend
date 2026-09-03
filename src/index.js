import dns from "node:dns";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { error } from "node:console";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server listening on PORT : ${PORT}`)
    })
    server.on('error', (error) => {
      console.log('ERROR', error);
      throw error;
    })
    })
    .catch(err => console.log("MONGO DB Connection Failed!!! :",err));
