'use strict';

var SockJSMock = module.exports = function SockJSMock() {
    this._args = arguments;
    this.send = function () {
        if (SockJSMock.prototype._onSendCallBack) {
            SockJSMock.prototype._onSendCallBack.apply(this, arguments)
        }
    }.bind(this)
    this.close = function () {
        setTimeout(function () {
            if (this.onclose) { // SockJS API
                this.onclose();
            }
        }.bind(this), 0)
        if (SockJSMock.prototype._onCloseCallBack) {
            SockJSMock.prototype._onCloseCallBack(this);
        }
    }.bind(this);
    setTimeout(function(){ // The connect logic
        if (this._args[0] == "http://non.existent.domain.com/stream") { // Simulate a failing connection
            this.close()
        } else if (this.onopen) { // SockJS API
            this.onopen();
        }
    }.bind(this), 0);
    if (SockJSMock.prototype._onNewCallBack) {
        SockJSMock.prototype._onNewCallBack.apply(this, this._args)
    }
};

SockJSMock.prototype._mockReset = function() {
    SockJSMock.prototype._onNewCallBack = null;
    SockJSMock.prototype._onSendCallBack = null;
    SockJSMock.prototype._onCloseCallBack = null;
};

SockJSMock.prototype._mockOnNew = function (onNewCallBack) {
    SockJSMock.prototype._onNewCallBack = onNewCallBack;
};

SockJSMock.prototype._mockOnClose = function (onCloseCallBack) {
    SockJSMock.prototype._onCloseCallBack = onCloseCallBack;
};

SockJSMock.prototype._mockOnSend = function (onSendCallBack) {
    SockJSMock.prototype._onSendCallBack = onSendCallBack;
};

SockJSMock.prototype._mockReply = function (msg) {
    if (this.onmessage) {
        this.onmessage(msg);
    }
};
