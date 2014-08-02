var ErrorStackFilter = require('../'),
    path   = require('path'),
    should = require('should');

describe('Error Stack Filter', function () {

  it('Should throw error if no arguments or not IGNORE_FILES', function () {
    [{
      args  : [],
      error : 'ROOT not found'
    }, {
      args  : [ '.' ],
      error : 'IGNORE FILES not found'
    }].forEach(function (testCase) {
      var errorStackFilterInstance, success = false;

      function wrapErrorStackFilter() {
        ErrorStackFilter.apply(this, testCase.args);
      }

      try {
        errorStackFilterInstance = new wrapErrorStackFilter();
        success = true;
      } catch (e) {
        e.should.be.an.instanceOf(Error);
        e.message.should.equal(testCase.error);
      } finally {
        success.should.equal(!testCase.error);
      }
    });
  });

  it('Should not throw error if IGNORE_FILES is empty and directory is current', function () {
    var errorStackFilterInstance = new ErrorStackFilter(__dirname, []);
  });

  describe('Instance with ignoring some.js file', function () {
    var currentPath = path.resolve(__dirname),
        errorStackFilterInstance = new ErrorStackFilter(currentPath, [ './some.js' ]);

    it('should have current path ending with test (dir name)', function () {
      currentPath.substr(-4).should.equal('test');
    });
    
    it('should have property ROOT and it should be currentPath', function () {
      errorStackFilterInstance.should.have.property('ROOT', currentPath);
    });

    it('should have property IGNORE_FILES typeof Array with length 1 containing currentPath/some.js', function () {
      errorStackFilterInstance.should.have.property('IGNORE_FILES');
      errorStackFilterInstance.IGNORE_FILES.should.be.an.instanceOf(Array);
      errorStackFilterInstance.IGNORE_FILES.length.should.equal(1);
      errorStackFilterInstance.IGNORE_FILES[0].should.equal(currentPath + '/some.js');
    });

    it('should have non-writable IGNORE_FILES', function () {
      errorStackFilterInstance.IGNORE_FILES[0] = 123;
      errorStackFilterInstance.IGNORE_FILES[0].should.not.equal(123);
    });

    it('should have non-writable ROOT', function () {
      errorStackFilterInstance.ROOT = 123;
      errorStackFilterInstance.ROOT.should.equal(currentPath);
    });
  });
});
