/**
 * Custom in-memory cache (memcache-like) implementation with built-in time-to-live(ttl) feature.
 * @param {{ttl: number}} options Currently only ttl in seconds is supported
 */
function Cache( options = {ttl: 10}  ) {
  const self = this;
  this._cache = new Map();
  this._ttl = options.ttl;
  const GC_TIMEOUT = 450;
  
  function resetGC() {
    setTimeout(function() {
      const now = Date.now();
      for (let [key, cacheRecord] of self._cache) {
        try {
          if (cacheRecord.expiredAt < now) self._cache.delete(key);
        } catch( ex) {
          console.error('GC error: ' + ex.message, ex.getStack());
        }
      }

      resetGC();
    }, GC_TIMEOUT);
  }

  resetGC();
}

/**
 * Sets cached value
 * @param {string} key
 * @param {string|number|object|null|undefined|NaN} value
 * @throws if the "key" parameter is not a string
 */
Cache.prototype.set = function(key, value) {
  if (typeof key !== 'string') throw new Error('"key" must be a string');

  const isObject = null !== value && typeof value === 'object';
  const cacheRecord = {expiredAt: Date.now(), isObject, value: isObject? JSON.stringify(value): value, };
  this._cache.set(key.toString(), cacheRecord);
};

/**
 * Returns cached value or undefined if it does not exists in cache
 * @param {string} key 
 * @return {string|number|undefined}
 */
Cache.prototype.get = function(key) {  
  const cacheRecord = this._cache.get(key.toString());
  return (cacheRecord && cacheRecord.isObject && JSON.parse(cacheRecord.value)) || (cacheRecord && cacheRecord.value);
};

/**
 * Removes cached instance from cache
 * @param {string} key
 */
Cache.prototype.purge = function (key) {
  this._cache.delete(key.toString());
};

/**
 * Resets the cache
 */
Cache.prototype.purgeAll = function() {
  this._cache = new Map();
};

module.exports=Cache;
