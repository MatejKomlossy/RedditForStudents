const {sqlImage} = require("./sqlImage");

async function deleteImages(deleted, postId, client) {
    try {
        const query = sqlImage.delete()
            .where(sqlImage.id.equals(deleted))
            .where(sqlImage.post_id.equals(postId))
            .returning(sqlImage.id).toQuery();
        await client.query(query);
    } catch (e) {
        res.status(500).send(e.toString());
    }
}

module.exports = {deleteImages}