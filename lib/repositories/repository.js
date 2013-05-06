var mongodb = require('mongodb'),
    Db = mongodb.Db,
    Server = mongodb.Server,
    Collection = mongodb.Collection,
    ObjectId = mongodb.ObjectId;

function Repository(configuration) {
    var me = this;
    me.configuration = configuration;
    me.db = new Db(configuration.database, new Server(configuration.host, configuration.port));
}

Repository.prototype = {
    withClient: function (callback) {
        this.db.open(callback);
    },
    withCollection: function (callback) {
        var me = this,
            configuration = me.configuration;

        me.withClient(function (error, client) {
            var collection;

            if (error) {
                return callback(error);
            }

            collection = new Collection(client, configuration.collection);

            callback(null, collection);
        });
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