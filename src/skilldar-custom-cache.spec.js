const Cache = require('./skilldar-custom-cache');

describe('Basic unit tests', () => {
  let cache;
  beforeEach(() => cache = new Cache());

  it('calling Cache() returns defined object and set()/get()/purge()/purgeAll() are functions', () =>{
    expect(cache).toBeDefined();
    expect(typeof cache.set).toBe('function');
    expect(typeof cache.get).toBe('function');
    expect(typeof cache.purge).toBe('function');
    expect(typeof cache.purgeAll).toBe('function');
  });  
  it('can store string/number/object/null/undefined/NaN value types', () => {
    const string = 'string';
    const number = 123;
    const object = {hello: 'world'};
    const _null = null;
    const nan = NaN;
    cache.set('string', string)
    cache.set('number', number);
    cache.set('object', object);
    cache.set('null', _null);
    cache.set('undef', undefined);
    cache.set('nan', nan);

    expect(cache.get('string')).toBe(string);
    expect(cache.get('number')).toBe(number);    
    expect(cache.get('object')).toEqual(object);
    expect(cache.get('null')).toBe(_null);    
    expect(cache.get('undef')).toBeUndefined();
    expect(cache.get('nan')).toBe(nan);
  });
  it('cache.purge(KEY) removes the cached value only for the KEY', () => {
    cache.set('test1', 'test string 1');
    cache.set('test2', 'test string 2');
    cache.purge('test1');
    expect(cache.get('test1')).toBeUndefined();
    expect(cache.get('test2')).toBe('test string 2');
  });
  it('cache.purgeAll() clears the cache', () => {
    cache.set('test1', 'test string 1');
    cache.set('test2', 'test string 2');
    cache.purgeAll();
    expect(cache.get('test1')).toBeUndefined();
    expect(cache.get('test2')).toBeUndefined();
  });  
});

describe('testing ttl', () => {
  it('caches objects for 1  second', done => {
    const cache1 = new Cache({ ttl: 1 });
    const obj = { hello: 'world' };
    cache1.set('test', obj);

    expect(cache1.get('test', obj)).toEqual(obj);
    setTimeout(() => {
      expect(cache1.get('test', obj)).toBeUndefined();
      done();
    }, 1001);
  });
  it('caches objects for 3 seconds', done => {
    const cache3 = new Cache({ ttl: 3 });
    const obj = { hello: 'world' };
    cache3.set('test', obj);

    expect(cache3.get('test', obj)).toEqual(obj);
    setTimeout(() => {
      expect(cache3.get('test', obj)).toBeUndefined();
      done();
    }, 3001);
  });  
});

describe('testing work with memleaks', () => {
  it('internally stores a separate copy of the object', () => {
    const cache = new Cache();
    const nestedObj = {two: 'mississippi'};
    const testObj = {one: 'mississippi', nested: nestedObj};
    cache.set('test', testObj);
    expect(cache.get('test')).toEqual(testObj);
    expect(cache.get('test') === testObj).toBe(false);
  });
});
