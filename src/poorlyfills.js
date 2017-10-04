import {UID} from './constants.js';

const window = document.defaultView;

let $Event = window.Event;

try {
  new $Event(UID);
} catch(o_O) {
  $Event = function Event(type) {
    const e = document.createEvent('Event');
    e.initEvent(type, false, false);
    return e;
  };
}

export const Event = $Event;

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
