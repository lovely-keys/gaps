"use strict";
cc._RF.push(module, '6671cSrrS1A6ILowVX/81pL', 'noCoin');
// script/noCoin.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {
        var seq = cc.sequence(cc.delayTime(2.0), cc.removeSelf(true));
        this.node.runAction(seq);
    }
}

// update (dt) {},
);

cc._RF.pop();