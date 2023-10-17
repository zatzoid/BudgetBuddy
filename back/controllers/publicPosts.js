const publicPosts = require('../models/publicPosts');
const PublicPost = require('../models/publicPosts');

function successResponse(res, data, statusCode = 200) {
    return res.status(statusCode).send({ data });
};

module.exports.deletePublicPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await PublicPost.findOneAndDelete(postId);
        return successResponse(res, { message: 'пост удален' });
    }
    catch (err) {

    }

};
module.exports.putCommentPublicPost = async (req, res, next) => {
    try {
        const { comment, owner } = req.body;
        const { postId } = req.params;
        const putComment = await PublicPost.findOneAndUpdate({ _id: postId },
            {
                $push: {
                    comments: { comment, owner }
                }
            },
            { new: true });
        return successResponse(res, { message: 'Комментарий опубликован' });
    }
    catch (err) {
        return next(err);
    }
};
module.exports.deleteCommentPublicPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { commentId } = req.body;
        const deleteComment = await PublicPost.findOneAndUpdate({ _id: postId }, {
            $pull: {
                comments: { _id: commentId }
            }
        },
            { new: true });
        return successResponse(res, { message: 'Комментарий удален' });
    }
    catch (err) {
        return next(err);
    }
};