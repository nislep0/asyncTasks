const {asyncMap} = require("../src/index");

describe("asyncMap", () => {
    test("Асинхронне множення", (done) => {
        asyncMap(
            [2,3,4],
            (item,callback) => {
                setTimeout(() => {
                    callback(null, item*2);
                }, 1000)
            },
            (err,results) => {
                expect(err).toBeNull();
                expect(results).toEqual([4,6,8]);
                done();
            }
        );
    });
    
    test("Обробка помилок", (done) => {
        asyncMap(
            [2,3,4],
            (item,callback) => {
                if (item === 3) {
                    return callback(new Error("Помилка"), null);
                }
                setTimeout(() => {
                    callback(null, item*2);
                }, 1000)
            },
            (err,results) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe("Помилка")
                expect(results).toBeNull();
                done();
            }
        );
    });
    
    test("Підтримка дебаунсу", (done) => {
        const start = new Date();
        asyncMap(
            [2,3,4],
            (item,callback) => {
                setTimeout(() => {
                    callback(null, item*2);
                }, 1000)
            },
            (err,results) => {
                const elapsed = new Date() - start;
                expect(err).toBeNull();
                expect(results).toEqual([4,6,8]);
                expect(elapsed).toBeGreaterThanOrEqual(1000);
                done();
            }, 1000);
    });
});









