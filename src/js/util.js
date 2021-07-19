const _toString = Object.prototype.toString;

export function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}

/**
 * 洗牌
 * @param source
 * @returns {*}
 */
export function shuffle(source) {
  const arr = source.slice();
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i);
    swap(arr, i, j);
  }

  return arr;
}

/**
 * 0-max 中间的数值
 * @param max
 * @returns {number}
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

/**
 * 交换
 * @param arr
 * @param i
 * @param j
 */
function swap(arr, i, j) {
  const t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}

/**
 * 时间格式化
 * @param interval
 * @returns {string}
 */
export function formatTime(interval) {
  // 向下取整
  interval = interval | 0;
  const minute = (((interval / 60) | 0) + '').padStart(2, '0');
  const second = ((interval % 60) + '').padStart(2, '0');
  return `${minute}:${second}`;
}
