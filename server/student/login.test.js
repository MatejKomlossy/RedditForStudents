
const {preLogin} = require("./login");
const {Request, Response} = require("../tests/ResponseRequest");
const {hour} = require("../contants/date");

test('login pass', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    expect(req.session.nick_name).toBe("dv");
    expect(req.session.loggedin).toBe(true);
    const x = Math.floor(Math.abs(new Date(Date.now()+hour)-req.session.expire)/hour);
    expect((x)).toBe(0);
    expect(res._msg).toBe(null);
    expect(res._json.isic_number).toBe("S4210001770444445414141414107F");
    expect(res._json.nick_name).toBe( "dv");

});
test('login fail', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv0",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(500);
    expect(res._msg.msg).toBe("wrong username or password");

});