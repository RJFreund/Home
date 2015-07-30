var express = require('express');
var router = express.Router();

module.exports = function(io){
  router.get('/:page', function(req, res, next){
    var page = req.params.page;
    if (page == 'layout')
    {
      res.render('error');
    }
    res.render(page);
  });

  router.get('/', function(req, res, next) {
    res.render('layout');
  });

  return router;
};