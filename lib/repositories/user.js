var repository = require('./repository').createRepository();

repository.create = function (user, callback) {
    var data = repository.data;
    user.role = 'client';
    callback(null, data[user.id] = user);
};

module.exports = repository;