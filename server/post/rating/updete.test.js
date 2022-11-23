
const {preRatingUpdate} = require("./update");
const {rating} = require("./rating");
const {Request, Response} = require("../../tests/ResponseRequest");
const {preLogin} = require("../../student/login");

test('update rating pass', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    req.body ={
        category:0,
        post_id: 3
    };
    res._status = 0;
    await preRatingUpdate(Object.keys(new rating()))(req, res);
    expect(res._status).toBe(200);
    expect(res._msg.msg).toBe("update successful");
});
test('update rating fail', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    req.body ={
        category:1
    };
    res._status = 0;
    await preRatingUpdate(Object.keys(new rating()))(req, res);
    expect(res._status).toBe(502);
    expect(res._msg.msg).toBe("Error: error: duplicate key value violates unique constraint \"ratings_post_id_student_id_key\"");
});