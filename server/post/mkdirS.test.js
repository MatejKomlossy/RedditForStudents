
const fs = require("fs");
const {doFullPathMkdir} = require('./mkdirS');

test('create path', () => {
    const temp = "./temp/saved_images/db";
    doFullPathMkdir(temp);
    expect(fs.existsSync(temp)).toBe(true);

});