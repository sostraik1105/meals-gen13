const { app } = require('./app');

// Models
const { relations } = require('./models/rels');

// Utils
const { db } = require('./utils/database.util');

db.authenticate()
    .then(() => console.log('db authenticated'))
    .catch(err => console.log(err));

relations();

db.sync()
    .then(() => console.log('Db synced'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
});
