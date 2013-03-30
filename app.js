
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');

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
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
