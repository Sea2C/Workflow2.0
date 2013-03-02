var sinon = require('sinon'),
    assert = require('assert'),
    libPath = process.argv.indexOf('html-cov') >= 0 ? 'lib-cov' : 'lib',
    routes = require('../../' + libPath + '/routes');

describe('/', function () {
    describe('#index', function () {
         it('should render index view', function () {
            var view = 'index',
                request = { },
                response = {
                    render: function () {

                    }
                },
                spy = sinon.spy(response, 'render');

            routes.index(request, response);

            assert(spy.calledWith(view));
        });
    });

    describe('#login', function () {
         it('should render login view', function () {
            var view = 'login',
                request = { },
                response = {
                    render: function () {

                    }
                },
                spy = sinon.spy(response, 'render');

            routes.login(request, response);

            assert(spy.calledWith(view));
        });
    });
});