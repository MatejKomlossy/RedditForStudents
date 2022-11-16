
const {preLogout} = require("./logout");
const {preLogin} = require("./login");
const {Request, Response} = require("../tests/ResponseRequest");

test('logout pass', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    res._status = false;
    await  preLogout()(req, res);
    expect(res._status).toBe(200);
    expect(res._msg.msg).toBe("Successfully logged out");
    expect(req.session).toBe(null);
});
test('logout fail', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    res._status = false;
    delete req.session.loggedin;
    await  preLogout()(req, res);
    expect(res._status).toBe(500);
    expect(res._msg.msg).toBe("not need logged out");
});