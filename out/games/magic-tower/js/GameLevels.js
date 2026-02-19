/**
 * 游戏主逻辑类
 * 对应Python版本的GameLevels类
 * 注意：由于文件过大，部分对话和商店功能在后续补充
 */
class GameLevels {
    constructor(cfg, resourceLoader) {
        this.cfg = cfg;
        this.resourceLoader = resourceLoader;
        
        // 游戏地图元素图片
        this.mapElementImages = resourceLoader.images.mapelements;
        
        // 背景图片
        this.backgroundImages = {
            'gamebg': resourceLoader.images.gamebg,
            'battlebg': resourceLoader.images.battlebg,
            'blankbg': resourceLoader.images.blankbg
        };
        
        // 地图解析器字典
        this.mapParsersDict = {};
        this.maxMapLevelPointer = 0;
        this.mapLevelPointer = 0;
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        
        // 当前对话状态
        this.conversationPointer = 0;
        this.currentConversations = [];
        this.conversationCallback = null;
        
        // Canvas和上下文
        this.canvas = null;
        this.ctx = null;
        
        // 英雄（稍后初始化）
        this.hero = null;
        this.mapParser = null;
        
        // 游戏开始时间
        this.gameStartTime = Date.now();
    }

    /**
     * 初始化游戏
     */
    async initialize(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 加载第0层地图
        await this.loadMap();
        
        // 创建英雄
        this.hero = new Hero(
            this.resourceLoader.images.hero,
            this.cfg.BLOCKSIZE,
            this.mapParser.getHeroPosition(),
            [325, 55],
            this.cfg,
            this.resourceLoader,
            this.backgroundImages
        );
    }

    /**
     * 加载地图
     */
    async loadMap() {
        if (this.mapLevelPointer in this.mapParsersDict) {
            this.mapParser = this.mapParsersDict[this.mapLevelPointer];
        } else {
            this.mapParser = new MapParser(
                this.cfg.BLOCKSIZE,
                this.cfg.MAPPATHS[this.mapLevelPointer],
                this.mapElementImages,
                [325, 55]
            );
            await this.mapParser.load();
            this.mapParsersDict[this.mapLevelPointer] = this.mapParser;
        }
    }

    /**
     * 游戏主循环
     */
    async run() {
        this.isRunning = true;
        const frameInterval = 1000 / this.cfg.FPS;
        let lastFrameTime = Date.now();
        
        // 键盘状态
        const keyPressed = {};
        
        // 键盘事件监听
        const keyDownHandler = (e) => {
            keyPressed[e.key.toLowerCase()] = true;
            
            // 对话中按空格继续
            if (this.currentConversations.length > 0 && e.key === ' ') {
                e.preventDefault();
                this.conversationPointer++;
                if (this.conversationPointer >= this.currentConversations.length) {
                    this.currentConversations = [];
                    this.conversationPointer = 0;
                    if (this.conversationCallback) {
                        this.conversationCallback();
                        this.conversationCallback = null;
                    }
                }
            }
        };
        
        const keyUpHandler = (e) => {
            keyPressed[e.key.toLowerCase()] = false;
        };
        
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        
        // 游戏循环
        const gameLoop = async () => {
            if (!this.isRunning) {
                window.removeEventListener('keydown', keyDownHandler);
                window.removeEventListener('keyup', keyUpHandler);
                return;
            }
            
            const currentTime = Date.now();
            const deltaTime = currentTime - lastFrameTime;
            
            if (deltaTime >= frameInterval) {
                lastFrameTime = currentTime;
                
                // 清空画布
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.cfg.SCREENSIZE[0], this.cfg.SCREENSIZE[1]);
                
                // 绘制背景
                if (this.backgroundImages.gamebg) {
                    this.ctx.drawImage(
                        this.backgroundImages.gamebg,
                        0, 0,
                        this.cfg.SCREENSIZE[0],
                        this.cfg.SCREENSIZE[1]
                    );
                }
                
                // 处理按键（如果不在对话中）
                if (this.currentConversations.length === 0) {
                    await this.handleInput(keyPressed);
                }
                
                // 绘制地图（传入英雄用于显示怪物损失值）
                this.mapParser.draw(this.ctx, this.hero);
                
                // 绘制左侧面板
                this.drawPanel();
                
                // 绘制英雄
                this.hero.draw(this.ctx);
                
                // 显示获得物品提示
                this.hero.showInfo(this.ctx);
                
                // 绘制UI层（最上层）
                // 绘制对话框
                if (this.currentConversations.length > 0) {
                    this.drawConversation();
                }
                
                // 绘制商店
                if (this.shopState && this.shopState.active) {
                    this.drawShop(this.ctx);
                }
                
                // 绘制楼层跳转
                if (this.jumpLevelState && this.jumpLevelState.active) {
                    this.drawJumpLevel(this.ctx);
                }
                
                // 绘制怪物预测
                if (this.forecastState && this.forecastState.active) {
                    this.drawForecast(this.ctx);
                }
            }
            
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }

