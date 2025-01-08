const fs = require("fs");
const readline = require("readline");
const {Transform} = require("stream");

async function processLargeFile(filePath) {
    const stream = fs.createReadStream(filePath,{encoding:"utf8"});
    const rl = readline.createInterface({input:stream});
    let lineCount = 0;
    for await (const line of rl) {
        console.log(`рядок ${lineCount++}: `, line);
    }
    return lineCount;
}

async function* generateLargeDataset(count) {
    for (let i = 0; i < count; i++) {
        yield `data item ${i}`;
    }
} 

function createTransformStream() {
    return new Transform({
        transform(chunk,encoding,callback) {
            const data = chunk.toString().toUpperCase();
            callback(null,data);
        },
    });
}

module.exports = {
    processLargeFile,
    generateLargeDataset,
    createTransformStream
}

