/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private container:egret.DisplayObjectContainer;

    private resultText:egret.TextField;


    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    /**
    * 资源组加载出错
     *  The resource group loading failed
    */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textContainer: egret.Sprite;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {

        this.container = new egret.DisplayObjectContainer();
        this.addChild(this.container);

        this.resultText = new egret.TextField();
        this.resultText.multiline = true;
        this.resultText.width = 300;
        this.resultText.height = 400;
        this.addChild(this.resultText);
        this.resultText.x = 100;
        this.resultText.y = 400;


        this.createButton("检查登录类型",this.testLoginSupport,this);
        this.createButton("登录",this.testLogin,this);
        this.createButton("支付",this.testPay,this);
        this.createButton("分享",this.testShare,this);



    }

    private createButton(label:string,callback:Function,thisObject:any):egret.DisplayObject{
        var loginButton:egret.TextField = new egret.TextField();
        loginButton.touchEnabled = true;
        loginButton.text = label;
        loginButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN,callback,thisObject);
        this.container.addChild(loginButton);
        var index:number = this.container.numChildren;
        loginButton.x = 100;
        loginButton.y = index * 50;
        return loginButton;
    }

    private print(text:any){
        this.resultText.text = JSON.stringify(text);
    }




    private testLogin():void{

        var self = this;
        var loginInfo:nest.user.LoginInfo = {};
        nest.user.login(loginInfo, function(data){

            self.print(data);
        })
    }

    private testLoginSupport():void{
        var self = this;
        nest.user.isSupport(function(data){

            self.print(data);
        })
    }

    private testPay():void{
        var self = this;
        var payInfo:nest.iap.PayInfo = {
            goodsId:"19001"
        };

        nest.iap.pay(payInfo,function(data){
            self.print(data);
        })
    }

    private testShare():void{
        var self = this;
        var data:nest.share.ShareInfo = {

            title:"title",
            description:"desc",
            img_title:"title",
            img_url:"http://a.hiphotos.baidu.com/image/pic/item/2fdda3cc7cd98d1021036131233fb80e7aec90de.jpg",
            url:"http://www.baidu.com"


        };
        nest.share.share(data, function(data){
            self.print(data);
        })
    }
}


