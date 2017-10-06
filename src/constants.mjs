// Node.CONSTANTS
// without assuming Node is globally available
// since this project is used on the backend too
export const ELEMENT_NODE = 1;
export const ATTRIBUTE_NODE = 2;
export const TEXT_NODE = 3;
export const COMMENT_NODE = 8;
export const DOCUMENT_FRAGMENT_NODE = 11;

// SVG related shortcuts
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const SVG_OWNER = 'ownerSVGElement';

// white-listed cases for attributes
export const SHOULD_USE_ATTRIBUTE = /^style$/i;

// unique identifier + comment node
export const UID = '_hyper: ' + ((Math.random() * new Date) | 0) + ';';
export const UIDC = '<!--' + UID + '-->';
