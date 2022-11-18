
const {prePostCreate} = require("./create");
const {Request, Response} = require("../tests/ResponseRequest");
const {preLogin} = require("../student/login");
const {post} = require("./post");

test('create with files pass', async () => {
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
                    title: "test1.png",
                    file: "test1 hjklujukhjuyhjiuyjhjkj"
                },
                {
                    title: "test1_2.png",
                    file: "test1_2 hjklujukhjuyhjiuyjhjkj"
                }
            ]
        };
    res._status = 0;
    await prePostCreate(Object.keys(new post()))(req, res);
    expect(res._status).toBe(200);
    expect(res._msg.msg).toBe("create successful");
});
test('create with files pass', async () => {
    const req = new Request();
    const res = new Response();
    req.body = {
        password: "dv",
        nick_name: "dv"
    };
    res._status = 0;
    await preLogin()(req, res);
    expect(res._status).toBe(200);
    req.body ={
        post: {
            title: "tes2t",
            post_text: "test2",
            flag: true
        },
        imgs: []
    };
    await prePostCreate(Object.keys(new post()))(req, res);
    expect(res._status).toBe(200);
    expect(res._msg.msg).toBe("create successful");
});
test('create with files fail', async () => {
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
            title: "test3",
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
    await prePostCreate(Object.keys(new post()))(req, res);
    expect(res._status).toBe(502);
    expect(res._msg.msg).toBe("Please fill in all values in form");
});