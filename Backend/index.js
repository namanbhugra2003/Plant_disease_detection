import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import FarmerFormRoute from "./Routes/FarmerFormRoutes.js";
import AiTreatmentRoute from "./Routes/AiTreatmentRoute.js";
import userRoutes from "./Routes/userRoutes.js"; 
import testRoute from "./Routes/testRoute.js";  
import materialRoute from './Routes/MaterialRoute.js'; 
import articleRoutes from './Routes/articleRoutes.js';
import alertRoutes from "./Routes/alertRoutes.js";
import ManagerRoutes from "./Routes/ManagerRoutes.js";
import activityRoutes from './Routes/activityRoutes.js';



const app = express();


// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
app.use(cors());

// Default route
app.get("/", (request, response) => {
  console.log(request);
  return response.status(200).send("Welcome to SMART_AGRIGUARD_Mern API");
});


app.use('/materials', materialRoute);

// Auth Routes
app.use("/api/auth", userRoutes);

// Test Routes
app.use("/api/test", testRoute);

app.use('/api/activities', activityRoutes);

// Feature Routes
app.use("/farmer", FarmerFormRoute);
app.use("/ai", AiTreatmentRoute);
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);

app.use('/manager', ManagerRoutes);
app.use('/alerts', alertRoutes);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
