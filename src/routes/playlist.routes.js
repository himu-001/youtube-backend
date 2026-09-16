import { Router } from "express";

import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    deletePlaylist,
    updatePlaylist,
} from "../controllers/playlist.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist);

router.route("/user/:userId").get(verifyJWT, getUserPlaylists);

router.route("/:playlistId").get(verifyJWT, getPlaylistById);

router.route("/:playlistId").patch(verifyJWT, updatePlaylist);

router.route("/:playlistId").delete(verifyJWT, deletePlaylist);

export default router;