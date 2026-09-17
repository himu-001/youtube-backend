import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleVideoLike = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId || !userId) {
        throw new ApiError(400, "videoId and userId are required");
    }

    if (!isValidObjectId(videoId) || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid videoId or userId");
    }

    const existingVideoLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if (!existingVideoLike) {

        const likeVideo = await Like.create({
            video: videoId,
            likedBy: userId
        });

        if (!likeVideo) {
            throw new ApiError(500, "Error occurred while liking");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, likeVideo, "Video liked successfully"));

    } else {

        const unlikeVideo = await Like.findOneAndDelete({
            video: videoId,
            likedBy: userId
        });

        if (!unlikeVideo) {
            throw new ApiError(500, "Error occurred while unliking");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, unlikeVideo, "Video unliked successfully"));
    }
});


const toggleCommentLike = asyncHandler(async (req, res) => {

    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!commentId || !userId) {
        throw new ApiError(400, "commentId and userId are required");
    }

    if (!isValidObjectId(commentId) || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid commentId or userId");
    }

    const existingCommentLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (!existingCommentLike) {

        const likeComment = await Like.create({
            comment: commentId,
            likedBy: userId
        });

        if (!likeComment) {
            throw new ApiError(500, "Error occurred while liking the comment");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, likeComment, "Comment liked successfully"));

    } else {

        const unlikeComment = await Like.findOneAndDelete({
            comment: commentId,
            likedBy: userId
        });

        if (!unlikeComment) {
            throw new ApiError(500, "Error occurred while unliking the comment");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, unlikeComment, "Comment unliked successfully"));
    }
});


const toggleTweetLike = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!tweetId || !userId) {
        throw new ApiError(400, "tweetId and userId are required");
    }

    if (!isValidObjectId(tweetId) || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid tweetId or userId");
    }

    const existingTweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    if (!existingTweetLike) {

        const likeTweet = await Like.create({
            tweet: tweetId,
            likedBy: userId
        });

        if (!likeTweet) {
            throw new ApiError(500, "Error occurred while liking the tweet");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, likeTweet, "Tweet liked successfully"));

    } else {

        const unlikeTweet = await Like.findOneAndDelete({
            tweet: tweetId,
            likedBy: userId
        });

        if (!unlikeTweet) {
            throw new ApiError(500, "Error occurred while unliking the tweet");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, unlikeTweet, "Tweet unliked successfully"));
    }
});


const getLikedVideos = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "UserId is required");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid UserId");
    }

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: userId,
                video: { $exists: true }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        {
            $unwind: "$video"
        },
        {
            $project: {
                _id: 0,
                video: 1
            }
        }
    ]);

    if (likedVideos.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    [],
                    "No liked videos found for this user"
                )
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "Liked videos fetched successfully"
            )
        );
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};