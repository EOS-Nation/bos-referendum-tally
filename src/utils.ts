import * as crypto from 'crypto';

/**
 * Promise Delay
 *
 * @param {number} ms Milisecond delay
 * @return {Promise<void>}
 * @example
 *
 * await delay(100);
 */
export function delay(ms: number) {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve()
      }, ms);
  })
}

/**
 * Create Hash from JSON object
 *
 * @param {object} json JSON object
 * @returns {string} md5 hash
 * @example
 *
 * createHash({foo: "bar"}) // => 9bb58f26192e4ba00f01e2e7b136bbd8
 */
export function createHash(json: any) {
    const data = JSON.stringify(json);
    return crypto.createHash('md5').update(data).digest("hex");
}
