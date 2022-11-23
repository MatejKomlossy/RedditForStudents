const {sqlImage} = require("./sqlImage");
const Path = require("path");
const {savePath} = require("../contants/urlsPaths");
const fs = require("fs");


async function createImages(imgs, postId, client) {
    let namesIds = [];
    for (const img of imgs) {
        namesIds.push({alt: img.title, post_id: postId});
    }
    const query = sqlImage.insert(namesIds)
        .returning(sqlImage.id, sqlImage.alt).toQuery();
    const result = await client.query(query);
    if (result instanceof Error) {
        throw result;
    }
    const map0 = imgs.map(e => Object.assign({title:e.title, file:e.file},
        result.rows.find(f => f.alt === e.title)))
    for (const map0Element of map0) {
        const saveName = Path.join(savePath, map0Element.id.toString()
            + "." + Path.extname(map0Element.alt));
        fs.writeFileSync(saveName, map0Element.file, (err) => {
            if (err) throw err;
        } )
    }
}
module.exports = {createImages}