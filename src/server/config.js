const path = require('path');
const morgan = require('morgan');
const express = require('express');
const errorHandler = require('errorhandler');
const exphbs = require('express-handlebars');
const multer = require('multer');

const routes = require('../routes');

module.exports = app => {

  // Settings
  app.set('port', process.env.PORT || 5000);
  app.set('views', path.join(__dirname, '../views'));
  app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require('./helpers'),
    extname: '.hbs'
  }));
  app.set('view engine', '.hbs');

  //multer single upload
  const multer_single_upload= multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image')
  //multer multiple upload
  const multer_multiple_upload= multer({dest: path.join(__dirname, '../public/upload/temp')}).array('file', 10)
  
  app.use(multer_single_upload);

  // middlewares
  app.use(morgan('dev'));
  app.use(express.urlencoded({extended: false}));
  app.use(express.json());

  // Routes
  routes(app);

  // Static files
  app.use('/public', express.static(path.join(__dirname, '../public')));

  // Error Handling
  if('development' === app.get('env')) {
    app.use(errorHandler());
  }

  return app;

};
