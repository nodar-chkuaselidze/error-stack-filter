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

  this.prepareStackTrace();
}

ErrorStackFilter.prototype.resolvePaths = function () {
  var self = this;

  return this.IGNORE_FILES.map(function (filePath) {
    return path.resolve(self.ROOT + '/', filePath);
  });
};

ErrorStackFilter.prototype.prepareStackTrace = function () {
  var self = this;

  Error.prepareStackTrace = function prepareFilteredStackTrace(error, structuredStackTrace) {
    var result = 'Error: ' + error.message + '\n';

    structuredStackTrace.forEach(function (frame) {
      result += '\t' + self.formatStackFrame(frame) + '\n';
    });

    return result;
  }
};

//Taken from LongJohn
ErrorStackFilter.prototype.formatLocation = function(frame) {
  var column, file, line;
  if (frame.isNative()) {
    return 'native';
  }
  if (frame.isEval()) {
    return 'eval at ' + frame.getEvalOrigin();
  }
  file = frame.getFileName();
  file = frame.getFileName() || '<anonymous>';
  line = frame.getLineNumber();
  column = frame.getColumnNumber();
  column = column != null ? ':' + column : '';
  line = line != null ? ':' + line : '';
  return file + line + column;
};

ErrorStackFilter.prototype.formatMethod = function(frame) {
  var function_name, method, type;
  function_name = frame.getFunctionName();
  if (!(frame.isToplevel() || frame.isConstructor())) {
    method = frame.getMethodName();
    type = frame.getTypeName();

    if (function_name == null) {
      return "" + type + "." + (method != null ? method : '<anonymous>');
    }

    if (method === function_name) {
      return "" + type + "." + function_name;
    }

    return "" + type + "." + function_name + " [as " + method + "]";
  }
  if (frame.isConstructor()) {
    return "new " + (function_name != null ? function_name : '<anonymous>');
  }
  if (function_name != null) {
    return function_name;
  }
  return null;
};

ErrorStackFilter.prototype.formatStackFrame = function(frame) {
  var location, method;

  method = this.formatMethod(frame);
  location = this.formatLocation(frame);
  if (method == null) {
    return " at " + location;
  }
  return " at " + method + " (" + location + ")";
};

module.exports = exports = ErrorStackFilter;
