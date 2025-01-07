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

demoAsyncMap();
demoErrorHandlingAsyncMap();

(async () => {
    await demoPromiseMap();
    await demoErrorHandlingPromiseMap();
    await demoConcurencyPromiseMap();
})();

