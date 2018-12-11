

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        var seq = cc.sequence(
            cc.delayTime(2.0),
            cc.removeSelf(true)
        );
        this.node.runAction(seq);
    },

    // update (dt) {},
});
