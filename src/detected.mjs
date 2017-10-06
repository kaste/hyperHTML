const fragment = document.createDocumentFragment();

export const FF = typeof navigator === 'object' &&
                  /Firefox\/(\d+)/.test(navigator.userAgent) &&
                  parseFloat(RegExp.$1) < 55;

export const IE = (p => {
  p.innerHTML = '<i data-i="" class=""></i>';
  return /class/i.test(p.firstChild.attributes[0].name);
})(document.createElement('p'));

export const WK = !('children' in fragment);