const fs = require('fs');

function doFullPathMkdir (fullPath) {
    if (!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,
            {
                recursive: true
                }
            );
    }
}
module.exports = {doFullPathMkdir}