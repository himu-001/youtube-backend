import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const id = req.user?._id;

    if (!content) {
        throw new ApiError(400, "Content not found");
    }

    const tweet = await Tweet.create({
        content: content,
        owner: id
    })

    if (!tweet) {
        throw new ApiError(500, "error while creating a tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid id");
    }

    const getTweet = await Tweet.find({ owner: userId });
    
    if (getTweet.length == 0) {
        throw new ApiError(404, "No tweets found for this user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, getTweet, "tweet fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;
    const  userId  = req.user?._id;

    if (!content) {
        throw new ApiError(400, "Content not found");
    }

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid id");
    }

    if (!tweetId) {
        throw new ApiError(400, "Tweet id is required");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid id");
    }

    const updatedTweet = await Tweet.findOneAndUpdate({
        _id: tweetId,
        owner: userId
    }, {
        $set: {
            content: content,
        }
    }, {
        new: true
    })

    if (!updatedTweet) {
        throw new ApiError(400, "tweet not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "tweet deleted successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    
    const { tweetId } = req.params;
    const  userId  = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid id");
    }

    if (!tweetId) {
        throw new ApiError(400, "Tweet id is required");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid id");
    }

    const deletedTweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: userId
    });

    if (!deletedTweet) {
        throw new ApiError(400, "tweet not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedTweet, "tweet fetched successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}