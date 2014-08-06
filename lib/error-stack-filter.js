var path = require('path');

function ErrorStackFilter(ROOT, IGNORE_FILES, limit) {
  if (!ROOT) {
    throw new Error('ROOT not found');
  }

  if (!IGNORE_FILES || !IGNORE_FILES instanceof Array) {
    throw new Error('IGNORE FILES not found');
  }

  limit = !limit ? Infinity : +limit;

  Object.defineProperties(this, {
    IGNORE_FILES : { get   : function () { return IGNORE_FILES.slice(); } },
    ROOT         : { value : ROOT,  writable : false },
    STACK_LIMIT  : { value : limit,  writable : false }
  });

  this.prepareStackTrace();
}

ErrorStackFilter.prototype.prepareStackTrace = function () {
  var self = this;

  Error.stackTraceLimit = self.STACK_LIMIT;
  Error.prepareStackTrace = function prepareFilteredStackTrace(error, structuredStackTrace) {
    var result = 'Error: ' + error.message + '\n';

    structuredStackTrace.forEach(function (frame) {
      var filename = frame.getFileName(),
          path = filename ? filename : '<anonymous>',
          ignore = false;

      for (var i = 0; i < self.IGNORE_FILES.length; i++) {
        var ignoreCase = self.IGNORE_FILES[i];
        if (typeof ignoreCase === 'string') {
          var match = ignoreCase.match(path);

          if (match !== null && match.index === 0) {
            ignore = true;
            break;
          }
        } else if (ignoreCase instanceof RegExp) {
          if (ignoreCase.test(path)) {
            ignore = true;
            break;
          }
        }
      }

      if (!ignore) {
        result += '\t' + self.formatStackFrame(frame) + '\n';
      }
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
