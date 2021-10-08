/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
    /**
     * 0 background
     * 1 wall
     * 2 destination
     * 3 movable
     * 4 player
     * 
     * 
     * 0: This item is an empty tile
     * 1: This item is a wall
     * 2: This item is the place where to drop a crate
     * 3: This item is the crate
     * 4: This item is the player
     * 5: This item is the crate on a place where to drop a crate (3+2)
     * 6: This item is the player on a place where to drop a crate (4+2)
     */

 var level = [ 
     [1,1,1,1,1,1,1],
     [1,1,0,0,0,0,1],
     [1,1,3,0,2,0,1],
     [1,0,0,4,0,0,1],
     [1,0,3,1,2,0,1],
     [1,0,0,1,1,1,1],
     [1,1,1,1,1,1,1]
    ];
var gamelayer;
var cratesArray = [];
var playerPosition;
var playerPos;
var playerSprite;
var startTouch;
var endTouch;
var swipeTolerance = 10;
var destination = [];
var size = cc.winSize;
var arrayOfCrates = [];
var sprite;

var listener  = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
        startTouch = touch.getLocation();
        console.log(startTouch);
        return true;
    },
    onTouchEnded : function(touch,event) {
        endTouch = touch.getLocation();
        console.log(endTouch);
        swipeDirection();
    }
});

var game = cc.Layer.extend({
    init : function() {
        this._super();
       
    },
    ctor:function() {
        this._super();
        //var size = cc.winSize;
        let sprites;
        for(let i=0;i<7;i++)
        {
            cratesArray[i] = [];
            for(let j=0;j<7;j++)
            {
                let num = level[i][j];
                console.log(num);
                let locationX = (size.width/7)*j+64;
                let locationY = (128*7) - (size.height/7)*i-64;
                switch(num)
                {
                    case 0 :
                        sprites = new getBack()
                        break;
                    case 1:
                        sprites = new getWall();
                        break;
                    case 2 :
                        sprites = new getDestination();
                        destination.push({x:locationX,y:locationY});
                        break;
                    case 3 :
                        sprites = new getMovable();
                        this.addChild(sprites,4);
                        cratesArray[i][j] = sprites;
                        sprites.xCord=j;
                        sprites.yCord=i;
                        arrayOfCrates.push(sprites);
                        sprites.setPosition(locationX,locationY);
                        sprites = new getBack();
                        break;
                    case 4 :
                        sprites = new getPlayer();
                        playerSprite = sprites;
                        this.addChild(sprites,4);
                        sprites.setPosition(locationX,locationY);
                        playerPosition = {x:j,y:i};
                        playerPos = {x:locationX,y:locationY};
                        sprites = new getBack();
                        cratesArray[i][j] = null;
                        break;
                    default : cratesArray[i][j] = null;
                }
                this.addChild(sprites,3);
                sprites.setPosition(locationX,locationY);
            }
        }
        var bg = new cc.Sprite(res.bg_jpg);
        this.addChild(bg,5);
        bg.setPosition(896/2,896/2);
        bg.setOpacity(0);
        cc.eventManager.addListener(listener,bg);
        console.log(arrayOfCrates);
        return true;
    },
    onEnter:function() {

    }
});

function swipeDirection() {
    var distX = startTouch.x - endTouch.x;
    var distY = startTouch.y - endTouch.y;
    if(Math.abs(distX)+Math.abs(distY)>swipeTolerance)
    {
        if(Math.abs(distX)>Math.abs(distY))
        {
            if(distX>0)
            {
                move(-1,0);
                console.log('left');
            }
            else
            {
                move(1,0);
                console.log('right');
            }
        }
        else
        {
            if(distY>0)
            {
                move(0,1);
                console.log('down');
            }
            else
            {
                move(0,-1);
                console.log('up');
            }
        }
    }
}

