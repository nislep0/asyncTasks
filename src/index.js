/**
 * Task 1
 * Асинхронна функція для роботи з масивами.
 * @param {Array} array - масив даних.
 * @param {Function} asyncCallback - асинхронна функція (елемент, callback).
 * @param {Function} onComplete - функція завершення (error, results).
 * @param {number} debounceTime - затримка виконання, мс (за замовчуванням 0).
 */
const asyncMap = async (array, asyncCallback, onComplete, debounceTime = 0) => {
	try {
		const results = [];
		for (const item of array) {
		    const startTime = new Date();
		    const result = await new Promise((resolve,reject) => 
		    asyncCallback(item, (err,res) => (err ? reject(err): resolve(res))));
		    const elapsed = new Date() - startTime;
		    const delay = Math.max(0, debounceTime - elapsed);
		    if (delay > 0) {
		        await new Promise((resolve) => setTimeout(resolve,delay));
		    } 
		    results.push(result);
		}
		onComplete(null,results);
	} catch (e) {
	    onComplete(e,null);
	}
};  

/**
 * Task 2
 * Асинхронна функція для роботи з масивами з використанням Promise.
 * @param {Array} array - масив даних.
 * @param {Function} asyncCallback - асинхронна функція (елемент) => Promise.
 * @param {number} concurrency - кількість паралельних операцій (за замовчуванням Infinity).
 * @returns {Promise<Array>} Promise з результатами.
 */
const promiseMap = async (array, asyncCallback, concurrensy = Infinity) => {
    const results = [];
    const executing = new Set();
    for (const item of array) {
        const promise = asyncCallback(item)
        .then((result) => {
            results.push(result);
            executing.delete(promise);
        })
        .catch((error) => {
            executing.delete(promise);
            throw error;
        });
        executing.add(promise);
        if (executing.size >= concurrensy) {
            await Promise.race(executing);
        }
    }
    await Promise.all(executing);
    return results;
};
module.exports = {asyncMap, promiseMap};













