const mainAPI = require('./mainApi');
const tvAPI = require('./tvApi');
const accountAPI = require('./accountApi');
const reviewAPI = require('./reviewAPI');

const constructorMethod = (app) => {
    app.use('/', mainAPI);
    app.use('/account', accountAPI);
    app.use('/shows', tvAPI);
    app.use('/review', reviewAPI);
    app.use('*', (_, res) => {
        return res.status(404).redirect('/');
    });
}

module.exports = constructorMethod;