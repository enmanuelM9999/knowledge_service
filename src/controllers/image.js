const fs = require('fs-extra');
const path = require('path');

const md5 = require('md5');

const ctrl = {};

const sidebar = require('../helpers/sidebar');
const { randomNumber } = require('../helpers/libs');
const { Image, Comment } = require('../models');

ctrl.index = async (req, res) => {
  let viewModel = { image: {}, comments: [] };
  const image = await Image.findOne({_id:  req.params.image_id });
  const image2 = await Image.findOne({_id:  req.params.image_id }).lean();
  console.log("la imagen ",image)
  if (image) {
    image.views = image.views + 1;
    image2.views = image2.views + 1;
    viewModel.image = image;
    image.save();
    viewModel.image = image2;
    const comments = await Comment.find({image_id: image._id})
      .sort({'timestamp': 1})
      .lean()
    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    res.render('image', viewModel);
  } else {
    res.redirect('/');
  }
};

ctrl.create = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    if (false) {
      saveImage()
    } else {
      // Image Location
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

      // Validate Extension
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        // you wil need the public/temp path or this will throw an error
        await fs.rename(imageTempPath, targetPath);
        const newImg = new Image({
          title: req.body.title,
          filename: imgUrl + ext,
          description: req.body.description
        });
        const imageSaved = await newImg.save();
        res.redirect('/images/' + imageSaved._id);
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: 'Only Images are allowed' });
      }
    }
  };

  saveImage();
};

ctrl.like = async (req, res) => {
  const image = await Image.findOne({filename: {$regex: req.params.image_id}});
  console.log(image)
  if (image) {
    image.likes = image.likes + 1;
    await image.save();
    res.json({likes: image.likes})
  } else {
    res.status(500).json({error: 'Internal Error'});
  }
};

ctrl.comment= async (req, res) => {
  const image = await Image.findOne({_id:req.params.image_id}).lean();
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect('/images/' + image._id + '#' + newComment._id);
  } else {
    res.redirect('/');
  }
};

ctrl.remove = async (req, res) => {
  const image = await Image.findOne({_id: req.params.image_id});
  if (image) {
    await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
    await Comment.deleteOne({image_id: image._id});
    await image.remove();
    res.json(true);
  } else {
    res.json({response: 'Bad Request.'})
  }
};

module.exports = ctrl;
