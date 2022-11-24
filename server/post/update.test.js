
const {prePostUpdate} = require("./update");
const {Request, Response} = require("../tests/ResponseRequest");
const {preLogin} = require("../student/login");
const {post} = require("./post");

test('update post with files pass', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    req.body ={
        post: {
            id:2,
            title: "test",
            post_text: "test",
            flag: true
        },
        imgs: [
            {
                title: "test1.png",
                file: "test1 hjklujukhjuyhjiuyjhjkj"
            },
            {
                title: "test1_2.png",
                file: "test1_2 hjklujukhjuyhjiuyjhjkj"
            },
        ],
        deleted: []
    };
    res._status = 0;
    await prePostUpdate(Object.keys(new post()))(req, res);
    expect(res._status).toBe(200);
    expect(res._msg.msg).toBe("update successful");
});
test('update post with files fail', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    req.body ={
        post: {
            title: "test",
            post_text: "test",
            flag: true
        },
        imgs: [
            {
                title: "test3.png",
                file: "test3 hjklujukhjuyhjiuyjhjkj"
            },
            {
                title: "test3_2.png",
                file: "test3_2 hjklujukhjuyhjiuyjhjkj"
            }
        ]
    };
    res._status = 0;
    await prePostUpdate(Object.keys(new post()))(req, res);
    expect(res._status).toBe(502);
    expect(res._msg.msg).toBe("Please fill in all values in form");
});