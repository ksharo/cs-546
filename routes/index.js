const mainAPI = require('./mainApi');
const accountAPI = require('./accountApi');

const constructorMethod = (app) => {
    app.use('/', mainAPI);
    app.use('/account', accountAPI);
    app.use('*', (_, res) => {
        return res.status(404).redirect('/');
    });
}

module.exports = constructorMethod;