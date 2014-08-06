var errorStackFilter = require('../'),
    errorStackFilterInstance = errorStackFilter(),
    path   = require('path'),
    should = require('should')

describe('Error Stack Filter', function () {
  describe('Instance API', function () {
    it('should set IGNORE_FILES with setIgnoreFiles method', function () {
      errorStackFilterInstance.setIgnoreFiles([ 'hello', 'world' ]);
      errorStackFilterInstance.should.have.property('IGNORE_FILES');
      errorStackFilterInstance.IGNORE_FILES.should.be.an.instanceOf(Array);
      errorStackFilterInstance.IGNORE_FILES[0].should.equal('hello');
      errorStackFilterInstance.IGNORE_FILES[1].should.equal('world');
    });

    it('should add IGNORE_FILES with addIgnoreFiles method', function () {
      errorStackFilterInstance.setIgnoreFiles([]);
      errorStackFilterInstance.addIgnoreFiles('hello', 'world');
      errorStackFilterInstance.IGNORE_FILES.should.be.an.instanceOf(Array);
      errorStackFilterInstance.IGNORE_FILES[0].should.equal('hello');
      errorStackFilterInstance.IGNORE_FILES[1].should.equal('world');
    });

    it('should add to IGNORE_FILES with array as a first argument passed to addIgnoreFiles method', function () {
      errorStackFilterInstance.setIgnoreFiles([]);
      errorStackFilterInstance.addIgnoreFiles(['hello', 'world']);
      errorStackFilterInstance.IGNORE_FILES.should.be.an.instanceOf(Array);
      errorStackFilterInstance.IGNORE_FILES[0].should.equal('hello');
      errorStackFilterInstance.IGNORE_FILES[1].should.equal('world');
    });

    it('should remove from IGNORE_FILES with removeIgnoreFiles method', function () {
      errorStackFilterInstance.setIgnoreFiles(['hello', 'world', 'its', 'nodejs']);
      errorStackFilterInstance.removeIgnoreFiles('its', 'nodejs');
      errorStackFilterInstance.IGNORE_FILES.should.be.an.instanceOf(Array);
      errorStackFilterInstance.IGNORE_FILES[0].should.equal('hello');
      errorStackFilterInstance.IGNORE_FILES[1].should.equal('world');
    });

    it('should remove from IGNORE_FILES with array as first argument passed to removeIgnoreFiles method', function () {
      errorStackFilterInstance.setIgnoreFiles(['hello', 'world', 'its', 'nodejs']);
      errorStackFilterInstance.removeIgnoreFiles(['its', 'nodejs']);
      errorStackFilterInstance.IGNORE_FILES.should.be.an.instanceOf(Array);
      errorStackFilterInstance.IGNORE_FILES[0].should.equal('hello');
      errorStackFilterInstance.IGNORE_FILES[1].should.equal('world');
    });

    it('should set limit with setLimit method', function () {
      errorStackFilterInstance.setLimit(15);
      errorStackFilterInstance.STACK_LIMIT.should.equal(15);

      errorStackFilterInstance.setLimit('20');
      errorStackFilterInstance.STACK_LIMIT.should.equal(20);
    });

    it('should return same instance if called twice', function () {
      var instance = errorStackFilter();
      instance.STACK_LIMIT.should.equal(20);
      instance.IGNORE_FILES.should.be.an.instanceOf(Array);
      instance.IGNORE_FILES[0].should.equal('hello');
      instance.IGNORE_FILES[1].should.equal('world');
    });
  });

  describe('Instance with ignoring some.js file', function () {
    before(function () {
      errorStackFilter([ 'timers.js', /\/node_modules\// ]);
    });

    it('should have property IGNORE_FILES typeof Array with length 2 containing timers.js and node_modules regexp', function () {
      errorStackFilterInstance.should.have.property('IGNORE_FILES');
      errorStackFilterInstance.IGNORE_FILES.should.be.an.instanceOf(Array);
      errorStackFilterInstance.IGNORE_FILES.length.should.equal(2);
      errorStackFilterInstance.IGNORE_FILES[0].should.equal('timers.js');
    });

    it('should have non-writable IGNORE_FILES', function () {
      errorStackFilterInstance.IGNORE_FILES[0] = 123;
      errorStackFilterInstance.IGNORE_FILES[0].should.not.equal(123);
    });

    it('should return filtered stack trace(without mocha files)', function () {
      try {
        throw new Error('error');
      } catch(e) {
        e.stack.length.should.not.equal(0);
        e.stack.split('\n').length.should.equal(3);
      }
    });
  });
});
