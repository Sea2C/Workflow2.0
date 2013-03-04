var sinon = require('sinon'),
    assert = require('assert'),
    libPath = process.argv.indexOf('html-cov') >= 0 ? 'lib-cov' : 'lib',
    users = require('../../../' + libPath + '/routes/users');

describe('/users', function () {
    describe('#list', function () {
        it('should use param page and pageSize when in request', function () {
            var request = {
                    page: 1,
                    pageSize: 2,
                    param: function (name) {
                        return this[name];
                    }
                },
                repository = {
                    list: function () {

                    }
                },
                spy = sinon.spy(repository, 'list');

            users.list(request, null, repository);

            assert(spy.calledWith(request.page, request.pageSize));
        });

        it('should use default page and pageSize when not in request', function () {
            var page = 1,
                pageSize = 25,
                request = {
                    param: function (name) {
                        return this[name];
                    }
                },
                repository = {
                    list: function () {

                    }
                },
                spy = sinon.spy(repository, 'list');

            users.list(request, null, repository);

            assert(spy.calledWith(page, pageSize));
        });

        it('should return 500 and error when repository errors', function () {
            var statuscode = 500,
                error = { msg: 'error' },
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    list: function (page, pageSize, callback) {
                        return callback(error);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.list(request, response, repository);

            assert(spy.calledWith(statuscode, error));
        });

        it('should return 200 and results when repository succeeds', function () {
            var statuscode = 200,
                results = [{ id: 1 }],
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    list: function (page, pageSize, callback) {
                        return callback(null, results);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.list(request, response, repository);

            assert(spy.calledWith(statuscode, results));
        });
    });

    describe('#read', function () {
        it('should call repository with id when in the request', function () {
            var request = {
                    id: Date.now(),
                    param: function (name) {
                        return this[name];
                    }
                },
                repository = {
                    findById: function () {

                    }
                },
                spy = sinon.spy(repository, 'findById');

            users.read(request, null, repository);

            assert(spy.calledWith(request.id));
        });

        it('should return 500 and error when repository errors', function () {
            var statuscode = 500,
                error = { msg: 'error' },
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    findById: function (id, callback) {
                        return callback(error);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.read(request, response, repository);

            assert(spy.calledWith(statuscode, error));
        });

        it('should return 404 when repository returns falsy', function () {
            var statuscode = 404,
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    findById: function (id, callback) {
                        return callback(null, null);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.read(request, response, repository);

            assert(spy.calledWith(statuscode));
        });

        it('should return 200 and user when repository succeeds', function () {
            var statuscode = 200,
                user = { id: 1 },
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    findById: function (id, callback) {
                        return callback(null, user);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.read(request, response, repository);

            assert(spy.calledWith(statuscode, user));
        });
    });

    describe('#update', function () {
        it('should return 500 and error when repository find errors', function () {
            var statuscode = 500,
                error = { msg: 'error' },
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    findById: function (id, callback) {
                        return callback(error);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.update(request, response, repository);

            assert(spy.calledWith(statuscode, error));
        });

        it('should return 404 when repository find returns falsy', function () {
            var statuscode = 404,
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    findById: function (id, callback) {
                        return callback(null, null);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.update(request, response, repository);

            assert(spy.calledWith(statuscode));
        });

        it('should return 500 and error when repository update errors', function () {
            var statuscode = 500,
                user = { id: 1 },
                error = { msg: 'error' },
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    findById: function (id, callback) {
                        return callback(null, user);
                    },
                    update: function (user, callback) {
                        return callback(error);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.update(request, response, repository);

            assert(spy.calledWith(statuscode, error));
        });

        it('should return 200 and appointment when repository update succeeds', function () {
            var statuscode = 200,
                user = { id: 1 },
                request = {
                    param: function () {

                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    findById: function (id, callback) {
                        return callback(null, user);
                    },
                    update: function (user, callback) {
                        return callback(null, user);
                    }
                },
                spy = sinon.spy(response, 'json');

            users.update(request, response, repository);

            assert(spy.calledWith(statuscode, user));
        });
    });
});