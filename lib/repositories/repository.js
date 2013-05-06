var mongodb = require('mongodb'),
    Db = mongodb.Db,
    Server = mongodb.Server,
    Collection = mongodb.Collection,
    ObjectId = mongodb.ObjectID;

function Repository(configuration) {
    var me = this;
    me.configuration = configuration;
    me.db = new Db(configuration.database, new Server(configuration.host, configuration.port, { auto_reconnect: true }));
    me.db.open(function () {});
}

Repository.prototype = {
    withCollection: function (callback) {
        var me = this,
            db = me.db,
            configuration = me.configuration;

        db.collection(configuration.collection, callback);
    },
    list: function (page, pageSize, callback) {
        this.withCollection(function (error, collection) {
            if (error) {
                return callback(error);
            }

            collection.find({}).limit(pageSize).skip((page - 1) * pageSize).toArray(callback);
        });
    },
    findById: function (id, callback) {
        this.withCollection(function (error, collection) {
            if (error) {
                return callback(error);
            }

            collection.findOne({ _id: new ObjectId(id) }, callback);
        });
    },
    create: function (model, callback) {
        this.withCollection(function (error, collection) {
            if (error) {
                return callback(error);
            }

            collection.insert(model, callback);
        });
    },
    update: function (model, callback) {
        this.withCollection(function (error, collection) {
            if (error) {
                return callback(error);
            }

            collection.update({ _id: model._id }, model, { safe: true }, callback);
        });
    },
    delete: function (model, callback) {
        this.withCollection(function (error, collection) {
            if (error) {
                return callback(error);
            }

            collection.remove({ _id: model._id }, { safe: true }, callback);
        });
    }
};

module.exports = {
    createRepository: function (configuration) {
        return new Repository(configuration);
    },
    Repository: Repository
};