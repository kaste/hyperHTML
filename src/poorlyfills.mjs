import {UID} from './constants.js';

const window = document.defaultView;

///////////////////////////////////////////////////////////////////////////
// DOM poorlyfills
///////////////////////////////////////////////////////////////////////////

let $Event = window.Event;

try {
  new $Event(UID);
} catch(o_O) {
  $Event = function Event(type) {
    const e = document.createEvent('Event');
    return e.initEvent(type, false, false), e;
  };
}

export const Event = $Event;

///////////////////////////////////////////////////////////////////////////
// ES5+ poorlyfills
///////////////////////////////////////////////////////////////////////////
// for a better, yet poor, Map, Set, WeakMap, and WeakSet
// implementation, check poorlyfills package:
// https://github.com/WebReflection/poorlyfills
///////////////////////////////////////////////////////////////////////////

export const Map = window.Map || function Map() {
  const k = [], v = [];
  return {
    get(obj) { return v[k.indexOf(obj)]; },
    set(obj, value) { v[k.push(obj) - 1] = value; }
  };
};

export const WeakMap = window.WeakMap || function WeakMap() {
  return {
    delete(obj) { delete obj[UID]; },
    get(obj) { return obj[UID]; },
    has(obj) { return UID in obj; },
    set(obj, value) {
      Object.defineProperty(obj, UID, {
        configurable: true,
        value
      });
    }
  };
};

export const WeakSet = window.WeakSet || function WeakSet() {
  const wm = new WeakMap;
  return {
    add(obj) { wm.set(obj, UID); },
    has(obj) { return wm.get(obj) === UID; }
  };
};

export const isArray = Array.isArray || ((toString) => {
  const str = toString.call([]);
  return array => toString.call(array) === str;
})({}.toString);

export const trim = ''.trim || function trim() {
  return this.replace(/^\s+|\s+$/g, '');
};