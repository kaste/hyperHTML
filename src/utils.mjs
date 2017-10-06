import {UIDC} from './constants.js';
import {FF, IE, WK} from './detected.js';

///////////////////////////////////////////////////////////////////////////
// DOM utilities
///////////////////////////////////////////////////////////////////////////

const fragment = document.createDocumentFragment();

export const appendNodes = 'append' in fragment ?
  (node, childNodes) => {
    node.append.apply(node, childNodes);
  } :
  (node, childNodes) => {
    for (let i = 0, length = childNodes.length; i < length; i++) {
      node.appendChild(childNodes[i]);
    }
  };

export const createText = (node, text) => node.ownerDocument.createTextNode(text);

appendNodes(fragment, [createText(fragment, 'g'), createText(fragment, '')]);
export const cloneNode = fragment.cloneNode(true).childNodes.length === 1 ?
  node => {
    const clone = node.cloneNode();
    for (let
      childNodes = node.childNodes || [],
      i = 0, length = childNodes.length;
      i < length; i++
    ) {
      clone.appendChild(cloneNode(childNodes[i]));
    }
    return clone;
  } :
  node => node.cloneNode(true);

export const getChildren = WK || IE ?
  node => {
    const children = [];
    for (let
      childNodes = node.childNodes,
      j = 0, i = 0, length = childNodes.length;
      i < length; i++
    ) {
      const child = childNodes[i];
      if (child.nodeType === ELEMENT_NODE) {
        children[j++] = child;
      }
    }
    return children;
  } :
  node => node.children;

export const getNode = WK || IE ?
  (parentNode, path) => {
    for (let i = 0, length = path.length; i < length; i++) {
      const name = path[i++];
      switch (name) {
        case 'children':
          parentNode = getChildren(parentNode)[path[i]];
          break;
        default:
          parentNode = parentNode[name][path[i]];
          break;
      }
    }
    return parentNode;
  } :
  (parentNode, path) => {
    for (let i = 0, length = path.length; i < length; i++) {
      parentNode = parentNode[path[i++]][path[i]];
    }
    return parentNode;
  };

///////////////////////////////////////////////////////////////////////////
// Template Literals utilities
///////////////////////////////////////////////////////////////////////////

const hash = str => {
  let value = 0x811c9dc5, i = 0, length = str.length;
  while (i < length) {
    value ^= str.charCodeAt(i++);
    value += (value << 1) + (value << 4) + (value << 7) + (value << 8) + (value << 24);
  }
  return value >>> 0;
};

export let TL = template => {
  if (FF || template.propertyIsEnumerable('raw')) {
    const templateObjects = {};
    TL = template => {
      const key = '_' + template.join(UIDC);
      return templateObjects[key] ||
            (templateObjects[key] = template);
    };
  }
  else TL = t => t;
  return TL(template);
};