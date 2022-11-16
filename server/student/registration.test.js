
const {preRegistration} = require("./registration");
const {preLogin} = require("./login");
const {student} = require("./student");
const {Request, Response} = require("../tests/ResponseRequest");

test('registration pass', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        nick_name: "temp",
        isic_number: "S421000177007F",
        password: "temp"
    };
    await preRegistration((Object.keys(new student())))(req, res);
    expect(res._status).toBe(200);
    req.body = {
        nick_name: "temp",
        password: "temp"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    expect(res._msg.msg).toBe("registration successful");
    expect(res._json.isic_number).toBe("S421000177007F");
    expect(res._json.nick_name).toBe( "temp");
});
test('registration fail', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        nick_name: "temp",
        isic_number: "S4",
        password: "temp"
    };
    await preRegistration((Object.keys(new student())))(req, res);
    expect(res._status).toBe(500);
});
test('registration duplicate', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        nick_name: "temp",
        isic_number: "S421000177007F",
        password: "temp"
    };
    await preRegistration((Object.keys(new student())))(req, res);
    expect(res._status).toBe(500);
    expect(res._msg.msg).toBe("student already registered");
});