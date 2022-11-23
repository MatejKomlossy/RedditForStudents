
const {prePostGetAll} = require("./getAll");
const {Request, Response} = require("../tests/ResponseRequest");
const {preLogin} = require("../student/login");

test('get all posts', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    res._status = 0;
    await prePostGetAll()(req, res);
    expect(res._status).toBe(200);
    expect(res._json.post.length.toString()).toBe("3");
});