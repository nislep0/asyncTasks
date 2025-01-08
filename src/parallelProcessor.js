async function parallelProcess(data,asyncProcessor,parallelLimit = 5) {
    const results = [];
    let currentIndex = 0;
    async function processNext() {
        if (currentIndex >= data.length) return null;
        const index = currentIndex++;
        try {
            const result = await asyncProcessor(data[index]);
            results[index] = result;
        } catch (err) {
            results[index] = err;
        }
        return processNext();
    }
    const pool = Array(parallelLimit).fill(null).map(() => processNext());
    await Promise.all(pool);
    return results;
}

module.exports = parallelProcess;

