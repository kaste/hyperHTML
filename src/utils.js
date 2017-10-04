import {UIDC} from './constants.js';
import {FF, IE, WK} from './detected.js';

const fragment = document.createDocumentFragment();

export const appendNodes = 'append' in fragment ?
  (node, childNodes) => {
    node.append.apply(node, childNodes);
  } :
  (node, childNodes) => {
    const fragment = node.ownerDocument.createDocumentFragment();
    for (let i = 0, length = childNodes.length; i < length; i++) {
      fragment.appendChild(childNodes[i]);
    }
    node.appendChild(fragment);
  };

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

export const getNode = IE || WK ?
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

export const isArray = Array.isArray || ((toString) => {
  const str = toString.call([]);
  return array => toString.call(array) === str;
})({}.toString);

export const trim = ''.trim || function trim() {
  return this.replace(/^\s+|\s+$/g, '');
};

export let TL = template => {
  if (template.propertyIsEnumerable('raw') || FF) {
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