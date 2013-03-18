var sinon = require('sinon'),
    assert = require('assert'),
    libPath = process.argv.indexOf('html-cov') >= 0 ? 'lib-cov' : 'lib',
    deny = require('../../' + libPath + '/middleware/deny');

describe('#deny', function () {
    it('should call next when request has a user', function () {
        var request = {
                user: true
            },
            next = sinon.spy();

        deny(request, null, next);

        assert(next.called);
    });

    it('should respond with 403 when request has no user', function () {
        var request = { },
            response = {
                json: function () {

                }
            },
            spy = sinon.spy(response, 'json');

        deny(request, response, null);

        assert(spy.calledWith(403));
    });
});