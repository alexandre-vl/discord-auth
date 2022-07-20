const mongoose = require('mongoose');
module.exports = (async function() {
    return await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch(err => {return undefined})
})();