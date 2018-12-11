
cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Node,
        id: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        self.button.on("touchend", function(event) {
            cc.find("Canvas").getComponent("game").shopSkin(self.node, self.id);
            
        })
    },

    start () {

    },

    // update (dt) {},
});
