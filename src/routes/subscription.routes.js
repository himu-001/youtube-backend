import { Router } from "express";

import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
} from "../controllers/subscription.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle-subscription/:channelId").post(toggleSubscription);
router.route("/channel-subs/:channelId").get(getUserChannelSubscribers);
router.route("/channel-subscribedTo/:subscriberId").get(getSubscribedChannels);

export default router;