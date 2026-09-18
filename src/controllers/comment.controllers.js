import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId) throw new ApiError(404, "video Id not found")
    
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID")
    
    const comments = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                content: 1,
                owner: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);
        
    const options = {
        page: Number(page),
        limit: Number(limit)
    };

    const result = await Comment.aggregatePaginate(
        comments,
        options
    );
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "Comments fetched successfully"
        )
    );
})

const addComment = asyncHandler(async (req, res) => {
    
    const { videoId } = req.params;
    const userId = req.user?._id;
    const { content } = req.body;

    if (!videoId || !userId) throw new ApiError(400, "VideoId and userID is required");

    if (!content) throw new ApiError(400, "Content is required");

    if (!isValidObjectId(videoId) || !isValidObjectId(userId)) throw new ApiError(400, "Invalid id");

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: userId
    });

    return res.status(200).json(new ApiResponse(200, comment, "Comment created successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!commentId || !userId) throw new ApiError(400, "commentId or userId is required");

    if (!content) throw new ApiError(400, "content is required");

    if (!isValidObjectId(commentId) || !isValidObjectId(userId)) throw new ApiError(400, "Invalid id");

    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: userId
        },
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not the owner");
    }

    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!commentId || !userId) {
        throw new ApiError(400, "commentId and userId are required");
    }

    if (!isValidObjectId(commentId) || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid id");
    }

    const comment = await Comment.findOneAndDelete(
        {
            _id: commentId,
            owner: userId
        },
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not the owner");
    }

    return res.status(200).json(new ApiResponse(200, comment, "Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}