    /**
     * 处理输入
     */
    async handleInput(keyPressed) {
        // 如果在商店中，优先处理商店输入
        if (this.shopState && this.shopState.active) {
            if (this.handleShopInput(keyPressed)) {
                Object.keys(keyPressed).forEach(key => {
                    keyPressed[key] = false;
                });
                return;
            }
        }
        
        // 如果在楼层跳转中，直接返回（由keyHandler处理）
        if (this.jumpLevelState && this.jumpLevelState.active) {
            return;
        }
        
        // 如果在怪物预测中，直接返回（由keyHandler处理）
        if (this.forecastState && this.forecastState.active) {
            return;
        }
        
        let moveEvents = [];
        let moveVector = [0, 0];
        
        if (keyPressed['w'] || keyPressed['arrowup']) {
            moveEvents = await this.hero.move('up', this.mapParser, this.ctx);
            moveVector = [0, -1];
        } else if (keyPressed['s'] || keyPressed['arrowdown']) {
            moveEvents = await this.hero.move('down', this.mapParser, this.ctx);
            moveVector = [0, 1];
        } else if (keyPressed['a'] || keyPressed['arrowleft']) {
            moveEvents = await this.hero.move('left', this.mapParser, this.ctx);
            moveVector = [-1, 0];
        } else if (keyPressed['d'] || keyPressed['arrowright']) {
            moveEvents = await this.hero.move('right', this.mapParser, this.ctx);
            moveVector = [1, 0];
        } else if (keyPressed['j'] && this.hero.hasJump) {
            moveEvents = ['jump_level'];
        } else if (keyPressed['l'] && this.hero.hasForecast) {
            moveEvents = ['forecast_level'];
        } else if (keyPressed['b']) {
            moveEvents = ['save'];
        } else if (keyPressed['n']) {
            moveEvents = ['load'];
        } else if (keyPressed['q']) {
            moveEvents = ['game_quit'];
        }
        
        // 处理事件
        for (const event of moveEvents) {
            await this.handleGameEvent(event, moveVector);
        }
        
        // 清除按键状态（防止连续触发）
        Object.keys(keyPressed).forEach(key => {
            keyPressed[key] = false;
        });
    }

    /**
     * 处理游戏事件
     */
    async handleGameEvent(event, moveVector = [0, 0]) {
        if (event === 'upstairs') {
            this.mapLevelPointer++;
            this.maxMapLevelPointer = Math.max(this.maxMapLevelPointer, this.mapLevelPointer);
            await this.loadMap();
            this.hero.placeNextToStairs(this.mapParser, 'down');
            
            // 第16层触发魔王对话
            if (this.mapLevelPointer === 16 && 
                this.mapParser.mapMatrix[5] && 
                this.mapParser.mapMatrix[5][5] === '53') {
                this.showConversationHeroAndMS();
            }
            
            // 12层预加载18、19层
            if (this.mapLevelPointer === 12) {
                if (!(18 in this.mapParsersDict)) {
                    const temp = this.mapLevelPointer;
                    this.mapLevelPointer = 18;
                    await this.loadMap();
                    this.mapLevelPointer = temp;
                }
                if (!(19 in this.mapParsersDict)) {
                    const temp = this.mapLevelPointer;
                    this.mapLevelPointer = 19;
                    await this.loadMap();
                    this.mapLevelPointer = temp;
                }
            }
        } else if (event === 'downstairs') {
            this.mapLevelPointer--;
            
            // 大于22层都回到22层
            if ([22, 23, 24, 25, 26].includes(this.mapLevelPointer)) {
                this.mapLevelPointer = 22;
                this.hero.blockPosition = [5, 5];
            }
            
            await this.loadMap();
            this.hero.placeNextToStairs(this.mapParser, 'up');
        } else if (event.startsWith('upstairs_')) {
            this.mapLevelPointer++;
            this.maxMapLevelPointer = Math.max(this.maxMapLevelPointer, this.mapLevelPointer);
            
            const targetLevel = parseInt(event.split('_')[1]);
            this.mapLevelPointer = targetLevel;
            
            // 27层重新加载
            if (this.mapLevelPointer === 27 && (this.mapLevelPointer in this.mapParsersDict)) {
                delete this.mapParsersDict[this.mapLevelPointer];
            }
            
            await this.loadMap();
            this.hero.placeNextToStairs(this.mapParser, 'down');
        } else if (event === 'conversation_hero_and_fairy') {
            this.showConversationHeroAndFairy();
        } else if (event === 'conversation_hero_and_thief') {
            this.showConversationHeroAndThief();
        } else if (event === 'conversation_hero_and_princess') {
            this.conversationHeroAndPrincess();
        } else if (['buy_from_shop', 'buy_from_businessman', 'buy_from_oldman'].includes(event)) {
            if ([2, 15, 16].includes(this.mapLevelPointer)) {
                const tag = event === 'buy_from_businessman' ? '27' : '26';
                this.showConversationHeroAndOldman(tag);
            } else {
                this.showBuyInterface(event);
            }
        } else if (event === 'jump_level') {
            this.showJumpLevel();
        } else if (event === 'forecast_level') {
            this.showForecastLevel();
        } else if (event === 'save') {
            this.save();
        } else if (event === 'load') {
            await this.load();
        } else if (event === 'open_iron_door') {
            this.openIronDoor(this.hero);
        } else if (event === 'the_game_is_end') {
            this.gameEnd();
        } else if (event === 'drop_item') {
            const position = [
                this.hero.blockPosition[0] + moveVector[0],
                this.hero.blockPosition[1] + moveVector[1]
            ];
            this.dropItem(position);
        }
    }

