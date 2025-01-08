const {asyncMap, promiseMap} = require("./index");

const demoAsyncMap = () => {
    asyncMap(
        [2,3,4],
        (item, callback) => {
            setTimeout(() => {
                callback(null,item*2)
            }, 500);   
        },
        (err, results) => {
            if (err) {
                console.error("Помилка", err);
            } else {
                console.log("Результати: ", results);
            }
        },
        1000
    );
};

const demoErrorHandlingAsyncMap = () => {
    asyncMap(
        [2,3,4],
        (item, callback) => {
            if (item === 3) {
                return callback(new Error("Невiрний елемент"),null);
            }
            setTimeout(() => {
                callback(null,item*2)
            }, 500);   
        },
        (err, results) => {
            if (err) {
                console.error("Помилка", err);
            } else {
                console.log("Результати: ", results);
            }
        },
        1000
    );
};

const demoPromiseMap = async () => {
    const results = await promiseMap(
        [2,3,4],
        (item) => new Promise((resolve) => {
            setTimeout( () => resolve(item*2), 500);
        })
    );
    console.log("Результати (promise): ", results);
};

const demoErrorHandlingPromiseMap = async () => {
    try {
        const results = await promiseMap(
            [2,3,4],
            (item) => new Promise((resolve,reject) => {
                if (item === 3) {
                    return reject(new Error("Невiрний елемент"));
                }
                setTimeout( () => resolve(item*2), 500);
            })
        );
        console.log("Результати (promise): ", results);
    } catch (err) {
        console.error("Помилка (promise)", err); 
    }
};

const demoConcurencyPromiseMap = async () => {
    console.log("Початок");
    const start = new Date();
    
    const results = await promiseMap(
        [1,2,3,4,5,6],
        (item) => new Promise((resolve) => {
            setTimeout( () => resolve(item*2), 1000);
        }),
        2
    );
    console.log("Результати (concurency): ", results);
    console.log("Час виконання: ", new Date() - start, "ms");
};

const demoAbort = async () => {
    const controller = new AbortController();
    const {signal} = controller;
    setTimeout(() => controller.abort(),1500);
    try {
        const results = await promiseMap(
            [1,2,3,4,5,6],
            (item, signal) =>
                new Promise((resolve,reject) => {
                    const timeout = setTimeout(() => resolve(item*2),1000);
                    signal?.addEventListener("abort", () => {
                        clearTimeout(timeout);
                        reject(new Error("Операцiя вiдмiнена"));
                    });    
                }),
            2,
            signal
        );
        console.log("Результати (AbortController): ", results);
    } catch (err) {
        console.error("Помилка (AbortController)", err);
    }
};

demoAsyncMap();
demoErrorHandlingAsyncMap();

(async () => {
    await demoPromiseMap();
    await demoErrorHandlingPromiseMap();
    await demoConcurencyPromiseMap();
    await demoAbort();
})();

