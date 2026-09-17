import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberId = req.user?._id;

    if (!channelId || !subscriberId) {
        throw new ApiError(404, "channel or subscriber id not found");
    }

    if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid id");
    }

    const existingSubscriber = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId,
    })

    if (!existingSubscriber) {
        const subscribe = await Subscription.create({
            subscriber: subscriberId,
        channel: channelId,
        })

        if (!subscribe) throw new ApiError(500, "Error while subscribing");

        return res
            .status(200)
            .json(new ApiResponse(200, subscribe, "subscribed Successfully"));
    } else {
        const unsubscribe = await Subscription.findOneAndDelete({
            channel: channelId,
            subscriber: subscriberId
        })

        if (!unsubscribe) throw new ApiError(500, "Error occured while unsubscribing");
        return res
            .status(200)
            .json(new ApiResponse(200, unsubscribe, "unsubscribed Successfully"));
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(404, "channel id not found");
    }

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const getChannelSubs = await Subscription.find({
        channel: channelId
    }).populate("subscriber", "username fullname avatar");

    if (getChannelSubs.length === 0) throw new ApiError(404, "no subscriber exits for this channel");

    return res
        .status(200)
        .json(new ApiResponse(200, getChannelSubs, "fetched users subscribers Successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    
    if (!subscriberId) {
        throw new ApiError(404, "subscriber id not found");
    }

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id");
    }

    const getUserSubsscribedChannels = await Subscription.find({
        subscriber: subscriberId
    }).populate("channel", "fullname username avatar");

     if (getUserSubsscribedChannels.length === 0) throw new ApiError(404, "no subscriber exits for this channel");

    return res
        .status(200)
        .json(new ApiResponse(200, getUserSubsscribedChannels, "fetched users subscribedTo Successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}