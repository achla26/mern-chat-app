import 'dotenv/config';
 
import  connectDB  from "./db/index.js"
import { server } from './app.js'; // Import server instead of app

connectDB()
  .then(() => {
    server.on("error", (error) => {
      console.error("Server error:", error);
      throw error;
    });

    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });