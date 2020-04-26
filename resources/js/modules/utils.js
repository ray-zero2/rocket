/**
 * 連続して発生するイベントを間引いて停止後一定時間経過した際に処理を行う
 * @param {function} callback コールバック
 * @param {number} time この時間何もイベントが発生しなければ処理を行う
 * @return {function} 実行内容
 */

export const debounse = (callback, time) => {
  let setTimeoutId;

  return event => {
    clearTimeout(setTimeoutId);
    setTimeoutId = setTimeout(() => {
      callback(event);
    }, time);
  };
};

/**
 * [a, b]間に存在するxを[c, d]間に線形補間した時の値を返す。
 * @param {number} x 元々の数
 * @param {number} a 元々の範囲の下限
 * @param {number} b 元々の範囲の上限
 * @param {number} c 新しい範囲の下限
 * @param {number} d 新しい範囲の上限
 * @return {number} 補間後の値
 */

export const lerp = (x, a, b, c, d) => {
  return ((x - a) * (d - c)) / (b - a) + c;
};

/**
 * 入力値が最小・最大値を超えないように打ち止めされた値を返す。
 * @param {number} x 入力値
 * @param {number} minValue 最小値
 * @param {number} maxValue 最大値
 */
export const clamp = (x, minValue, maxValue) => {
  return Math.max(Math.min(x, maxValue), minValue);
};

/**
 * 画像が読み込まれたらPromiseを返す.
 * const image = await loadImage(path)のように使用。
 * @param {string} imagePath 読み込みたい画像のパス
 * @return {Promise}
 */
export const loadImage = imagePath => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject();
    };

    image.src = imagePath;
  });
};
