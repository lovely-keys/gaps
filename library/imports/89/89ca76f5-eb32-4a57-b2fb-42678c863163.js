"use strict";
cc._RF.push(module, '89ca7b16zJKV7L7QmeMhjFj', 'shop');
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