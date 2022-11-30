
const {preImageGetOneID} = require("./getByID.js");
const {Request, Response} = require("../tests/ResponseRequest");
const {preLogin} = require("../student/login");

test('get post', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    res._status = 0;
    req.body ={
        id: 1,
        mextname:"png"
    };
    await preImageGetOneID()(req, res);
    expect(res._status).toBe(200);
    expect(res._json.img.toString()).toBe("test1 hjklujukhjuyhjiuyjhjkj");
});