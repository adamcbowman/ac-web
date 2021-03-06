/**
 * Express configuration
 */

'use strict';

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var cors = require('cors');

var ROOT = path.normalize(__dirname + '/../..');

var logger = require('../logger')

/*
 * Log when the method override header is used. We have middleware that makes
 * this work and I want to remove it. Lets see if anyone is actually using this
 * feature first
 */
function logMethodOverrideHeaders(req, res, next) {
    if (req.headers['x-http-method-override']) {
        logger.warn('METHOD_OVERRIDE: ' + JSON.stringify(req.headers))
    }
    next();
}

module.exports = function(app) {
    var env = app.get('env');

    app.use(cors());
    app.set('views', ROOT + '/server/views');
    app.set('view engine', 'jade');
    app.use(compression());
    app.use(logMethodOverrideHeaders);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    if ('production' === env) {
        app.set('appPath', ROOT + '/public');
        app.use(morgan('dev'));
    }

    if ('development' === env || 'test' === env) {
        app.set('appPath', 'client');
        app.use(morgan('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
};
