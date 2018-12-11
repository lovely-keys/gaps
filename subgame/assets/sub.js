// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        name_label: cc.Label,
        score: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        wx.onMessage(data => {
            if(data.msgType == 1){
                self.score.string = data.score + " Gaps";
            } 
        }); 

        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: function(res){
                if(res.data){ 
                    if(res.data[0].nickName != undefined && res.data[0].avatarUrl != undefined){ 
                        self.myNickname = res.data[0].nickName;
                        self.name_label.string = res.data[0].nickName; 
                        try {
                            let image = wx.createImage();
                            image.onload = () => {
                                try {
                                    let texture = new cc.Texture2D();
                                    texture.initWithElement(image);
                                    texture.handleLoadedTexture();
                                    self.avatar.spriteFrame = new cc.SpriteFrame(texture);
                                } catch (e) {
                                    cc.log(e);
                                    self.avatar.node.active = false;
                                }
                            };
                            image.src = res.data[0].avatarUrl;
                        }catch (e) {
                            cc.log(e);
                            self.avatar.node.active = false;
                        }
                    }else{ 
                    } 
                }
            },
            fail: function(res){
                console.log("I'm failed!");
                
            }
        })


    },

    start () {

    },

    // update (dt) {},
});
