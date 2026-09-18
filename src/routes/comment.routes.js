import { Router } from "express";

import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT); //apply jwt verification to all

router.route("/video/:videoId").get(getVideoComments).post(addComment);
router.route("/comment/:commentId").patch(updateComment).delete(deleteComment);

export default router;
