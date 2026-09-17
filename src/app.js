import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());

// Routes Import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

// playList Routes
import playlistRouter from "./routes/playlist.routes.js"
// routes declaration
app.use("/api/v1/playlists", playlistRouter);

// tweets Routes
import tweetRouter from "./routes/tweet.routes.js"
// routes declaration
app.use("/api/v1/tweets", tweetRouter);

// subscription Routes
import subscriptionRouter from "./routes/subscription.routes.js"
// routes declaration
app.use("/api/v1/subscriptions", subscriptionRouter);

// subscription Routes
import likeRouter from "./routes/like.routes.js"
// routes declaration
app.use("/api/v1/likes", likeRouter);

export default app;