/**
 * Task 1
 * Асинхронна функція для роботи з масивами.
 * @param {Array} array - масив даних.
 * @param {Function} asyncCallback - асинхронна функція (елемент, callback).
 * @param {Function} onComplete - функція завершення (error, results).
 * @param {number} debounceTime - затримка виконання, мс (за замовчуванням 0).
 */
const asyncMap = async (array, asyncCallback, onComplete, debounceTime = 0) => {
    const results = [];
    let index = 0;
    const procesNext = () => {
        if (index >= array.length) {
            return onComplete(null,results);
        }
        const item = array[index];
        const startTime = new Date();
        asyncCallback(item, (err,res) => {
            if (err) {
                return onComplete(err,null);
            }
            const elapsed = new Date() - startTime;
            const delay = debounceTime ? Math.max(0, debounceTime - elapsed) : 0;
            setTimeout(() => {
                results.push(res);
                index++;
                procesNext();
            }, delay);
        } );
    };
    procesNext();
};    

/**
 * Task 2
 * Асинхронна функція для роботи з масивами з використанням Promise.
 * @param {Array} array - масив даних.
 * @param {Function} asyncCallback - асинхронна функція (елемент) => Promise.
 * @param {number} concurrensy - кількість паралельних операцій (за замовчуванням Infinity).
 * @param {AbortSignal} signal - об'єкт сигналу для відміни.
 * @returns {Promise<Array>} Promise з результатами.
 */
const promiseMap = async (array, asyncCallback, concurrensy = Infinity, signal = null) => {
    const results = [];
    const executing = new Set();
    if (signal?.aborted) {
        throw new Error("Операцiя була вiдмiнена до початку")
    }
    const procesItem = async (item,index) => {
        if (signal?.aborted) {
            throw new Error("Операцiя була вiдмiнена");
        }  
        results[index] = await asyncCallback(item,signal);
    };
    for (let i=0;i<array.length;i++) {
        const promise = procesItem(array[i],i).finally(() => {
            executing.delete(promise);
        });
        executing.add(promise);
        if (executing.size>=concurrensy) {
            await Promise.race(executing);
        }
    }
    await Promise.all(executing);
    return results;
};
module.exports = {asyncMap, promiseMap};













