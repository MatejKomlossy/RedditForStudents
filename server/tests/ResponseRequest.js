
class Response {
    _status = null;
    _msg = null;
    _json = null;
    status(status){
        this._status = status;
        return this;
    }
    send(msg){
        this._msg = msg;
    }
    json(json){
        this._json = json;
    }
}

class Session {
    loggedin = null;
    nick_name = null;
    expire = null;
    superClass = null;
    constructor(superclass) {
        this.superClass = superclass;
    }
    destroy(){
        this.superClass.destroy();
        this.superClass = null;
    }
}
class Request {
    body = null;
    session;
    constructor() {
        this.session = new Session(this);
    }
    destroy(){
        this.session = null;
    }
}

module.exports = {Request, Response}