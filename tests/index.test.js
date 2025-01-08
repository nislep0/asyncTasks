const {asyncMap, promiseMap} = require("../src/index");

describe("asyncMap", () => {
    test("Асинхронне множення", (done) => {
        asyncMap(
            [2,3,4],
            (item,callback) => {
                setTimeout(() => {
                    callback(null, item*2);
                }, 200)
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
                }, 200)
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
                }, 200)
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

describe("promiseMap", () => {
    test("Асинхронне множення", async () => {
        const results = await promiseMap(
            [2,4,6],
            (item) => new Promise((resolve) => {
                setTimeout(() => resolve(item*2), 200)
            }));
            expect(results).toEqual([4,8,12]);
    });
    
    test("Обробка помилок", async () => {
        await expect(
            promiseMap([2,4,6], async (item) => {
               if (item === 4) {
                    throw new Error("Помилка");
                } 
                return item*2;
            })
        ).rejects.toThrow("Помилка")
    });
    
    
    test("Пiдтримка паралелiзму", async () => {
        const start = new Date();
        
        const results = await promiseMap(
            [2,3,4,5,6],
            (item) => new Promise((resolve) => {
                setTimeout(() => resolve(item*2), 1000)
            }), 2);
            const elapsed = new Date() - start;
            expect(results).toEqual([4,6,8,10,12]);
            expect(elapsed).toBeGreaterThanOrEqual(3000);
    });
    
});


describe("promiseMap з пiдтримкою AbortController", () => {
    test("Вiдмiна операції до її завершення", async () => {
        const controller = new AbortController();
        const {signal} = controller;
        setTimeout(() => controller.abort(),1500);
        await expect(
            promiseMap(
                [1,2,3,4,5,6],
                (item,signal) => 
                new Promise((resolve,reject) => {
                    const timeout = setTimeout(() => resolve(item*2),1000);
                    signal?.addEventListener("abort", () => {
                        clearTimeout(timeout);
                        reject(new Error("Операцiя вiдмiнена"));
                    });
                }),
                2,
                signal
            )
        ).rejects.toThrow("Операцiя вiдмiнена");
    });
    
    test("Успiшне виконання без вiдмiни", async () => {
        const controller = new AbortController();
        const {signal} = controller;
        const results = await promiseMap(
            [2,4,6],
            (item,signal) => new Promise((resolve) => {
                setTimeout(() => resolve(item*2), 200)
            }),
            2,
            signal
        );
        expect(results).toEqual([4,8,12]);
    });
});




