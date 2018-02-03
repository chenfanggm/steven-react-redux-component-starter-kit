
// Promise
if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// Fetch
if (typeof window.fetch === 'undefined') {
  require('whatwg-fetch');
}