function move(deltaX,deltaY)
{
    nextX = playerPosition.x+deltaY;
    nextY = playerPosition.y+deltaX;
    let nextTileNumber = level[nextX][nextY];
    console.log('nexttile number : ' , nextTileNumber);
    console.log('nextx and nexty ' ,nextX,nextY);
    switch(nextTileNumber)
    {
        case 0:
        case 2:
            console.log(level);
            level[playerPosition.x+deltaY][playerPosition.y+deltaX]+=4;
            level[playerPosition.x][playerPosition.y]-=4;
            console.log(level);
            console.log(playerPosition);
            playerPosition.x = playerPosition.x+deltaY;
            playerPosition.y = playerPosition.y+deltaX;
            console.log(playerPosition);

            let locationX = (size.width/7)*playerPosition.y+64;
            let locationY = (128*7) - (size.height/7)*playerPosition.x-64;
            playerSprite.setPosition(locationX,locationY);

            break;
        case 3:
        case 5:
            let nextTile,xC,yC;
            if(deltaX == -1)
            {
                nextTile =  level[playerPosition.x+deltaY][playerPosition.y+deltaX-1];
                xC = playerPosition.x+deltaY;
                yC = playerPosition.y+deltaX-1;
            }
            else if(deltaX == 1)
            {
                nextTile =  level[playerPosition.x+deltaY][playerPosition.y+deltaX+1];
                xC = playerPosition.x+deltaY;
                yC = playerPosition.y+deltaX+1;
            }
            if(deltaY == -1)
            {
                nextTile =  level[playerPosition.x+deltaY-1][playerPosition.y+deltaX];
                xC = playerPosition.x+deltaY-1;
                yC = playerPosition.y+deltaX;
            }
            else if(deltaY == 1)
            {
                nextTile =  level[playerPosition.x+deltaY+1][playerPosition.y+deltaX];
                xC = playerPosition.x+deltaY+1;
                yC = playerPosition.y+deltaX;
            }
            console.log(nextTile);
            console.log(xC,yC);
            
            switch(nextTile)
            {
                case 0:
                case 2:
                    for(let i = 0;i<arrayOfCrates.length;i++)
                    {
                        if((arrayOfCrates[i].xCord == nextY) && (arrayOfCrates[i].yCord == nextX))
                        {
                            sprite = arrayOfCrates[i];
                        }
                    }
                    level[sprite.yCord][sprite.xCord]-=3
                    sprite.xCord = yC;
                    sprite.yCord = xC;
                    level[sprite.yCord][sprite.xCord]+=3;

                    let locationX = (size.width/7)*sprite.xCord+64;
                    let locationY = (128*7) - (size.height/7)*sprite.yCord-64;
                    sprite.setPosition(locationX,locationY);

                    level[playerPosition.x][playerPosition.y]-=4;
                    playerPosition.x = nextX;
                    playerPosition.y = nextY;
                    level[playerPosition.x][playerPosition.y]+=4;

                    locationX = (size.width/7)*playerPosition.y+64;
                    locationY = (128*7) - (size.height/7)*playerPosition.x-64;
                    playerSprite.setPosition(locationX,locationY);
                    break;
                default:
                    console.log('unable to move crates');
            }
            break
        default :
            console.log('unable to perform move');
    }
    console.log(level);
    console.log(arrayOfCrates);
    checkGameEnd();
}

var getWall = cc.Sprite.extend({
    ctor : function() {
        this._super();
        this.initWithFile(res.Wall_png);
    }
})

var getBack = cc.Sprite.extend({
    ctor : function() {
        this._super();
        this.initWithFile(res.Background_png);
    }
})

var getPlayer = cc.Sprite.extend({
    ctor : function() {
        this._super();
        this.initWithFile(res.player_png);
    }
})

var getMovable = cc.Sprite.extend({
    ctor : function() {
        this._super();
        this.initWithFile(res.Movale_png);
    }
})

var getDestination = cc.Sprite.extend({
    ctor : function() {
        this._super();
        this.initWithFile(res.destination_png);
    }
})

function checkGameEnd() 
{
    if(level[2][4]==5 && level[4][4]==5)
    {
        console.log('Game is over now');
    }
}

var gameScene = cc.Scene.extend({
    onEnter : function () {
        this._super();
        gamelayer = new game();
        gamelayer.init();
        this.addChild(gamelayer);
    }
});