import {WeakMap} from './poorlyfills.js';
import {TL} from './utils.js';

const hypers = new WeakMap;
const wires = new WeakMap;

export const hyper = HTML =>
  arguments.length < 2 ?
    (HTML == null ?
      wireContent('html') :
      (typeof HTML === 'string' ?
        wire(null, HTML) :
        ('raw' in HTML ?
          wireContent('html')(HTML) :
          ('nodeType' in HTML ?
            bind(HTML) :
            wireWeakly(HTML, 'html')
          )
        )
      )
    ) :
    ('raw' in HTML ?
      wireContent('html') :
      wire
    ).apply(null, arguments);

export const wire = (obj, type) =>
  arguments.length < 1 ?
    wireContent('html') :
    (obj == null ?
      wireContent(type || 'html') :
      wireWeakly(obj, type || 'html')
    );

export const bind = context => render.bind(context);

export function Component() {};

hyper.MAX_LIST_SIZE = 1000;
hyper.Component = Component;
hyper.document = document;
hyper.bind = bind;
hyper.wire = wire;
export default hyper;

export const hyperHTML = hyper;

const wireContent = type => type;

const wireWeakly = (obj, type) => {
  let id = type;
  let wire = wires.get(obj);
  const i = type.indexOf(':');
  if (-1 < i) {
    id = type.slice(i + 1);
    type = type.slice(0, i) || 'html';
  }
  if (!wire) {
    wire = {};
    wires.set(obj, wire);
  }
  return wire[id] || (wire[id] = wireContent(type));
};


function render(template) {
  let hyper = hypers.get(this);
  if (
    !hyper ||
    hyper.template !== TL(template)
  ) {
    hyper = upgrade.apply(this, arguments);
    hypers.set(this, hyper);
  }
  update.apply(hyper.updates, arguments);
  return this;
}

function update() {
  
}

function upgrade() {
  
}

///////////////////////////////////////////////////////////////////////////
// hyper.Component
///////////////////////////////////////////////////////////////////////////

const lazyGetter = (type, fn) => {
  const secret = '_' + type + '$';
  return {
    configurable: true,
    get() {
      return this[secret] || (this[type] = fn.call(this, type));
    },
    set(value) {
      Object.defineProperty(this, secret, {
        configurable: true,
        value
      });
    }
  };
};

Object.defineProperties(
  Component.prototype,
  {
    // same as HyperHTMLElement handleEvent
    handleEvent: {
      configurable: true,
      value(e) {
        const ct = e.currentTarget;
        this[
          // the Component, which is a no-op,
          // is used as no-op if no getAttribute is available
          (ct.getAttribute || Component).call(ct, 'data-call') ||
          ('on' + e.type)
        ](e);
      }
    },
    // returns its own HTML wire or create it once on comp.render()
    html: lazyGetter('html', wireContent),
    // returns its own SVG wire or create it once on comp.render()
    svg: lazyGetter('svg', wireContent),
    // same as HyperHTMLElement state
    state: lazyGetter('state', function () {
      return this.defaultState;
    }),
    // same as HyperHTMLElement get defaultState
    defaultState: {
      configurable: true,
      get() {
        return {};
      }
    },
    // same as HyperHTMLElement setState
    setState: {
      configurable: true,
      value(state) {
        const target = this.state;
        const source = typeof state === 'function' ? state.call(this, target) : state;
        for (let key in source) target[key] = source[key];
        this.render();
      }
    }
    // the render must be defined when extending hyper.Component
    // the render **must** return either comp.html or comp.svg wire
    // render() { return this.html`<p>that's it</p>`; }
  }
);