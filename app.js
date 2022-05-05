/* The boring stuff */
const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* set up handlebars */
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

/* Our session cookie */
const session = require('express-session')
app.use(
    session({
        name: 'AuthCookie',
        secret: "some secret string!",
        saveUninitialized: true,
        resave: false,
    })
);

app.use('/account/view/:username', (req, res, next) => {
    if (req.session.user && req.params.username == req.session.user.username) {
        return res.redirect('/account/view');
    } else {
        next();
    }
});

app.use('/account/view', (req, res, next) => {
    if (req.originalUrl == req.baseUrl) {
        if (!req.session.user) {
            return res.status(403).redirect('/');
        } else {
            next();
        }
    } else {
        next();
    }
});

app.use('/account/edit', (req, res, next) => {
    if (req.originalUrl == req.baseUrl) {
        if (!req.session.user) {
            return res.status(403).redirect('/');
        } else {
            next();
        }
    } else {
        next();
    }
});

app.use('/shows/add/:showName', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).redirect('/shows/search');
    } else {
        next();
    }
});

/* start the server! */
configRoutes(app);

app.listen(3000, () => {
    console.log('The server is running on http://localhost:3000');
});