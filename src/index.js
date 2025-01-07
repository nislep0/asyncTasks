/**
 * Асинхронна функція для роботи з масивами.
 * @param {Array} array - масив даних.
 * @param {Function} asyncCallback - асинхронна функція (елемент, callback).
 * @param {Function} onComplete - функція завершення (error, results).
 * @param {number} debounceTime - затримка виконання, мс (за замовчуванням 0).
 */
const asyncMap = async (array, asyncCallback, onComplete, bounceTime = 0) => {
	try {
		const results = [];
		for (const item of array) {
		    const startTime = new Date();
		    const result = await new Promise((resolve,reject) => 
		    asyncCallback(item, (err,res) => (err ? reject(err): resolve(res))));
		    const elapsed = new Date() - startTime;
		    const delay = Math.max(0,bounceTime - elapsed);
		    if (delay > 0) {
		        await new Promise((resolve) => setTimeout(resolve,delay));
		    } 
		    results.push(result);
		}
		onComplete(null,results);
	} catch (e) {
	    onComplete(e,null);
	}
}  

module.exports = {asyncMap};