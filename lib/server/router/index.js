'use strict';

var express = require('express');
var methodOverride = require('method-override');
var _ = require('lodash');
var lodashId = require('lodash-id');
var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');
var bodyParser = require('../body-parser');
var validateData = require('./validate-data');
var plural = require('./plural');
var nested = require('./nested');
var singular = require('./singular');
var mixins = require('../mixins');
var utils = require('../utils');


module.exports = function (source) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { foreignKeySuffix: 'Id' };

  // Create router
  var router = express.Router();

  // Add middlewares
  router.use(methodOverride());
  router.use(bodyParser);

  // Create database
  var db = void 0;
  if (_.isObject(source)) {
    db = low();
    db.setState(source);
  } else {
    db = low(source, { storage: fileAsync });
  }

  validateData(db.getState());

  // Add lodash-id methods to db
  db._.mixin(lodashId);

  // Add specific mixins
  db._.mixin(mixins);

  // Expose database
  router.db = db;

  // Expose render
  router.render = function (req, res) {
    res.jsonp(res.locals.data);
  };

  // GET /db
  router.get('/db', function (req, res) {
    res.jsonp(db.getState());
  });


  // para validar
  router.post('/validar', function (req, res) {
    var user      = req.body.usuario;
    var pass      = req.body.pass;
    var enc       = CryptoJS.AES.decrypt(pass, "Secret Passphrase")
    console.log("------password-------");
    console.log(pass);
    var resource  = db.get("users").getById(user).value();
    var clone = _.cloneDeep(resource);
    res.locals.data = clone;
    console.log(res.locals.data);
    console.log("-----------------------------------------------");

    router.render(req, res);
    // res.status(200);

    // res.locals.data = {'messagge' : "Funcion para validar"};
    // console.log(utils.validar());
    // utils.validar()
    // console.log(req.body);
    // console.log(req.body.pass);
  });


  // Handle /:parent/:parentId/:resource
  router.use(nested(opts));

  // Create routes
  db.forEach(function (value, key) {
    if (_.isPlainObject(value)) {
      router.use(`/${key}`, singular(db, key));
      return;
    }

    if (_.isArray(value)) {
      router.use(`/${key}`, plural(db, key, opts));
      return;
    }

    var msg = `Type of "${key}" (${typeof value}) ${_.isObject(source) ? '' : `in ${source}`} is not supported. ` + `Use objects or arrays of objects.`;

    throw new Error(msg);
  }).value();

  router.use(function (req, res) {
    if (!res.locals.data) {
      res.status(404);
      res.locals.data = {};
    }

    router.render(req, res);
  });

  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.stack);
  });
  //

  return router;
};