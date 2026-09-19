import { isValidObjectId } from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    //Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id;

    if (!userId) throw new ApiError(400, "User Id is required");
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid  userId");

    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: userId
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
            }
        },
    ]);

    const subscriptionStats = await Subscription.aggregate([
        {
            $match: {
                channel: userId
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: { $sum: 1 }
            }
        }
    ]);

    const videoIds = await Video.find({ owner: userId }).select("_id");

    const likeStats = await Like.aggregate([
        {
            $match: {
                video: {
                    $in: videoIds.map((video) => video._id)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: 1 }
            }
        }
    ]);

    const channelStats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers: subscriptionStats[0]?.totalSubscribers || 0,
        totalLikes: likeStats[0]?.totalLikes || 0,
    };

    return res.status(200).json(new ApiResponse(200, channelStats, "Fetched the user channel stats successfully"));

});

const getChannelVideos = asyncHandler(async (req, res) => {
    //Get all the videos uploaded by the channel
    const userId = req.user?._id;

    if (!userId) throw new ApiError(400, "UserId is required");
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userId");

    const allChannelVideos = await Video.aggregate([
        {
            $match: {
                owner: userId
            }
        },
        {
            $lookup: {
                from: ""
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, allChannelVideos, "Channel Videos fetched successfully"));
})

export {
    getChannelStats, 
    getChannelVideos
}