    /**
     * 绘制左侧面板
     */
    drawPanel() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `${this.cfg.FONT_SIZE_SMALL}px ${this.cfg.FONT_FAMILY}`;
        this.ctx.textAlign = 'left';
        
        // 楼层数
        this.ctx.font = `${this.cfg.FONT_SIZE}px ${this.cfg.FONT_FAMILY}`;
        this.ctx.fillText(this.mapLevelPointer.toString(), 150, 570);
        
        // 游戏时间
        this.ctx.font = `${this.cfg.FONT_SIZE_SMALL}px ${this.cfg.FONT_FAMILY}`;
        const gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        this.ctx.fillText(`游戏时间: ${minutes} 分 ${seconds} 秒`, 75, 670);
    }

    /**
     * 绘制对话框
     */
    drawConversation() {
        if (this.conversationPointer >= this.currentConversations.length) return;
        
        const conversation = this.currentConversations[this.conversationPointer];
        const isHero = this.conversationPointer % 2 === 0;
        
        let left, top, width, height;
        let idImage;
        
        if (isHero) {
            left = 510;
            top = 430;
            width = 8;
            height = 2;
            idImage = this.hero.images['down'];
        } else {
            left = 300;
            top = 250;
            width = 8;
            height = conversation.length > 3 ? (conversation.length > 5 ? 
                    (conversation.length > 7 ? 5 : 4) : 3) : 2;
            
            // 根据对话类型获取NPC图片
            const npcType = this.currentNPCType || '24';
            idImage = this.resourceLoader.images.mapelements[npcType] ? 
                      this.resourceLoader.images.mapelements[npcType][0] : null;
        }
        
        // 绘制底色
        for (let col = 0; col < width; col++) {
            for (let row = 0; row < height; row++) {
                const img = this.resourceLoader.images.mapelements['0'][0];
                if (img) {
                    this.ctx.drawImage(
                        img,
                        left + col * this.cfg.BLOCKSIZE,
                        top + row * this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE
                    );
                }
            }
        }
        
        // 绘制边框
        this.ctx.strokeStyle = '#C76114';
        this.ctx.lineWidth = 7;
        this.ctx.strokeRect(
            left - 4, top - 4,
            this.cfg.BLOCKSIZE * width + 8,
            this.cfg.BLOCKSIZE * height + 8
        );
        
        // 绘制头像
        if (idImage) {
            this.ctx.drawImage(idImage, left + 10, top + 10, this.cfg.BLOCKSIZE, this.cfg.BLOCKSIZE);
        }
        
        // 绘制文字
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `${this.cfg.FONT_SIZE_SMALL}px ${this.cfg.FONT_FAMILY}`;
        this.ctx.textAlign = 'left';
        
        for (let i = 0; i < conversation.length; i++) {
            this.ctx.fillText(
                conversation[i],
                left + this.cfg.BLOCKSIZE + 40,
                top + 30 + i * 30
            );
        }
    }

    /**
     * 显示对话（通用方法）
     */
    showConversation(conversations, npcType = '24', callback = null) {
        this.currentConversations = conversations;
        this.currentNPCType = npcType;
        this.conversationPointer = 0;
        this.conversationCallback = callback;
    }

    /**
     * 掉落物品
     */
    dropItem(position) {
        const randomNum = Math.floor(Math.random() * 5000) + 1;
        
        if (randomNum <= 5) {
            // 掉落钻石剑或钻石盾
            const item = Math.random() < 0.5 ? '75' : '80';
            this.mapParser.mapMatrix[position[1]][position[0]] = item;
        } else if (randomNum <= 55) {
            // 掉落铁剑或铁盾
            const item = Math.random() < 0.5 ? '71' : '76';
            this.mapParser.mapMatrix[position[1]][position[0]] = item;
        } else if (randomNum <= 500) {
            // 掉落蓝宝石或红宝石
            const item = Math.random() < 0.5 ? '9' : '10';
            this.mapParser.mapMatrix[position[1]][position[0]] = item;
        } else {
            this.mapParser.mapMatrix[position[1]][position[0]] = '0';
        }
    }

    /**
     * 开铁门
     */
    openIronDoor(hero) {
        const pos = hero.blockPosition;
        const matrix = this.mapParser.mapMatrix;
        
        // 根据不同楼层和位置判断
        if (this.mapLevelPointer === 2 && matrix[pos[1] + 1] && matrix[pos[1] + 1][pos[0]] === '15') {
            if (matrix[6][8] === '0') {
                matrix[pos[1] + 1][pos[0]] = '0';
            }
        } else if (this.mapLevelPointer === 4 && matrix[pos[1] - 1] && matrix[pos[1] - 1][pos[0]] === '15') {
            if (matrix[3][5] === '0') {
                matrix[pos[1] - 1][pos[0]] = '0';
            }
        } else if (this.mapLevelPointer === 7 && matrix[pos[1]] && matrix[pos[1]][pos[0] + 1] === '15') {
            if (matrix[4][3] === '0') {
                matrix[pos[1]][pos[0] + 1] = '0';
            }
        } else if (this.mapLevelPointer === 13) {
            if (matrix[pos[1]] && matrix[pos[1]][pos[0] + 1] === '15' && matrix[5][3] === '0') {
                matrix[pos[1]][pos[0] + 1] = '0';
            }
            if (matrix[pos[1] + 1] && matrix[pos[1] + 1][pos[0]] === '15' && matrix[5][3] === '0') {
                matrix[pos[1] + 1][pos[0]] = '0';
            }
        } else if (this.mapLevelPointer === 14 && matrix[pos[1] - 1] && matrix[pos[1] - 1][pos[0]] === '15') {
            if (matrix[6][5] === '0') {
                matrix[pos[1] - 1][pos[0]] = '0';
            }
        } else if (this.mapLevelPointer === 18 && matrix[pos[1] - 1] && matrix[pos[1] - 1][pos[0]] === '15') {
            if (matrix[6][5] === '0') {
                matrix[pos[1] - 1][pos[0]] = '0';
            }
        } else if (this.mapLevelPointer === 19) {
            if (matrix[pos[1] + 1] && matrix[pos[1] + 1][pos[0]] === '15') {
                if (matrix[5][2] === '0' || matrix[5][8] === '0') {
                    matrix[pos[1] + 1][pos[0]] = '0';
                }
            }
        } else if (this.mapLevelPointer === 23 && matrix[pos[1]] && matrix[pos[1]][pos[0] + 1] === '15') {
            if (matrix[5][2] === '0') {
                matrix[pos[1]][pos[0] + 1] = '0';
            }
        } else if (this.mapLevelPointer === 24 && matrix[pos[1]] && matrix[pos[1]][pos[0] - 1] === '15') {
            if (matrix[5][8] === '0') {
                matrix[pos[1]][pos[0] - 1] = '0';
            }
        }
    }

    /**
     * 游戏结束
     */
    gameEnd() {
        this.currentConversations = [['勇者胜利，恭喜你,按"Q"退出游戏']];
        this.conversationPointer = 0;
        this.currentNPCType = null;
    }

    /**
     * 保存游戏
     */
    save() {
        const saveData = {
            mapLevelPointer: this.mapLevelPointer,
            hero: {
                lifeValue: this.hero.lifeValue,
                attackPower: this.hero.attackPower,
                defensePower: this.hero.defensePower,
                level: this.hero.level,
                experience: this.hero.experience,
                numCoins: this.hero.numCoins,
                numYellowKeys: this.hero.numYellowKeys,
                numPurpleKeys: this.hero.numPurpleKeys,
                numRedKeys: this.hero.numRedKeys,
                hasCross: this.hero.hasCross,
                hasForecast: this.hero.hasForecast,
                hasJump: this.hero.hasJump,
                hasIceWand: this.hero.hasIceWand,
                hasFireWand: this.hero.hasFireWand,
                hasHeartWand: this.hero.hasHeartWand,
                canOpenLastDoor: this.hero.canOpenLastDoor
            },
            maxMapLevelPointer: this.maxMapLevelPointer,
            mapParsersDict: {}
        };
        
        // 保存地图状态
        for (const [key, parser] of Object.entries(this.mapParsersDict)) {
            saveData.mapParsersDict[key] = {
                mapMatrix: parser.mapMatrix
            };
        }
        
        localStorage.setItem(this.cfg.SAVE_KEY, JSON.stringify(saveData));
        this.hero.obtainTips = '游戏已保存';
    }

    /**
     * 加载游戏
     */
    async load() {
        const saveDataStr = localStorage.getItem(this.cfg.SAVE_KEY);
        if (!saveDataStr) {
            this.hero.obtainTips = '没有存档';
            return;
        }
        
        const saveData = JSON.parse(saveDataStr);
        
        // 恢复英雄状态
        this.hero.lifeValue = saveData.hero.lifeValue;
        this.hero.attackPower = saveData.hero.attackPower;
        this.hero.defensePower = saveData.hero.defensePower;
        this.hero.level = saveData.hero.level;
        this.hero.experience = saveData.hero.experience;
        this.hero.numCoins = saveData.hero.numCoins;
        this.hero.numYellowKeys = saveData.hero.numYellowKeys;
        this.hero.numPurpleKeys = saveData.hero.numPurpleKeys;
        this.hero.numRedKeys = saveData.hero.numRedKeys;
        this.hero.hasCross = saveData.hero.hasCross;
        this.hero.hasForecast = saveData.hero.hasForecast;
        this.hero.hasJump = saveData.hero.hasJump;
        this.hero.hasIceWand = saveData.hero.hasIceWand;
        this.hero.hasFireWand = saveData.hero.hasFireWand;
        this.hero.hasHeartWand = saveData.hero.hasHeartWand;
        this.hero.canOpenLastDoor = saveData.hero.canOpenLastDoor;
        
        this.mapLevelPointer = saveData.mapLevelPointer;
        this.maxMapLevelPointer = saveData.maxMapLevelPointer;
        
        // 恢复地图状态
        this.mapParsersDict = {};
        for (const [key, data] of Object.entries(saveData.mapParsersDict)) {
            const parser = new MapParser(
                this.cfg.BLOCKSIZE,
                this.cfg.MAPPATHS[parseInt(key)],
                this.mapElementImages,
                [325, 55]
            );
            await parser.load();
            parser.mapMatrix = data.mapMatrix;
            this.mapParsersDict[parseInt(key)] = parser;
        }
        
        await this.loadMap();
        this.hero.placeNextToStairs(this.mapParser, 'down');
        this.hero.obtainTips = '游戏已加载';
    }

    /**
     * 仙女对话
     */
    showConversationHeroAndFairy() {
        let conversations = [];
        let callback = null;
        
        if (this.hero.hasCross && this.mapLevelPointer === 0) {
            // 拿到十字架后
            conversations = Conversations.fairyWithCross;
            callback = () => {
                this.hero.hasCross = false;
                this.hero.lifeValue = Math.floor(this.hero.lifeValue * 4 / 3);
                this.hero.attackPower = Math.floor(this.hero.attackPower * 4 / 3);
                this.hero.defensePower = Math.floor(this.hero.defensePower * 4 / 3);
            };
        } else if (this.hero.hasIceWand && this.mapLevelPointer === 0) {
            // 拿到冰之法杖后
            conversations = Conversations.fairyWithIceWand;
        } else if (this.mapLevelPointer === 0 && this.maxMapLevelPointer === 0) {
            // 初次见面
            conversations = Conversations.fairyFirstMeet;
            callback = () => {
                // 在英雄左上角生成仙女
                if (this.mapParser.mapMatrix[this.hero.blockPosition[1] - 1] &&
                    this.mapParser.mapMatrix[this.hero.blockPosition[1] - 1][this.hero.blockPosition[0] - 1] === '0') {
                    this.mapParser.mapMatrix[this.hero.blockPosition[1] - 1][this.hero.blockPosition[0] - 1] = '24';
                    this.mapParser.mapMatrix[this.hero.blockPosition[1] - 1][this.hero.blockPosition[0]] = '0';
                }
            };
        } else if (this.mapLevelPointer === 22 && this.hero.hasIceWand && 
                   this.hero.hasFireWand && this.hero.hasHeartWand) {
            // 22层集齐法杖
            conversations = Conversations.fairy22AllWands;
            callback = () => {
                this.hero.hasIceWand = false;
                this.hero.hasFireWand = false;
                this.hero.hasHeartWand = false;
                this.hero.canOpenLastDoor = true;
            };
        } else if (this.mapLevelPointer === 22 && 
                   this.mapParsersDict[25] && this.mapParsersDict[25].mapMatrix[7][5] === '0' &&
                   this.mapParsersDict[22] && this.mapParsersDict[22].mapMatrix[2][1] === '0') {
            // 22层打不过boss
            conversations = Conversations.fairy22Help;
            callback = () => {
                this.mapParsersDict[22].mapMatrix[2][1] = '306';
            };
        } else if (this.mapLevelPointer === 22 && this.hero.canOpenLastDoor) {
            // 22层已开门
            conversations = Conversations.fairy22CanOpen;
        } else if (this.mapLevelPointer === 22) {
            // 22层初次
            conversations = Conversations.fairy22First;
            callback = () => {
                // 0层精灵消失
                if (this.mapParsersDict[0]) {
                    this.mapParsersDict[0].mapMatrix[8][5] = '0';
                }
            };
        }
        
        this.showConversation(conversations, '24', callback);
    }
    
    /**
     * 盗贼对话
     */
    showConversationHeroAndThief() {
        let conversations = [];
        let callback = null;
        
        if (this.hero.hasHammer) {
            conversations = Conversations.thiefWithHammer;
            callback = () => {
                // 修好18层的路
                if (this.mapParsersDict[18]) {
                    this.mapParsersDict[18].mapMatrix[8][5] = '0';
                    this.mapParsersDict[18].mapMatrix[9][5] = '0';
                }
                // 盗贼消失
                if (this.mapParsersDict[4]) {
                    this.mapParsersDict[4].mapMatrix[0][5] = '0';
                }
                this.hero.obtainTips = '盗贼消失了！';
            };
        } else {
            conversations = Conversations.thiefNormal;
            callback = () => {
                // 2层门打开
                if (this.mapParsersDict[2]) {
                    this.mapParsersDict[2].mapMatrix[6][1] = '0';
                }
                this.hero.numRedKeys += 2;
            };
        }
        
        this.showConversation(conversations, '25', callback);
    }
    
    /**
     * 公主对话
     */
    conversationHeroAndPrincess() {
        const callback = () => {
            if (this.mapParsersDict[19]) {
                this.mapParsersDict[19].mapMatrix[7][5] = '0';
            }
        };
        this.showConversation(Conversations.princess, '28', callback);
    }
    
    /**
     * 老人/商人对话
     */
    showConversationHeroAndOldman(tag) {
        let conversations = [];
        let callback = null;
        
        if (this.mapLevelPointer === 2 && tag === '26') {
            // 2层老人
            conversations = Conversations.oldman2;
            callback = () => {
                if (this.mapParsersDict[2]) {
                    this.mapParsersDict[2].mapMatrix[10][7] = '73';
                }
            };
        } else if (this.mapLevelPointer === 2 && tag === '27') {
            // 2层商人
            conversations = Conversations.businessman2;
            callback = () => {
                if (this.mapParsersDict[2]) {
                    this.mapParsersDict[2].mapMatrix[10][9] = '78';
                }
            };
        } else if (this.mapLevelPointer === 15 && tag === '27') {
            // 15层商人
            if (this.hero.numCoins >= 500) {
                conversations = Conversations.businessman15Rich;
                callback = () => {
                    this.hero.numCoins -= 500;
                    if (this.mapParsersDict[15]) {
                        this.mapParsersDict[15].mapMatrix[3][6] = '80';
                    }
                };
            } else {
                conversations = Conversations.businessman15Poor;
            }
        } else if (this.mapLevelPointer === 15 && tag === '26') {
            // 15层老人
            if (this.hero.experience >= 500) {
                conversations = Conversations.oldman15Rich;
                callback = () => {
                    this.hero.experience -= 500;
                    if (this.mapParsersDict[15]) {
                        this.mapParsersDict[15].mapMatrix[3][4] = '75';
                    }
                };
            } else {
                conversations = Conversations.oldman15Poor;
            }
        } else if (this.mapLevelPointer === 16 && tag === '26') {
            // 16层老人给冰之法杖
            conversations = Conversations.oldman16;
            callback = () => {
                if (!this.hero.hasIceWand) {
                    this.hero.hasIceWand = true;
                    this.hero.obtainTips = '得到神秘物品';
                }
            };
        }
        
        this.showConversation(conversations, tag, callback);
    }
    
    /**
     * 魔王对话
     */
    showConversationHeroAndMS() {
        this.showConversation(Conversations.demonKing, '53');
    }
    
    /**
     * 商店界面
     */
    showBuyInterface(shopType) {
        let shopConfig = null;
        
        if (this.mapLevelPointer === 3 && shopType === 'buy_from_shop') {
            shopConfig = ShopConfigs.shop3;
        } else if (this.mapLevelPointer === 11 && shopType === 'buy_from_shop') {
            shopConfig = ShopConfigs.shop11;
        } else if (this.mapLevelPointer === 5 && shopType === 'buy_from_oldman') {
            shopConfig = ShopConfigs.oldman5;
        } else if (this.mapLevelPointer === 13 && shopType === 'buy_from_oldman') {
            shopConfig = ShopConfigs.oldman13;
        } else if (this.mapLevelPointer === 5 && shopType === 'buy_from_businessman') {
            shopConfig = ShopConfigs.businessman5;
        } else if (this.mapLevelPointer === 12 && shopType === 'buy_from_businessman') {
            shopConfig = ShopConfigs.businessman12;
        }
        
        if (!shopConfig) return;
        
        // 设置商店状态
        this.shopState = {
            active: true,
            config: shopConfig,
            selectedIndex: 0
        };
    }
    
    /**
     * 处理商店输入
     */
    handleShopInput(keyPressed) {
        if (!this.shopState || !this.shopState.active) return false;
        
        if (keyPressed['w'] || keyPressed['arrowup']) {
            this.shopState.selectedIndex = Math.max(0, this.shopState.selectedIndex - 1);
            return true;
        } else if (keyPressed['s'] || keyPressed['arrowdown']) {
            this.shopState.selectedIndex = Math.min(
                this.shopState.config.choices.length - 1,
                this.shopState.selectedIndex + 1
            );
            return true;
        } else if (keyPressed[' ']) {
            const choice = this.shopState.config.choices[this.shopState.selectedIndex];
            this.executeBuy(choice.action);
            
            // 如果是最后一个选项（离开商店），关闭商店
            if (this.shopState.selectedIndex === this.shopState.config.choices.length - 1) {
                this.shopState = null;
            }
            return true;
        }
        
        return false;
    }
    
    /**
     * 执行购买
     */
    executeBuy(action) {
        const hero = this.hero;
        
        // 检查条件
        if (action.coinsCost && hero.numCoins < action.coinsCost) return;
        if (action.expCost && hero.experience < action.expCost) return;
        if (action.addYellowKey < 0 && hero.numYellowKeys < 1) return;
        if (action.addPurpleKey < 0 && hero.numPurpleKeys < 1) return;
        if (action.addRedKey < 0 && hero.numRedKeys < 1) return;
        
        // 扣除成本
        if (action.coinsCost) hero.numCoins -= action.coinsCost;
        if (action.expCost) hero.experience -= action.expCost;
        
        // 增加属性
        if (action.addLife) hero.lifeValue += action.addLife;
        if (action.addAttack) hero.attackPower += action.addAttack;
        if (action.addDefense) hero.defensePower += action.addDefense;
        if (action.addLevel) {
            hero.level += action.addLevel;
            hero.lifeValue += 1000 * action.addLevel;
            hero.attackPower += 7 * action.addLevel;
            hero.defensePower += 7 * action.addLevel;
        }
        if (action.addYellowKey) hero.numYellowKeys += action.addYellowKey;
        if (action.addPurpleKey) hero.numPurpleKeys += action.addPurpleKey;
        if (action.addRedKey) hero.numRedKeys += action.addRedKey;
    }
    
    /**
     * 绘制商店界面
     */
    drawShop(ctx) {
        if (!this.shopState || !this.shopState.active) return;
        
        const config = this.shopState.config;
        const width = 8;
        const height = 3;
        const left = this.hero.rect.left + this.hero.rect.width / 2 - width / 2 * this.cfg.BLOCKSIZE;
        const bottom = this.hero.rect.top - 70;
        
        // 绘制底色
        for (let col = 0; col < width; col++) {
            for (let row = 0; row < height; row++) {
                const img = this.resourceLoader.images.mapelements['0'][0];
                if (img) {
                    ctx.drawImage(
                        img,
                        left + col * this.cfg.BLOCKSIZE,
                        bottom + row * this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE
                    );
                }
            }
        }
        
        // 绘制边框
        ctx.strokeStyle = '#C76114';
        ctx.lineWidth = 7;
        ctx.strokeRect(
            left - 4, bottom - 4,
            this.cfg.BLOCKSIZE * width + 8,
            this.cfg.BLOCKSIZE * height + 8
        );
        
        // 绘制NPC头像
        const npcImage = this.resourceLoader.images.mapelements[config.npcType];
        if (npcImage && npcImage[0]) {
            ctx.drawImage(npcImage[0], left + 10, bottom + 10, this.cfg.BLOCKSIZE, this.cfg.BLOCKSIZE);
        }
        
        // 绘制选项
        ctx.font = `${this.cfg.FONT_SIZE_SMALL}px ${this.cfg.FONT_FAMILY}`;
        ctx.textAlign = 'left';
        
        // 标题
        ctx.fillStyle = '#fff';
        ctx.fillText(config.title, left + this.cfg.BLOCKSIZE + 20, bottom + 30);
        
        // 选项列表
        for (let i = 0; i < config.choices.length; i++) {
            const choice = config.choices[i];
            let text = choice.text;
            
            if (this.shopState.selectedIndex === i) {
                text = '➤' + text;
                ctx.fillStyle = '#f00';
            } else {
                text = '    ' + text;
                ctx.fillStyle = '#fff';
            }
            
            ctx.fillText(text, left + this.cfg.BLOCKSIZE + 20, bottom + 60 + i * 30);
        }
    }
    
    /**
     * 楼层跳转
     */
    showJumpLevel() {
        let selectedLevel = this.mapLevelPointer;
        const maxLevel = Math.floor(this.maxMapLevelPointer <= 22 ? this.maxMapLevelPointer : 22);
        
        const keyHandler = async (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w') {
                selectedLevel = Math.max(0, selectedLevel - 1);
                this.jumpLevelState.selectedLevel = selectedLevel;
            } else if (e.key === 'ArrowDown' || e.key === 's') {
                selectedLevel = Math.min(maxLevel, selectedLevel + 1);
                this.jumpLevelState.selectedLevel = selectedLevel;
            } else if (e.key === ' ') {
                window.removeEventListener('keydown', keyHandler);
                
                const oriLevel = this.mapLevelPointer;
                this.mapLevelPointer = selectedLevel;
                await this.loadMap();
                
                if (oriLevel > this.mapLevelPointer) {
                    this.hero.placeNextToStairs(this.mapParser, 'up');
                } else {
                    this.hero.placeNextToStairs(this.mapParser, 'down');
                }
                
                this.jumpLevelState = null;
            } else if (e.key === 'Escape' || e.key === 'j') {
                // ESC或J键退出
                window.removeEventListener('keydown', keyHandler);
                this.jumpLevelState = null;
            }
        };
        
        window.addEventListener('keydown', keyHandler);
        
        this.jumpLevelState = {
            active: true,
            selectedLevel: selectedLevel,
            maxLevel: maxLevel,
            keyHandler: keyHandler
        };
    }
    
    /**
     * 绘制楼层跳转界面
     */
    drawJumpLevel(ctx) {
        if (!this.jumpLevelState || !this.jumpLevelState.active) return;
        
        const width = 11;
        const height = 6;
        const left = this.cfg.SCREENSIZE[0] / 2 - width / 2 * this.cfg.BLOCKSIZE;
        const top = (this.cfg.SCREENSIZE[1] - height * this.cfg.BLOCKSIZE) / 2;
        
        // 绘制底色
        for (let col = 0; col < width; col++) {
            for (let row = 0; row < height; row++) {
                const img = this.resourceLoader.images.mapelements['0'][0];
                if (img) {
                    ctx.drawImage(
                        img,
                        left + col * this.cfg.BLOCKSIZE,
                        top + row * this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE
                    );
                }
            }
        }
        
        // 绘制边框
        ctx.strokeStyle = '#C76114';
        ctx.lineWidth = 7;
        ctx.strokeRect(
            left - 4, top - 4,
            this.cfg.BLOCKSIZE * width + 8,
            this.cfg.BLOCKSIZE * height + 8
        );
        
        // 绘制楼层列表
        ctx.font = `${this.cfg.FONT_SIZE_SMALL}px ${this.cfg.FONT_FAMILY}`;
        ctx.textAlign = 'left';
        
        for (let idx = 0; idx <= this.jumpLevelState.maxLevel; idx++) {
            let text = `    第 ${idx} 层`;
            if (this.jumpLevelState.selectedLevel === idx) {
                text = `➤第 ${idx} 层`;
                ctx.fillStyle = '#f00';
            } else {
                ctx.fillStyle = '#fff';
            }
            
            const col = Math.floor(idx / 6);
            const row = idx % 6;
            ctx.fillText(text, left + 20 + col * this.cfg.BLOCKSIZE * 2.5, top + 40 + row * 30);
        }
    }
    
    /**
     * 怪物预测
     */
    showForecastLevel() {
        const monsters = this.mapParser.getAllMonsters();
        if (monsters.length < 1) return;
        
        this.forecastState = {
            active: true,
            monsters: monsters,
            page: 0,
            maxPage: Math.ceil(monsters.length / 4) - 1,
            showTip: true,
            tipCount: 0
        };
        
        const keyHandler = (e) => {
            if (e.key === ' ') {
                this.forecastState.page++;
                if (this.forecastState.page > this.forecastState.maxPage) {
                    this.forecastState.page = 0;
                }
            } else if (e.key === 'l' || e.key === 'Escape') {
                // L键或ESC键退出
                window.removeEventListener('keydown', keyHandler);
                this.forecastState = null;
            }
        };
        
        window.addEventListener('keydown', keyHandler);
        this.forecastState.keyHandler = keyHandler;
    }
    
    /**
     * 绘制怪物预测界面
     */
    drawForecast(ctx) {
        if (!this.forecastState || !this.forecastState.active) return;
        
        const width = 14;
        const height = 5;
        const left = this.cfg.SCREENSIZE[0] / 2 - width / 2 * this.cfg.BLOCKSIZE;
        const top = this.cfg.SCREENSIZE[1] / 2 - height * this.cfg.BLOCKSIZE;
        
        // 绘制底色
        for (let col = 0; col < width; col++) {
            for (let row = 0; row < height; row++) {
                const img = this.resourceLoader.images.mapelements['0'][0];
                if (img) {
                    ctx.drawImage(
                        img,
                        left + col * this.cfg.BLOCKSIZE,
                        top + row * this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE
                    );
                }
            }
        }
        
        // 绘制边框
        ctx.strokeStyle = '#C76114';
        ctx.lineWidth = 7;
        ctx.strokeRect(
            left - 4, top - 4,
            this.cfg.BLOCKSIZE * width + 8,
            this.cfg.BLOCKSIZE * height + 8
        );
        
        // 绘制怪物信息
        const startIdx = this.forecastState.page * 4;
        const endIdx = Math.min(startIdx + 4, this.forecastState.monsters.length);
        const monsters = this.forecastState.monsters.slice(startIdx, endIdx);
        
        ctx.font = `${this.cfg.FONT_SIZE_SMALL}px ${this.cfg.FONT_FAMILY}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';
        
        for (let i = 0; i < monsters.length; i++) {
            const monster = monsters[i];
            const monsterImg = this.resourceLoader.images.mapelements[monster[6]];
            
            if (monsterImg && monsterImg[0]) {
                ctx.drawImage(
                    monsterImg[0],
                    left + 10,
                    top + 20 + i * this.cfg.BLOCKSIZE,
                    this.cfg.BLOCKSIZE - 10,
                    this.cfg.BLOCKSIZE - 10
                );
            }
            
            const [canWin, damage] = this.hero.winMonster(monster);
            const text = `名称:${monster[0]} 生命:${monster[1]} 攻击:${monster[2]} 防御:${monster[3]} 金币:${monster[4]} 经验:${monster[5]} 损失:${damage}`;
            ctx.fillText(text, left + 15 + this.cfg.BLOCKSIZE, top + 30 + i * this.cfg.BLOCKSIZE);
        }
        
        // 操作提示
        this.forecastState.tipCount++;
        if (this.forecastState.tipCount >= 15) {
            this.forecastState.tipCount = 0;
            this.forecastState.showTip = !this.forecastState.showTip;
        }
        
        if (this.forecastState.showTip) {
            ctx.fillText('空格键', left + this.cfg.BLOCKSIZE * width + 30, top + this.cfg.BLOCKSIZE * (height + 1) + 10);
        }
    }
}
