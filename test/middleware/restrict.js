var sinon = require('sinon'),
    assert = require('assert'),
    libPath = process.argv.indexOf('html-cov') >= 0 ? 'lib-cov' : 'lib',
    restrict = require('../../' + libPath + '/middleware/restrict');

describe('#restrict', function () {
    it('should return a function', function () {
        var result = restrict();
        assert(typeof result === 'function');
    });

    it('should call next when request has a user', function () {
        var fn = restrict(),
            request = {
                user: true
            },
            next = sinon.spy();

        fn(request, null, next);

        assert(next.called);
    });

    it('should redirect to redirectPath when request has no user', function () {
        var redirectPath = '/redirect',
            fn = restrict(redirectPath),
            request = { },
            response = {
                redirect: function () {

                }
            },
            spy = sinon.spy(response, 'redirect');

        fn(request, response, null);

        assert(spy.calledWith(redirectPath));
    });

    it('should redirect to root when request has no user and no redirectPath', function () {
        var root = '/',
            fn = restrict(),
            request = { },
            response = {
                redirect: function () {

                }
            },
            spy = sinon.spy(response, 'redirect');

        fn(request, response, null);

        assert(spy.calledWith(root));
    });
});