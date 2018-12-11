"use strict";
cc._RF.push(module, 'd97995BU/BH2qJ5kxikCNXK', 'main');
// script/main.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        play_btn: cc.Node,
        share_btn: cc.Node,
        display: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var self = this;
        self.play_btn.on("touchend", function (event) {
            cc.director.loadScene("game");
        });
        self.share_btn.on("touchend", function () {
            console.log("click share button");
            // actively pull up the sharing interface 
            var canvas = cc.game.canvas;
            var width = cc.winSize.width;
            // var height  = cc.winSize.height;
            canvas.toTempFilePath({
                x: 0,
                y: 0,
                width: width,
                height: 400,
                destWidth: 500,
                destHeight: 500,
                success: function success(res) {
                    console.log(res);
                    wx.shareAppMessage({
                        title: "Let's play Crossing Gaps!",
                        imageUrl: res.tempFilePath
                    });
                }
            });
        });
    },
    start: function start() {
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({ withShareTicket: true });
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
        }
    },
    _updateSubDomainCanvas: function _updateSubDomainCanvas() {

        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.display.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update: function update(dt) {
        this._updateSubDomainCanvas(dt);
    }
});

cc._RF.pop();