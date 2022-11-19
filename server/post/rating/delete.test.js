
const {preRatingDelete} = require("./delete");
const {Request, Response} = require("../../tests/ResponseRequest");
const {preLogin} = require("../../student/login");

test('delete rating pass', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    req.body ={
        id:  5
    };
    res._status = 0;
    await preRatingDelete()(req, res);
    expect(res._status).toBe(200);
    expect(res._msg.msg).toBe("delete successful");
});
test('delete rating fail', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "mk",
        nick_name: "mk"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    req.body = {
        id: 200
    };
    res._status = 0;
    await preRatingDelete()(req, res);
    expect(res._status).toBe(500);
    expect(res._msg.msg).toBe("");
});