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

export default hyper;


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