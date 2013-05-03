var sinon = require('sinon'),
    assert = require('assert'),
    libPath = process.argv.indexOf('html-cov') >= 0 ? 'lib-cov' : 'lib',
    roles = require('../../' + libPath + '/middleware/roles');

describe('#roles', function () {
    it('should return a function', function () {
        var result = roles();
        assert(typeof result === 'function');
    });

    it('should call next when request has a user with role as array', function () {
        var role = 'test',
            fn = roles([role]),
            request = {
                user: {
                    role: role
                }
            },
            next = sinon.spy();

        fn(request, null, next);

        assert(next.called);
    });

    it('should call next when request has a user with role as parameter', function () {
        var role = 'test',
            fn = roles(role),
            request = {
                user: {
                    role: role
                }
            },
            next = sinon.spy();

        fn(request, null, next);

        assert(next.called);
    });

    it('should respond with 403 when no roles are specified', function () {
        var fn = roles(),
            request = {
                user: {
                    role: ''
                }
            },
            response = {
                json: function () {

                }
            },
            spy = sinon.spy(response, 'json');

        fn(request, response, null);

        assert(spy.calledWith(403));
    });

    it('should respond with 403 when request has a user with no valid role', function () {
        var fn = roles(['test', 'ing', 'stuff']),
            request = {
                user: {
                    role: ''
                }
            },
            response = {
                json: function () {

                }
            },
            spy = sinon.spy(response, 'json');

        fn(request, response, null);

        assert(spy.calledWith(403));
    });
});