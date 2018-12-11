(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/shop.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '89ca7b16zJKV7L7QmeMhjFj', 'shop', __filename);
// script/shop.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Node,
        id: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var self = this;
        self.button.on("touchend", function (event) {
            cc.find("Canvas").getComponent("game").shopSkin(self.node, self.id);
        });
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=shop.js.map
        