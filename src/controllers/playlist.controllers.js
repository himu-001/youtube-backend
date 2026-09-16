import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const user_id = req.user?._id;

    if (!isValidObjectId(user_id)) {
        throw new ApiError(404, "Invalid user ID");
    }
    if (!name.trim()) {
        throw new ApiError(400, "Name is required");
    }
    if (!description.trim()) {
        throw new ApiError(400, "description is required");
    }

    const newPlaylist = await Playlist.create({
        name: name,
        description: description,
        owner: user_id
    });

    if (!newPlaylist) {
        throw new ApiError(500, "Error creating playlist")
    }

    return res
        .status(200)
        .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const userPlaylist = await Playlist.find({
        owner: userId
    });
    
    if (userPlaylist.length == 0) {
        throw new ApiError(400, "No playlists found");
    }

    return res.status(200).json(new ApiResponse(200, userPlaylist, "Fetched the user playlist successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "Pkaylist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Fetched the playlist successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }
    
    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    if (!name.trim()) {
        throw new ApiError(400, "Name is required");
    }
    if (!description.trim()) {
        throw new ApiError(400, "description is required");
    }

    const updatedList = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    );

    if (!updatedList) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
})

export { createPlaylist, getUserPlaylists, getPlaylistById, deletePlaylist, updatePlaylist };