(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f961eefzrRLpZwUGolZfXXy', 'game', __filename);
// script/game.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        playerNum: 0,
        isChange: false,
        coin_score: 100,
        best_score: 20,
        score: 0,
        playerPrefab: {
            default: [],
            type: cc.Prefab
        },
        bridgePrefab: cc.Prefab,
        colPrefab: cc.Prefab,
        startCol: cc.Node,
        startCol2: cc.Node,
        startFrame: {
            default: [],
            type: cc.SpriteFrame
        },

        coin: cc.Prefab,
        coin_label: cc.Label,
        best_label: cc.Label,
        score_label: cc.Label,
        exp_label: cc.Label,
        gameover_label: cc.Label,
        game_over_win: cc.Node,
        over_string1: cc.Label,
        over_string2: cc.Label,
        gameLayer: cc.Layout,
        shopIcon: cc.Node,
        achieveIcon: cc.Node,
        giftIcon: cc.Node,
        timer_label: cc.Label,
        // shop variables
        shop_content: cc.Node,
        shop_frame: cc.Prefab,
        shop_gold_label: cc.Label,
        shop_close: cc.Node,
        shop: cc.Layout,
        noCoinModal: cc.Prefab,
        // achieve variables
        achieve_gold_label: cc.Label,
        achieve_content: cc.Node,
        achieve_close: cc.Node,
        achieve: cc.Layout,
        high_score: cc.Node,
        total_gaps: cc.Node,
        falls: cc.Node,
        redtotal: cc.Node,
        redhigh: cc.Node,
        // gift 
        gift: cc.Node,
        gift_close: cc.Node,
        gift_btn: cc.Node,
        // achieve modal
        a_modal: cc.Node,
        a_modal_close: cc.Node,
        a_modal_btn: cc.Node,
        addGold: cc.Prefab

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var self = this;
        self.node.on("touchstart", function (event) {
            if (self.genLine === false) return;
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            if (touchLoc.y > 640) {
                self.isChange = false;
                return;
            }
            // console.log("touchstart");            
            self.isChange = true;
            var startP = cc.p(-244, -380);
            var new_bridge = cc.instantiate(self.bridgePrefab);
            new_bridge.setPosition(startP);
            new_bridge.parent = self.gameLayer.node;
            self.bridge = new_bridge;
        });
        self.node.on("touchend", function (event) {
            if (self.genLine === false) return;
            if (self.isChange === false) return;
            self.isChange = false;
            self.bridge.runAction(cc.sequence(cc.rotateBy(0.5, 90), cc.callFunc(self.playerMove, self)));
            self.genLine = false;
        });
        self.shop_close.on("touchend", function (event) {
            self.modalOpen = false;
            self.genLine = true;
            self.shop.node.active = false;
            self.saveData();
        });
        self.shopIcon.on("touchend", function (event) {
            self.modalOpen = true;
            self.genLine = false;
            self.shop.node.active = true;
        });
        self.achieveIcon.on("touchend", function (event) {
            self.modalOpen = true;
            self.genLine = false;
            self.achieve.node.active = true;
        });
        self.achieve_close.on("touchend", function (event) {
            self.modalOpen = false;
            self.genLine = true;
            self.achieve.node.active = false;
            self.saveData();
        });
        self.giftIcon.on("touchend", function (event) {
            self.modalOpen = true;
            if (self.isTimer == true) {
                var timeModal = cc.instantiate(self.noCoinModal);
                timeModal.children[0].getComponent(cc.Label).string = "Next gift not ready yet";
                timeModal.parent = self.node;
                return;
            }
            self.genLine = false;
            var randCoins = Math.floor(Math.random() * 10 + 10);
            self.giftCoins = randCoins;
            self.gift.children[1].children[1].getComponent(cc.Label).string = "x" + randCoins;
            self.gift.active = true;
        });
        self.gift_close.on("touchend", function (event) {
            self.modalOpen = false;
            self.genLine = true;
            self.gift.active = false;
            self.saveData();
        });
        self.gift_btn.on("touchend", function (event) {
            self.modalOpen = true;
            self.coin_score += self.giftCoins;
            self.showData();
            var modal = cc.instantiate(self.noCoinModal);
            modal.children[0].getComponent(cc.Label).string = "+" + self.giftCoins + " coins";
            modal.parent = self.node;
            self.gift.active = false;

            var now = new Date().getTime();
            self.dueTime = now + 4 * 1000 * 60 * 60;
            self.isTimer = true;
            self.timer_label.node.active = true;
            self.giftIcon.children[2].active = true;
            self.giftIcon.children[1].active = false;
            self.giftIcon.children[4].active = false;
            self.genLine = true;
        });
        self.a_modal_close.on("touchend", function (event) {
            self.a_modal.active = false;
        });
        self.a_modal_btn.on("touchend", function (event) {
            self.coin_score += self.achieveGold;
            var gold = cc.instantiate(self.addGold);
            gold.children[1].getComponent(cc.Label).string = "+" + self.achieveGold;
            switch (self.achieveNum) {
                case "0":
                    self.achieveStates[0] += 1;
                    self.showData();
                    self.cal_HScore();
                    break;
                case "1":
                    self.totalGapNum -= self.totalGapMinus;
                    self.achieveStates[1] += 1;
                    self.showData();
                    self.cal_TotalGaps();
                    break;
                case "2":
                    self.totalFallNum -= self.totalFallMinus;
                    self.achieveStates[2] += 1;
                    self.showData();
                    self.cal_TotalFalls();
                    break;
                case "3":
                    self.totalRedHit -= self.totalRedMinus;
                    self.achieveStates[3] += 1;
                    self.showData();
                    self.cal_TotalRed();
                    break;
                case "4":
                    self.achieveStates[4] += 1;
                    self.showData();
                    self.cal_RedCombo();
                    break;
                default:
                    break;
            }

            self.a_modal.active = false;
            gold.parent = self.node;
            gold.runAction(cc.sequence(cc.moveBy(0.3, 0, 200), cc.delayTime(0.5), cc.removeSelf(true)));
        });
        self.shop.node.children[0].on("touchend", function (event) {
            self.modalOpen = false;
            self.shop.node.active = false;
            self.genLine = true;
        });
        self.shop.node.children[1].on("touchend", function (event) {});
        self.achieve.node.children[0].on("touchend", function (event) {
            self.modalOpen = false;
            self.achieve.node.active = false;
            self.genLine = true;
        });
        self.achieve.node.children[1].on("touchend", function (event) {});
        self.gift.children[0].on("touchend", function (event) {
            self.modalOpen = false;
            self.gift.active = false;
            self.genLine = true;
        });
        self.gift.children[1].on("touchend", function (event) {});
        self.a_modal.children[0].on("touchend", function (event) {
            self.a_modal.active = false;
        });
        self.a_modal.children[1].on("touchend", function (event) {});
    },
    start: function start() {
        this.init();
        this.initStorage();
        this.getData();
        this.showData();

        this.shopContent();
        var firstPos = cc.p(-279, -297);
        var new_player = cc.instantiate(this.playerPrefab[this.playerNum]);
        new_player.setPosition(firstPos);
        new_player.parent = this.gameLayer.node;
        this.player = new_player;
        this.animClip = this.clipName[this.playerNum];
        this.getMinPrice();
        this.checkShopState();
        this.cal_HScore();
        this.cal_TotalGaps();
        this.cal_TotalFalls();
        this.cal_TotalRed();
        this.cal_RedCombo();
    },
    init: function init() {

        this.score = 0;
        this.achieveNum = 0;
        this.combo = false;
        this.modalOpen = false;
        /// data from save
        // this.totalGapNum = 100;
        // this.totalFallNum = 300;
        // this.totalRedHit = 300;
        // this.redComboNum = 4;
        // this.skins = [0,1,3,7]; 
        // this.dueTime = 1534777849552;
        // this.achieveStates = [1, 1, 1, 1, 1];
        // this.playerNum = 3;

        this.achieve_array = [0, 0, 0, 0, 0];
        this.genLine = true;
        this.sizeStep = 5;
        this.fColW = 100;
        this.startCol.children[0].active = false;
        this.colStep = 233;
        this.isTimer = true;
        this.firstCol = this.startCol;
        this.secondCol = this.startCol2;
        this.achieve.node.active = false;
        this.clipName = ["stickman_anim", "builder_clip", "boxer_clip", "batter_clip", "pirate_clip", "witch_clip", "magician_clip", "death_clip", "mummy_clip", "skater_clip", "cowboy_clip", "assassin_clip"];
        this.levelNum = ["I", "Ⅱ", "Ⅲ", "IV", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "XI", "XII"];
        this.prices = [0, 20, 100, 200, 200, 200, 300, 300, 400, 400, 600, 800, 1000];
    },
    showData: function showData() {
        this.shop_gold_label.string = this.coin_score.toString();
        this.achieve_gold_label.string = this.coin_score.toString();
        this.coin_label.string = this.coin_score.toString();
        this.best_label.string = "Best: " + this.best_score + " Gaps";
        this.score_label.string = this.score.toString();
    },
    update: function update(dt) {
        if (this.isChange) {
            if (this.bridge.height >= 750) {
                this.sign = -5;
            }
            if (this.bridge.height <= 0) {
                this.sign = 5;
            }
            this.bridge.height += this.sign;
        } else {}
        this.delta += dt;
        if (this.delta < 1) return;
        this.runTimer();

        this.delta = 0;
        // var myWidth = this.bridge.width;
    },
    playerMove: function playerMove() {
        var maxStep = this.colStep + this.secondCol.width;
        if (this.bridge.height < this.colStep) {
            var estTime = this.bridge.height / 500;
            var play = cc.callFunc(this.playAnim, this);
            var stop = cc.callFunc(this.stopAnim, this);
            var bridge = cc.callFunc(this.bridgeFall, this);
            var gameEnd = cc.callFunc(this.endGame, this);
            var move = cc.moveBy(estTime, this.bridge.height, 0);
            var fall = cc.moveBy(0.5, 0, -200);
            var easeMove = new cc.EaseIn(move, 2.0);
            this.player.runAction(cc.sequence(play, easeMove, stop, bridge, fall, cc.removeSelf(true), gameEnd));
        } else if (this.bridge.height > maxStep) {
            var estTime = this.bridge.height / 500;
            var play = cc.callFunc(this.playAnim, this);
            var stop = cc.callFunc(this.stopAnim, this);
            var bridge = cc.callFunc(this.bridgeFall, this);
            var gameEnd = cc.callFunc(this.endGame, this);
            var move = cc.moveBy(estTime, this.bridge.height + 40, 0);
            var fall = cc.moveBy(0.5, 0, -200);
            var easeMove = new cc.EaseIn(move, 2.0);
            this.player.runAction(cc.sequence(play, easeMove, stop, bridge, fall, cc.removeSelf(true), gameEnd));
        } else {
            this.createCol();
            this.score += 1;
            this.totalGapNum += 1;
            this.showData();
            this.combo = false;
            if (Math.abs(this.bridge.height - this.colStep - this.secondCol.width / 2) <= 7) {
                if (this.combo == true) this.redComboNum += 1;
                var coin = cc.instantiate(this.coin);
                coin.setPositionX(this.secondCol.x);
                coin.parent = this.node;
                coin.runAction(cc.sequence(cc.moveBy(0.5, 0, 200), cc.delayTime(0.5), cc.removeSelf(true)));
                this.coin_score += 1;
                this.showData();
                this.checkShopState();
                this.combo = true;
            };
            var estTime = maxStep / 500;
            var play = cc.callFunc(this.playAnim, this);
            var stop = cc.callFunc(this.stopAnim, this);
            var moveAll = cc.callFunc(this.moveCols, this);
            var move = cc.moveBy(estTime, maxStep - 10, 0);
            var easeMove = new cc.EaseIn(move, 2.0);
            this.player.runAction(cc.sequence(play, easeMove, stop, cc.delayTime(0.5), moveAll));
            this.cal_TotalGaps();
        }
    },
    moveCols: function moveCols() {
        var maxStep = this.colStep + this.secondCol.width - 10;
        this.secondCol.children[0].active = false;
        this.firstCol.runAction(cc.sequence(cc.moveBy(0.5, -1 * maxStep, 0),
        // cc.removeSelf(true),
        cc.callFunc(this.changeParam, this)));
        this.bridge.runAction(cc.moveBy(0.5, -1 * maxStep, 0));
        this.secondCol.runAction(cc.moveBy(0.5, -1 * maxStep, 0));
        this.player.runAction(cc.moveBy(0.5, -1 * maxStep, 0));
        this.newCol.runAction(cc.moveTo(0.5, this.sPos, -580));
    },
    changeParam: function changeParam() {
        if (this.modalOpen == false) this.genLine = true;
        this.colStep = this.newcolStep;
        this.firstCol = this.secondCol;
        this.secondCol = this.newCol;
    },
    createCol: function createCol() {
        this.fColW = this.secondCol.width / 2;
        var new_Col = cc.instantiate(this.colPrefab);
        var firstPos = cc.p(450, -580);
        var ranW = Math.random() * 120 + 40;
        new_Col.width = ranW;
        var ranX = Math.random() * (480 - ranW) - 100 + ranW / 2;
        this.newcolStep = ranX + 244 - ranW / 2;
        this.sPos = ranX;

        new_Col.setPosition(firstPos);
        new_Col.parent = this.gameLayer.node;
        this.newCol = new_Col;
    },
    playAnim: function playAnim() {
        var anim = this.player.getComponent(cc.Animation);
        anim.play(this.animClip);
    },
    stopAnim: function stopAnim() {
        var anim = this.player.getComponent(cc.Animation);
        anim.stop(this.animClip);
        var playersprite = this.player.getComponent(cc.Sprite);
        playersprite.spriteFrame = this.startFrame[this.playerNum];
    },
    bridgeFall: function bridgeFall() {
        this.bridge.runAction(cc.rotateBy(0.5, 90));
    },
    getData: function getData() {
        if (cc.sys.localStorage.getItem("userData") != null && cc.sys.localStorage.getItem("userData") != undefined) {
            var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
            this.best_score = userData.best;
            this.skins = userData.skins;
            this.coin_score = userData.gold;
            this.playerNum = userData.player;
            this.dueTime = userData.time;
            this.achieveStates = userData.achieve;
            this.totalGapNum = userData.totalgap;
            this.totalFallNum = userData.totalfall;
            this.totalRedHit = userData.totalRed;
            this.redComboNum = userData.redcombo;
        } else {
            this.best_score = 0;
            this.skins = [0];
            this.coin_score = 0;
            this.playerNum = 0;
            this.dueTime = new Date().getTime() + 4 * 1000 * 60 * 60;
            this.achieveStates = [1, 1, 1, 1, 1];
            this.totalGapNum = 0;
            this.totalFallNum = 0;
            this.totalRedHit = 0;
            this.redComboNum = 0;
        }
    },
    saveData: function saveData() {
        if (this.score > this.best_score) this.best_score = this.score;
        var userData = {
            name: "user",
            gaps: this.score,
            best: this.best_score,
            gold: this.coin_score,
            skins: this.skins,
            player: this.playerNum,
            time: this.dueTime,
            achieve: this.achieveStates,
            totalgap: this.totalGapNum,
            totalfall: this.totalFallNum,
            totalRed: this.totalRedHit,
            redcombo: this.redComboNum
        };
        cc.sys.localStorage.setItem("userData", JSON.stringify(userData));
        cc.sys.localStorage.setItem("isData", 1);
    },
    initStorage: function initStorage() {
        var isD = cc.sys.localStorage.getItem("isData");
        if (isD == null || isD == 0 || isD == undefined) {
            console.log("local data init");
            var userData = {
                name: "user",
                gaps: 0,
                best: 0,
                gold: 0,
                skins: [0],
                player: 0,
                time: new Date().getTime() + 4 * 1000 * 60 * 60,
                achieve: [1, 1, 1, 1, 1],
                totalgap: 0,
                totalfall: 0,
                totalRed: 0,
                redcombo: 0
            };
            cc.sys.localStorage.setItem("userData", JSON.stringify(userData));
            cc.sys.localStorage.setItem("isData", 1);
        }
    },
    endGame: function endGame() {
        this.totalFallNum += 1;
        this.best_label.node.active = false;
        this.score_label.node.active = false;
        this.exp_label.node.active = false;
        this.gameover_label.node.active = true;
        this.game_over_win.active = true;
        if (this.score <= this.best_score) {
            var diff = this.best_score - this.score;
            this.over_string1.string = diff + " gaps left to beat high score:";
            this.over_string2.string = this.best_score + " gaps";
        } else {
            this.over_string1.string = " Congatulations!";
            this.over_string2.string = " Your best score is : " + this.score;
            this.best_score = this.score;
        }
        this.saveData();
        this.node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(this.toMain, this)));
    },
    toMain: function toMain() {
        // wx.postMessage({
        //     msgType: 1,
        //     score:this.score,
        // })
        cc.director.loadScene("main");
    },
    shopContent: function shopContent() {

        for (var i = 0; i < 6; i++) {

            var frame1 = cc.instantiate(this.shop_frame);
            var index = i * 2;
            frame1.setPosition(cc.p(-118, -144 - 292 * i));
            frame1.parent = this.shop_content;
            frame1.children[1].getComponent(cc.Sprite).spriteFrame = this.startFrame[index];
            var NameStr = this.clipName[index].split("_");
            frame1.children[0].getComponent(cc.Label).string = this.capitalizeFirstLetter(NameStr[0]);
            frame1.children[4].children[1].children[0].getComponent(cc.Label).string = this.prices[index].toString();
            frame1.getComponent("shop").id = index;

            if (this.inArray(index, this.skins)) {

                frame1.children[1].active = true;
                frame1.children[5].active = false;
                frame1.children[4].children[1].active = false;
                frame1.children[4].children[0].active = true;
            }
            if (this.playerNum == index) {
                this.cur_frame = frame1;
                frame1.children[4].active = false;
                frame1.children[3].active = true;
            }

            // right frame
            var frame2 = cc.instantiate(this.shop_frame);
            var index = i * 2 + 1;
            frame2.setPosition(cc.p(118, -144 - 292 * i));
            frame2.parent = this.shop_content;
            frame2.children[1].getComponent(cc.Sprite).spriteFrame = this.startFrame[index];
            var NameStr = this.clipName[index].split("_");
            frame2.children[0].getComponent(cc.Label).string = this.capitalizeFirstLetter(NameStr[0]);
            frame2.children[4].children[1].children[0].getComponent(cc.Label).string = this.prices[index].toString();
            frame2.getComponent("shop").id = index;
            if (this.inArray(index, this.skins)) {
                frame2.children[1].active = true;
                frame2.children[5].active = false;
                frame2.children[4].children[1].active = false;
                frame2.children[4].children[0].active = true;
            }
            if (this.playerNum == index) {
                this.cur_frame = frame2;
                frame2.children[4].active = false;
                frame2.children[3].active = true;
            }
        }
    },
    shopSkin: function shopSkin(frame, id) {
        if (this.inArray(id, this.skins)) {
            this.playerNum = id;
            this.cur_frame.children[4].active = true;
            this.cur_frame.children[3].active = false;
            this.cur_frame = frame;
            frame.children[4].active = false;
            frame.children[3].active = true;
            var cur_pos = this.player.getPosition();
            this.player.destroy();
            var new_player = cc.instantiate(this.playerPrefab[id]);
            new_player.setPosition(cur_pos);
            new_player.parent = this.gameLayer.node;
            this.player = new_player;
            this.animClip = this.clipName[this.playerNum];
        } else {
            if (this.prices[id] <= this.coin_score) {
                this.coin_score = this.coin_score - this.prices[id];
                this.showData();
                frame.children[1].active = true;
                frame.children[5].active = false;
                frame.children[4].children[1].active = false;
                frame.children[4].children[0].active = true;
                this.cur_frame.children[4].active = true;
                this.cur_frame.children[3].active = false;
                this.cur_frame = frame;
                frame.children[4].active = false;
                frame.children[3].active = true;
                this.skins.push(id);
                var modal = cc.instantiate(this.noCoinModal);
                modal.children[0].getComponent("cc.Label").fontSize = 30;
                modal.children[0].getComponent("cc.Label").string = "Successfully purchased!";
                modal.parent = this.shop.node;
                this.playerNum = id;
                var cur_pos = this.player.getPosition();
                this.player.destroy();
                var new_player = cc.instantiate(this.playerPrefab[id]);
                new_player.setPosition(cur_pos);
                new_player.parent = this.gameLayer.node;
                this.player = new_player;
                this.animClip = this.clipName[this.playerNum];
                this.checkShopState();
            } else {
                var modal = cc.instantiate(this.noCoinModal);
                modal.parent = this.shop.node;
            }
        }
    },
    checkShopState: function checkShopState() {
        if (this.coin_score > this.minPrice) {
            this.shopIcon.children[1].active = true;
        } else {
            this.shopIcon.children[1].active = false;
        }
    },
    cal_HScore: function cal_HScore() {
        this.high_score.children[8].getComponent(cc.Label).string = this.best_score;
        var level = this.achieveStates[0];

        var firstNum = 5;
        for (var i = 0; i < level - 1; i++) {
            if (i < 3) {
                var newNum = firstNum * 2;
            } else {
                var newNum = firstNum + 20;
            }
            firstNum = newNum;
        }
        var money = (level - 1) * 10;
        if (level == 1) money = 5;
        this.high_score.children[9].getComponent(cc.Label).string = "/" + firstNum;
        this.achieveGold = money;
        this.high_score.children[6].getComponent(cc.Label).string = money;
        this.high_score.children[0].getComponent(cc.Label).string = this.levelNum[this.achieveStates[0] - 1];
        if (this.best_score >= firstNum) {
            this.high_score.children[3].active = true;
            var x = 0;
            this.high_score.children[11].children[0].setPositionX(x);
            this.achieve_array[0] = 1;
        } else {
            this.high_score.children[3].active = false;
            var x = -240 + this.best_score / firstNum * 240;
            this.high_score.children[11].children[0].setPositionX(x);
            this.achieve_array[0] = 0;
        }
        this.checkAchieves();
    },
    cal_TotalRed: function cal_TotalRed() {
        this.redtotal.children[8].getComponent(cc.Label).string = this.totalRedHit;
        var level = this.achieveStates[3];

        var firstNum = 5;
        for (var i = 0; i < level - 1; i++) {
            if (i < 4) {
                var newNum = firstNum * 2;
                if (newNum == 10) newNum = 15;
            } else {
                var newNum = firstNum + 120;
            }
            firstNum = newNum;
        }
        var money = level * 5;
        this.totalRedMinus = firstNum;
        this.redtotal.children[9].getComponent(cc.Label).string = "/" + firstNum;
        this.achieveGold = money;
        this.redtotal.children[6].getComponent(cc.Label).string = money;
        this.redtotal.children[0].getComponent(cc.Label).string = this.levelNum[this.achieveStates[3] - 1];
        if (this.totalRedHit >= firstNum) {
            this.redtotal.children[3].active = true;
            var x = 0;
            this.redtotal.children[11].children[0].setPositionX(x);
            this.achieve_array[3] = 1;
        } else {
            this.redtotal.children[3].active = false;
            var x = -240 + this.totalRedHit / firstNum * 240;
            this.redtotal.children[11].children[0].setPositionX(x);
            this.achieve_array[3] = 0;
        }
        this.checkAchieves();
    },
    cal_RedCombo: function cal_RedCombo() {
        this.redhigh.children[8].getComponent(cc.Label).string = this.redComboNum;
        var level = this.achieveStates[4];

        var firstNum = 1;
        for (var i = 0; i < level - 1; i++) {
            firstNum = firstNum + 1;
        }
        var money = (level - 1) * 10;
        if (level == 1) money = 5;
        this.redhigh.children[9].getComponent(cc.Label).string = "/" + firstNum;
        this.achieveGold = money;
        this.redhigh.children[6].getComponent(cc.Label).string = money;
        this.redhigh.children[0].getComponent(cc.Label).string = this.levelNum[this.achieveStates[4] - 1];
        if (this.redComboNum >= firstNum) {
            this.redhigh.children[3].active = true;
            var x = 0;
            this.redhigh.children[11].children[0].setPositionX(x);
            this.achieve_array[4] = 1;
        } else {
            this.redhigh.children[3].active = false;
            var x = -240 + this.redComboNum / firstNum * 240;
            this.redhigh.children[11].children[0].setPositionX(x);
            this.achieve_array[4] = 0;
        }
        this.checkAchieves();
    },
    cal_TotalGaps: function cal_TotalGaps() {
        this.total_gaps.children[8].getComponent(cc.Label).string = this.totalGapNum;
        var level = this.achieveStates[1];

        var firstNum = 25;
        for (var i = 0; i < level - 1; i++) {
            if (i < 4) {
                var newNum = firstNum * 2;
            } else {
                var newNum = firstNum + 300;
            }
            firstNum = newNum;
        }
        var money = level * 5;
        this.totalGapMinus = firstNum;
        this.total_gaps.children[9].getComponent(cc.Label).string = "/" + firstNum;
        this.achieveGold = money;
        this.total_gaps.children[6].getComponent(cc.Label).string = money;
        this.total_gaps.children[0].getComponent(cc.Label).string = this.levelNum[this.achieveStates[1] - 1];
        if (this.totalGapNum >= firstNum) {
            this.total_gaps.children[3].active = true;
            var x = 0;
            this.total_gaps.children[11].children[0].setPositionX(x);
            this.achieve_array[1] = 1;
        } else {
            this.total_gaps.children[3].active = false;
            var x = -240 + this.totalGapNum / firstNum * 240;
            this.total_gaps.children[11].children[0].setPositionX(x);
            this.achieve_array[1] = 0;
        }
        this.checkAchieves();
    },
    cal_TotalFalls: function cal_TotalFalls() {
        this.falls.children[8].getComponent(cc.Label).string = this.totalFallNum;
        var level = this.achieveStates[2];

        var firstNum = 5;
        for (var i = 0; i < level - 1; i++) {
            if (i < 3) {
                var newNum = firstNum * 2;
            } else {
                var newNum = firstNum + 100;
                if (i == 3) newNum = 100;
            }
            firstNum = newNum;
        }
        var money = level * 5;
        this.totalFallMinus = firstNum;
        this.falls.children[9].getComponent(cc.Label).string = "/" + firstNum;
        this.achieveGold = money;
        this.falls.children[6].getComponent(cc.Label).string = money;
        this.falls.children[0].getComponent(cc.Label).string = this.levelNum[this.achieveStates[2] - 1];
        if (this.totalFallNum >= firstNum) {
            this.falls.children[3].active = true;
            var x = 0;
            this.falls.children[11].children[0].setPositionX(x);
            this.achieve_array[2] = 1;
        } else {
            this.falls.children[3].active = false;
            var x = -240 + this.totalFallNum / firstNum * 240;
            this.falls.children[11].children[0].setPositionX(x);
            this.achieve_array[2] = 0;
        }
        this.checkAchieves();
    },
    checkAchieves: function checkAchieves() {
        this.numAchieve = 0;
        var sum = 0;
        for (var i = 0; i < 5; i++) {
            sum = sum + this.achieve_array[i];
        }

        if (sum > 0) {
            this.achieveIcon.children[1].active = true;
        } else {
            this.achieveIcon.children[1].active = false;
        }
    },
    achiveModal: function achiveModal(event, data) {
        this.achieveNum = data;
        this.genLine = false;
        this.a_modal.active = true;
        this.a_modal.children[1].children[1].getComponent(cc.Label).string = "x" + this.achieveGold;
    },
    getMinPrice: function getMinPrice() {
        for (var i = 0; i < 12; i++) {
            if (this.inArray(i, this.skins)) continue;
            this.minPrice = this.prices[i];
            break;
        }
    },
    capitalizeFirstLetter: function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    inArray: function inArray(needle, haystack) {
        var count = haystack.length;
        for (var i = 0; i < count; i++) {
            if (haystack[i] === needle) {
                return true;
            }
        }
        return false;
    },
    runTimer: function runTimer() {
        if (this.isTimer === false) return;
        var now = new Date().getTime();
        var distance = this.dueTime - now;
        var fourHours = 4 * 1000 * 60 * 60;
        if (distance < 0) {
            this.isTimer = false;
            this.timer_label.node.active = false;
            this.giftIcon.children[2].active = false;
            this.giftIcon.children[1].active = true;
            this.giftIcon.children[4].active = true;
        }
        var hours = Math.floor(distance / (1000 * 60 * 60));
        var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(distance % (1000 * 60) / 1000);
        this.timer_label.string = this.pad(hours) + ":" + this.pad(minutes) + ":" + this.pad(seconds);
    },
    pad: function pad(d) {
        return d < 10 ? '0' + d.toString() : d.toString();
    }
});

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
        //# sourceMappingURL=game.js.map
        