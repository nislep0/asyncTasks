const {processLargeFile,generateLargeDataset,createTransformStream} = require("../src/asyncIterator");
const fs = require("fs");
const {pipeline} = require("stream/promises");

describe("Task4: Обробка великих наборiв даних", () => {
    test("Читання великого файлу построково", async () => {
        const filePath = "./tests/testfile.txt";
        fs.writeFileSync(filePath,"line1\nline2\nline3\nline4");
        const lineCount = await processLargeFile(filePath);
        expect(lineCount).toBe(4);
        fs.unlinkSync(filePath);
    });
    
    test("Генерацiя великого набору даних", async () => {
        const count = 5;
        const data = [];
        for await (const item of generateLargeDataset(count)) {
            data.push(item);
        }
        expect(data.length).toBe(count);
        expect(data[0]).toBe("data item 0");
        expect(data[count-1]).toBe("data item 4");
    }); 
    
    test("Перетворення тексту", async () => {
        const input = 'hello\nworld';
        const inputPath = "./tests/input.txt";
        const outputPath = "./tests/output.txt";
        const inputStream = fs.createReadStream(inputPath,{encoding:"utf8"});
        const outputStream = fs.createWriteStream(outputPath);
        fs.writeFileSync(inputPath,input);
        const transformStream = createTransformStream();
        await pipeline(inputStream,transformStream,outputStream);
        const result = fs.readFileSync(outputPath,{encoding:"utf8"});
        expect(result).toBe("HELLO\nWORLD");
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
    });
});



