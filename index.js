import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"

import postRoutes from "./routes/posts.js"; 
import userRoutes from "./routes/user.js"; 

const app = express()
dotenv.config()

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

const PORT = process.env.port || 5000;

// mongoose.set("useFindAndModify", true);
mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => app.listen(PORT, () => console.log(`server running on port: ${PORT}`)))
    .catch((err) => console.log(err.message))





