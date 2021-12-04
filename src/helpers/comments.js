const { Comment, Image } = require('../models');

module.exports = {
  async newest () {

    const comments = await Comment.find()
      .limit(5)
      .sort({timestamp: -1})
      .lean()

    for(const comment of comments) {
      const image = await Image.findOne({_id: comment.image_id}).lean();
      comment.image = image;
    }

    return comments;
  }
};
