String.prototype.interpolate = function(o) {
  return this.replace(/%{([^{}]*)}/g,
    function (a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
};

function reduce(array, fn, initial, bind) {
  var len = array.length, i = 0;
  if (len == 0 && arguments.length == 1) 
    return null;
  var result = initial || array[i++];
  for (; i < len; i++) 
    result = fn.call(bind, result, array[i], i, array);
  return result;
}

function init_i18n(translations) { 
  var t = function(key, namespace) {
    var s = reduce(key.split("."), function(ns, k) { 
      return ns ? ns[k] : null; 
    }, translations);
    
    if (s && namespace) {
      return s.interpolate(namespace)      
    } else {
      return s || ("Missing JS translation: " + key); 
    }
  }
  window.t = t;
}
