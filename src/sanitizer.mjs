import {UID, UIDC} from './constants.js';

const no = /(<[a-z]+[a-z0-9:_-]*)((?:[^\S]+[a-z0-9:_-]+(?:=(?:'.*?'|".*?"|<.+?>|\S+))?)+)([^\S]*\/?>)/gi;
const comments = ($0, $1, $2, $3) => $1 + $2.replace(find, replace) + $3;

const find = new RegExp('([^\\S][a-z]+[a-z0-9:_-]*=)([\'"]?)' + UIDC + '\\2', 'gi');
const replace = ($0, $1, $2) => $1 + ($2 || '"') + UID + ($2 || '"');

export default html => html.replace(no, comments);
