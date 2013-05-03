var sinon = require('sinon'),
    assert = require('assert'),
    libPath = process.argv.indexOf('html-cov') >= 0 ? 'lib-cov' : 'lib',
    appointments = require('../../../' + libPath + '/routes/appointments');

describe('/appointments', function () {
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

            appointments.list(request, null, repository);

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

            appointments.list(request, null, repository);

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

            appointments.list(request, response, repository);

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

            appointments.list(request, response, repository);

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

            appointments.read(request, null, repository);

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

            appointments.read(request, response, repository);

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

            appointments.read(request, response, repository);

            assert(spy.calledWith(statuscode));
        });

        it('should return 200 and appointment when repository succeeds', function () {
            var statuscode = 200,
                appointment = { id: 1 },
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
                        return callback(null, appointment);
                    }
                },
                spy = sinon.spy(response, 'json');

            appointments.read(request, response, repository);

            assert(spy.calledWith(statuscode, appointment));
        });
    });

    describe('#create', function () {
        it('should return 500 and error when repository errors', function () {
            var statuscode = 500,
                error = { msg: 'error' },
                request = {
                    date: Date.now(),
                    param: function (name) {
                        return this[name];
                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    create: function (appointment, callback) {
                        return callback(error);
                    }
                },
                spy = sinon.spy(response, 'json');

            appointments.create(request, response, repository);

            assert(spy.calledWith(statuscode, error));
        });

        it('should return 201 and appointment when repository succeeds', function () {
            var statuscode = 201,
                appointment = { id: 1 },
                request = {
                    date: Date.now(),
                    param: function (name) {
                        return this[name];
                    }
                },
                response = {
                    json: function () {

                    }
                },
                repository = {
                    create: function (model, callback) {
                        return callback(null, appointment);
                    }
                },
                spy = sinon.spy(response, 'json');

            appointments.create(request, response, repository);

            assert(spy.calledWith(statuscode, appointment));
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

            appointments.update(request, response, repository);

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

            appointments.update(request, response, repository);

            assert(spy.calledWith(statuscode));
        });

        it('should return 500 and error when repository update errors', function () {
            var statuscode = 500,
                appointment = { id: 1 },
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
                        return callback(null, appointment);
                    },
                    update: function (appointment, callback) {
                        return callback(error);
                    }
                },
                spy = sinon.spy(response, 'json');

            appointments.update(request, response, repository);

            assert(spy.calledWith(statuscode, error));
        });

        it('should return 200 and appointment when repository update succeeds', function () {
            var statuscode = 200,
                appointment = { id: 1 },
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
                        return callback(null, appointment);
                    },
                    update: function (appointment, callback) {
                        return callback(null, appointment);
                    }
                },
                spy = sinon.spy(response, 'json');

            appointments.update(request, response, repository);

            assert(spy.calledWith(statuscode, appointment));
        });
    });

    describe('#delete', function () {
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

            appointments.delete(request, response, repository);

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

            appointments.delete(request, response, repository);

            assert(spy.calledWith(statuscode));
        });

        it('should return 500 and error when repository delete errors', function () {
            var statuscode = 500,
                appointment = { id: 1 },
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
                        return callback(null, appointment);
                    },
                    delete: function (appointment, callback) {
                        return callback(error);
                    }
                },
                spy = sinon.spy(response, 'json');

            appointments.delete(request, response, repository);

            assert(spy.calledWith(statuscode, error));
        });

        it('should return 200 when repository delete succeeds', function () {
            var statuscode = 200,
                appointment = { id: 1 },
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
                        return callback(null, appointment);
                    },
                    delete: function (appointment, callback) {
                        return callback(null, true);
                    }
                },
                spy = sinon.spy(response, 'json');

            appointments.delete(request, response, repository);

            assert(spy.calledWith(statuscode));
        });
    });
});