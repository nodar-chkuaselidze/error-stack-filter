var path = require('path');

function ErrorStackFilter(ROOT, IGNORE_FILES) {
  if (!ROOT) {
    throw new Error('ROOT not found');
  }

  if (!IGNORE_FILES || !IGNORE_FILES instanceof Array) {
    throw new Error('IGNORE FILES not found');
  }

  Object.defineProperties(this, {
    ROOT         : { value : ROOT,         writable : false },
    IGNORE_FILES : { get   : function () { return IGNORE_FILES.slice(); } }
  });

  IGNORE_FILES = this.resolvePaths();
}

ErrorStackFilter.prototype.resolvePaths = function () {
  var self = this;

  return this.IGNORE_FILES.map(function (filePath) {
    return path.resolve(self.ROOT + '/', filePath);
  });
};

module.exports = exports = ErrorStackFilter;
