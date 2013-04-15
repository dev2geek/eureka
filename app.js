
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , session = require('./routes/session');

var party = require('./routes/party');

var stylus = require('stylus')
    , nib = require('nib');

var app = express();

app.locals = {
    pretty: true
};

app.configure(function(){
    // PORT=3000 node app
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);

    app.use(stylus.middleware({
        src: __dirname + '/public'
        , compile: function(str, path) {
            return stylus(str)
                .set('filename', path)
                .set('compress', true)
                .use(nib())
                .import('nib');
        }
    }));

    //app.use(express.directory(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
});

// NODE_ENV=development node app
app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);

// 棪木
app.get('/login', function(req, res) {
});

// 棪木
app.get('/party/create', function(req, res) {
    party.create.render(req, res);
});

// party
/*
 * api/...为数据接口路由
 * 其他为页面模版渲染路由
 */
// 棪木
app.post('/api/party/create', function(req, res) {
    party.create.post(req, res);
});

// 棪木
app.get('/party/edit/:id', function(req, res) {
    party.edit.render(req, res);
});
// 棪木
app.get('/party', function(req, res) {
    party.list.render(req, res);
});
// 棪木
app.get('/party/:id', function(req, res) {
    party.list.render(req, res);
});
// 棪木
app.get('/api/party', function(req, res) {
    party.list.get(req, res);
});

// 棪木
app.get('/api/party/:id', function(req, res) {
    party.list.get(req, res);
});
// 棪木
app.post('/api/party/edit/:id', function(req, res) {
    party.edit.post(req, res);
});
// 棪木
app.post('/api/party/del/:id', function(req, res) {
    party.del(req, res);
});

// session
// 七念
app.get('/session/create', session.create);
app.get('/session/get', session.get);
app.get('/session/update', session.update);
app.get('/session/del', session.del);

// 水儿
app.get('/session/list', function(req, res) {
});
app.get('/session/:id', function(req, res) {
});

// feedback
// 筱谷
app.get('/feedback/create', function(req, res) {
});
app.get('/feedback/list', function(req, res) {
});
app.get('/feedback/:id', function(req, res) {
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
