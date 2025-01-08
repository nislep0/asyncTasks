const parallelProcess = require("../src/parallelProcessor");

describe("task5: Паралельна обробка даних", () => {
    test("Обробка масиву даних", async () => {
        const data = [1,2,3,4,5];
        const asyncProcessor = async (item) => item*2;
        const results = await parallelProcess(data,asyncProcessor,3);
        expect(results).toEqual([2,4,6,8,10]);
    });
    
    test("Обробка з обмеженням паралельностi", async () => {
        const data = [1,2,3,4,5];
        const asyncProcessor = async (item) => {
            await new Promise((resolve) => setTimeout(resolve,100));
            return item*2;
        };
        const start = new Date();
        await parallelProcess(data,asyncProcessor,2);
        const dur = new Date() - start;
        expect(dur).toBeGreaterThanOrEqual(200);
    });
    
    test("Обробка помилок", async () =>  {
        const data = [1,2,3];
        const asyncProcessor = async (item) => {
            if (item === 2) {
                throw new Error("Помилка (parallelProcess)");
            }
            return item*2;
        };
        const results = await parallelProcess(data,asyncProcessor,3);
        expect(results[0]).toBe(2);
        expect(results[1]).toBeInstanceOf(Error);
        expect(results[1].message).toBe("Помилка (parallelProcess)");
        expect(results[2]).toBe(6);
    });
});