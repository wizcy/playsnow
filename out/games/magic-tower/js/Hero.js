/**
 * 英雄类
 * 对应Python版本的Hero类
 */
class Hero {
    constructor(images, blocksize, blockPosition, offset = [0, 0], cfg, resourceLoader, backgroundImages) {
        // 基础属性
        this.blocksize = blocksize;
        this.blockPosition = blockPosition;
        this.offset = offset;
        this.cfg = cfg;
        this.resourceLoader = resourceLoader;
        this.backgroundImages = backgroundImages;
        
        // 图片
        this.images = images;
        this.currentImage = 'down';
        
        // 位置
        this.rect = {
            left: blockPosition[0] * blocksize + offset[0],
            top: blockPosition[1] * blocksize + offset[1],
            width: blocksize,
            height: blocksize
        };
        
        // 等级和属性
        this.level = 1;
        this.lifeValue = 1000;
        this.attackPower = 20;
        this.defensePower = 11;
        this.numCoins = 0;
        this.experience = 0;
        this.numYellowKeys = 1;
        this.numPurpleKeys = 1;
        this.numRedKeys = 1;
        
        // 宝物
        this.hasCross = false;          // 幸运十字架
        this.hasForecast = false;       // 圣光徽
        this.hasJump = true;            // 风之罗盘
        this.hasHammer = false;         // 星光神榔
        this.hasIceWand = false;        // 冰之法杖
        this.hasHeartWand = false;      // 心之法杖
        this.hasFireWand = false;       // 炎之法杖
        this.canOpenLastDoor = false;   // 能否开最后的门
        
        // 行动冷却（减少冷却时间使移动更流畅）
        this.moveCoolingCount = 0;
        this.moveCoolingTime = 2;  // 从5改为2，使移动更流畅
        this.freezeMoveFlag = false;
        
        // 获得物品提示
        this.obtainTips = null;
        this.showObtainTipsCount = 0;
        this.maxObtainTipsCount = 40;
        
        // 当前场景（用于对话等）
        this.curScenes = [];
    }

    /**
     * 移动英雄
     * @param {string} direction - 移动方向 'up', 'down', 'left', 'right'
     * @param {MapParser} mapParser - 地图解析器
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @returns {Array} 触发的事件列表
     */
    async move(direction, mapParser, ctx) {
        if (this.freezeMoveFlag) return [];
        
        this.currentImage = direction;
        
        // 计算移动向量
        const moveVector = {
            'left': [-1, 0],
            'right': [1, 0],
            'up': [0, -1],
            'down': [0, 1]
        }[direction];
        
        const blockPosition = [
            this.blockPosition[0] + moveVector[0],
            this.blockPosition[1] + moveVector[1]
        ];
        
        // 判断移动是否合法
        let events = [];
        if (blockPosition[0] >= 0 && blockPosition[0] < mapParser.mapSize[1] &&
            blockPosition[1] >= 0 && blockPosition[1] < mapParser.mapSize[0]) {
            
            const elem = mapParser.mapMatrix[blockPosition[1]][blockPosition[0]];
            
            // 空地可以移动
            if (['0', '00', 'hero'].includes(elem)) {
                this.blockPosition = blockPosition;
            } else {
                // 触发碰撞事件
                const [flag, collideEvents] = await this.dealCollideEvent(
                    elem, blockPosition, mapParser, ctx
                );
                events = collideEvents;
                
                if (flag) {
                    this.blockPosition = blockPosition;
                    mapParser.mapMatrix[blockPosition[1]][blockPosition[0]] = '0';
                }
            }
        }
        
        // 更新位置
        this.rect.left = this.blockPosition[0] * this.blocksize + this.offset[0];
        this.rect.top = this.blockPosition[1] * this.blocksize + this.offset[1];
        
        // 冷却移动
        this.freezeMoveFlag = true;
        
        return events;
    }

    /**
     * 绘制英雄
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    draw(ctx) {
        // 处理移动冷却
        if (this.freezeMoveFlag) {
            this.moveCoolingCount++;
            if (this.moveCoolingCount > this.moveCoolingTime) {
                this.moveCoolingCount = 0;
                this.freezeMoveFlag = false;
            }
        }
        
        // 绘制英雄图片
        const image = this.images[this.currentImage];
        if (image) {
            ctx.drawImage(
                image,
                this.rect.left,
                this.rect.top,
                this.blocksize,
                this.blocksize
            );
        }
        
        // 绘制属性信息
        ctx.fillStyle = '#fff';
        ctx.font = `${this.cfg.FONT_SIZE}px ${this.cfg.FONT_FAMILY}`;
        ctx.textAlign = 'left';
        
        const stats = [
            this.level,
            this.lifeValue,
            this.attackPower,
            this.defensePower,
            this.numCoins,
            this.experience,
            this.numYellowKeys,
            this.numPurpleKeys,
            this.numRedKeys
        ];
        
        ctx.fillText(stats[0].toString(), 160, 120);
        for (let i = 1; i < 6; i++) {
            ctx.fillText(stats[i].toString(), 160, 127 + 42 * i);
        }
        // 钥匙数量显示位置（向下调整）
        for (let i = 6; i < 9; i++) {
            ctx.fillText(stats[i].toString(), 160, 380 + 55 * (i - 6));
        }
    }

    /**
     * 放置到楼梯旁
     * @param {MapParser} mapParser - 地图解析器
     * @param {string} stairsType - 'up' 或 'down'
     */
    placeNextToStairs(mapParser, stairsType = 'up') {
        const targetElem = stairsType === 'up' ? '13' : '14';
        
        for (let rowIdx = 0; rowIdx < mapParser.mapMatrix.length; rowIdx++) {
            for (let colIdx = 0; colIdx < mapParser.mapMatrix[rowIdx].length; colIdx++) {
                if (mapParser.mapMatrix[rowIdx][colIdx] === targetElem) {
                    // 尝试四个方向找空位
                    if (rowIdx > 0 && mapParser.mapMatrix[rowIdx - 1][colIdx] === '00') {
                        this.blockPosition = [colIdx, rowIdx - 1];
                        break;
                    } else if (rowIdx < mapParser.mapSize[0] - 1 && 
                               mapParser.mapMatrix[rowIdx + 1][colIdx] === '00') {
                        this.blockPosition = [colIdx, rowIdx + 1];
                        break;
                    } else if (colIdx > 0 && 
                               mapParser.mapMatrix[rowIdx][colIdx - 1] === '00') {
                        this.blockPosition = [colIdx - 1, rowIdx];
                        break;
                    } else if (colIdx < mapParser.mapSize[1] - 1 && 
                               mapParser.mapMatrix[rowIdx][colIdx + 1] === '00') {
                        this.blockPosition = [colIdx + 1, rowIdx];
                        break;
                    }
                }
            }
        }
        
        this.rect.left = this.blockPosition[0] * this.blocksize + this.offset[0];
        this.rect.top = this.blockPosition[1] * this.blocksize + this.offset[1];
    }

    /**
     * 处理碰撞事件
     * @param {string} elem - 碰撞元素
     * @param {Array} blockPosition - 碰撞位置
     * @param {MapParser} mapParser - 地图解析器
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @returns {Array} [是否可通过, 事件列表]
     */
    async dealCollideEvent(elem, blockPosition, mapParser, ctx) {
        // 门
        if (['2', '3', '4', '5'].includes(elem)) {
            let flag = false;
            if (elem === '2' && this.numYellowKeys > 0) {
                this.numYellowKeys--;
                flag = true;
            } else if (elem === '3' && this.numPurpleKeys > 0) {
                this.numPurpleKeys--;
                flag = true;
            } else if (elem === '4' && this.numRedKeys > 0) {
                this.numRedKeys--;
                flag = true;
            } else if (elem === '5' && this.canOpenLastDoor) {
                flag = true;
            }
            return [flag, []];
        }
        
        // 钥匙
        if (['6', '7', '8'].includes(elem)) {
            if (elem === '6') {
                this.numYellowKeys++;
                this.obtainTips = '得到一把黄钥匙';
            } else if (elem === '7') {
                this.numPurpleKeys++;
                this.obtainTips = '得到一把蓝钥匙';
            } else if (elem === '8') {
                this.numRedKeys++;
                this.obtainTips = '得到一把红钥匙';
            }
            return [true, []];
        }
        
        // 宝石
        if (['9', '10'].includes(elem)) {
            if (elem === '9') {
                this.defensePower += 3;
                this.obtainTips = '得到一个蓝宝石 防御力加3';
            } else if (elem === '10') {
                this.attackPower += 3;
                this.obtainTips = '得到一个红宝石 攻击力加3';
            }
            return [true, []];
        }
        
        // 血瓶
        if (['11', '12'].includes(elem)) {
            if (elem === '11') {
                this.lifeValue += 200;
                this.obtainTips = '得到一个小血瓶 生命加200';
            } else if (elem === '12') {
                this.lifeValue += 500;
                this.obtainTips = '得到一个大血瓶 生命加500';
            }
            return [true, []];
        }
        
        // 楼梯
        if (['13', '14', '301', '302', '303', '305', '306'].includes(elem)) {
            const events = {
                '13': ['upstairs'],
                '14': ['downstairs'],
                '301': ['upstairs_25'],
                '302': ['upstairs_24'],
                '303': ['upstairs_23'],
                '305': ['upstairs_26'],
                '306': ['upstairs_27']
            }[elem];
            return [false, events];
        }
        
        // 铁门
        if (elem === '15') {
            return [false, ['open_iron_door']];
        }
        
        // 商店和NPC
        if (['22', '26', '27'].includes(elem)) {
            const events = {
                '22': ['buy_from_shop'],
                '26': ['buy_from_oldman'],
                '27': ['buy_from_businessman']
            }[elem];
            return [false, events];
        }
        
        // 仙女
        if (elem === '24') {
            return [false, ['conversation_hero_and_fairy']];
        }
        
        // 盗贼
        if (elem === '25') {
            return [false, ['conversation_hero_and_thief']];
        }
        
        // 公主
        if (elem === '28') {
            return [false, ['conversation_hero_and_princess']];
        }
        
        // 飞羽
        if (['30', '31'].includes(elem)) {
            if (elem === '30') {
                this.level++;
                this.lifeValue += 1000;
                this.attackPower += 7;
                this.defensePower += 7;
                this.obtainTips = '得到小飞羽 等级提升一级';
            } else if (elem === '31') {
                this.level += 3;
                this.lifeValue += 3000;
                this.attackPower += 21;
                this.defensePower += 21;
                this.obtainTips = '得到大飞羽 等级提升三级';
            }
            return [true, []];
        }
        
        // 幸运十字架
        if (elem === '32') {
            this.hasCross = true;
            this.obtainTips = ['【幸运十字架】把它交给序章中的仙子', '可以将自身的所有能力提升一些(攻击防御和生命值)'];
            return [true, []];
        }
        
        // 圣水瓶
        if (elem === '33') {
            this.lifeValue *= 2;
            this.obtainTips = '【圣水瓶】它可以将你的体质增加一倍';
            return [true, []];
        }
        
        // 圣光徽
        if (elem === '34') {
            this.hasForecast = true;
            this.obtainTips = '【圣光徽】按L键使用 查看怪物的基本情况';
            return [true, []];
        }
        
        // 风之罗盘
        if (elem === '35') {
            this.hasJump = true;
            this.obtainTips = '【风之罗盘】按J键使用 在已经走过的楼层间进行跳跃';
            return [true, []];
        }
        
        // 钥匙盒
        if (elem === '36') {
            this.numYellowKeys++;
            this.numPurpleKeys++;
            this.numRedKeys++;
            this.obtainTips = '得到钥匙盒 各种钥匙数加1';
            return [true, []];
        }
        
        // 星光神榔
        if (elem === '38') {
            this.hasHammer = true;
            this.obtainTips = ['【星光神榔】把它交给第四层的小偷', '小偷便会用它打开第十八层的隐藏地面'];
            return [true, []];
        }
        
        // 金块
        if (elem === '39') {
            this.numCoins += 300;
            this.obtainTips = '得到金块 金币数加300';
            return [true, []];
        }
        
        // 武器
        if (elem === '71') {
            this.attackPower += 10;
            this.obtainTips = '得到铁剑 攻击力加10';
            return [true, []];
        }
        if (elem === '73') {
            this.attackPower += 30;
            this.obtainTips = '得到钢剑 攻击力加30';
            return [true, []];
        }
        if (elem === '75') {
            this.attackPower += 120;
            this.obtainTips = '得到圣光剑 攻击力加120';
            return [true, []];
        }
        
        // 盾牌
        if (elem === '76') {
            this.defensePower += 10;
            this.obtainTips = '得到铁盾 防御力加10';
            return [true, []];
        }
        if (elem === '78') {
            this.defensePower += 30;
            this.obtainTips = '得到钢盾 防御力加30';
            return [true, []];
        }
        if (elem === '80') {
            this.defensePower += 120;
            this.obtainTips = '得到星光盾 防御力加120';
            return [true, []];
        }
        
        // 法杖
        if (elem === '202') {
            this.hasFireWand = true;
            this.obtainTips = '得到炎之法杖';
            return [true, []];
        }
        if (elem === '203') {
            this.hasHeartWand = true;
            this.obtainTips = '得到心之法杖';
            return [true, []];
        }
        
        // 怪物
        if (elem in mapParser.monstersDict) {
            const monster = [...mapParser.monstersDict[elem]];
            const [canWin, damage] = this.winMonster(monster);
            
            if (canWin) {
                await this.battle(monster, mapParser.elementImages[elem][0], mapParser, ctx);
                this.numCoins += monster[4];
                this.experience += monster[5];
                this.obtainTips = `获得金币数${monster[4]} 经验值${monster[5]}`;
                
                if (elem === '198') {
                    return [true, ['the_game_is_end']];
                } else {
                    return [false, ['drop_item']];
                }
            } else {
                return [false, []];
            }
        }
        
        return [false, []];
    }

    /**
     * 判断是否能打赢怪物
     * @param {Array} monster - 怪物信息 [名字, 生命值, 攻击力, 防御力, 金币, 经验]
     * @returns {Array} [能否打赢, 损失生命值]
     */
    winMonster(monster) {
        // 攻击力低于怪物防御力
        if (this.attackPower <= monster[3]) {
            return [false, '???'];
        }
        
        // 防御力高于怪物攻击力
        if (this.defensePower >= monster[2]) {
            return [true, '0'];
        }
        
        // 计算伤害
        const diffOur = this.attackPower - monster[3];
        const diffMonster = monster[2] - this.defensePower;
        
        // 计算谁能赢
        const ourRounds = Math.ceil(monster[1] / diffOur);
        const monsterDamage = diffMonster * ourRounds;
        
        if (this.lifeValue > monsterDamage) {
            return [true, monsterDamage.toString()];
        }
        
        return [false, '???'];
    }

    /**
     * 战斗画面
     * @param {Array} monster - 怪物信息
     * @param {Image} monsterImage - 怪物图片
     * @param {MapParser} mapParser - 地图解析器
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    async battle(monster, monsterImage, mapParser, ctx) {
        // 复制怪物数据
        monster = [...monster];
        
        // 计算伤害
        const diffOur = this.attackPower - monster[3];
        const diffMonster = Math.max(monster[2] - this.defensePower, 0);
        
        // 战斗状态
        let updateCount = 0;
        const updateInterval = 3;  // 战斗速度（数值越小越快）
        let updateHero = false;
        
        // 战斗循环
        return new Promise((resolve) => {
            const battleLoop = () => {
                // 绘制背景
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, this.cfg.SCREENSIZE[0], this.cfg.SCREENSIZE[1]);
                
                if (this.backgroundImages.gamebg) {
                    ctx.drawImage(this.backgroundImages.gamebg, 0, 0);
                }
                
                // 绘制地图
                mapParser.draw(ctx);
                
                // 绘制英雄
                this.draw(ctx);
                
                // 更新战斗面板
                updateCount++;
                if (updateCount > updateInterval) {
                    updateCount = 0;
                    if (updateHero) {
                        this.lifeValue = this.lifeValue - diffMonster;
                    } else {
                        monster[1] = Math.max(monster[1] - diffOur, 0);
                    }
                    updateHero = !updateHero;
                    
                    // 怪物死亡，结束战斗
                    if (monster[1] <= 0) {
                        resolve();
                        return;
                    }
                }
                
                // 绘制战斗背景框（适配画布大小）
                const battleBg = this.backgroundImages.battlebg;
                if (battleBg) {
                    // 计算缩放比例，使背景适应画布
                    const bgScale = Math.min(
                        (this.cfg.SCREENSIZE[0] - 40) / battleBg.width,
                        (this.cfg.SCREENSIZE[1] - 80) / battleBg.height
                    );
                    const bgWidth = battleBg.width * bgScale;
                    const bgHeight = battleBg.height * bgScale;
                    ctx.drawImage(battleBg, 20, 40, bgWidth, bgHeight);
                }
                
                // 绘制怪物图片（限制尺寸）
                let monsterImgWidth = 0;
                if (monsterImage) {
                    const maxSize = 150;
                    let imgWidth = monsterImage.width;
                    let imgHeight = monsterImage.height;
                    
                    // 等比缩放
                    if (imgWidth > maxSize || imgHeight > maxSize) {
                        const scale = Math.min(maxSize / imgWidth, maxSize / imgHeight);
                        imgWidth *= scale;
                        imgHeight *= scale;
                    }
                    
                    monsterImgWidth = imgWidth;
                    ctx.drawImage(monsterImage, 90, 140, imgWidth, imgHeight);
                }
                
                // 绘制战斗数据
                ctx.font = `40px ${this.cfg.FONT_FAMILY}`;
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'left';
                
                // 怪物数据（左侧）
                const monsterStats = [
                    monster[1].toString(),  // 生命
                    monster[2].toString(),  // 攻击
                    monster[3].toString()   // 防御
                ];
                
                for (let i = 0; i < 3; i++) {
                    ctx.fillText(monsterStats[i], 320, 78 + 40 + i * 95);
                }
                
                // 英雄数据（右侧）
                const heroStats = [
                    this.lifeValue.toString(),
                    this.attackPower.toString(),
                    this.defensePower.toString()
                ];
                
                ctx.textAlign = 'right';
                for (let i = 0; i < 3; i++) {
                    ctx.fillText(heroStats[i], 655, 78 + 40 + i * 95);
                }
                
                // 显示伤害数字
                ctx.fillStyle = '#f00';
                ctx.textAlign = 'center';
                if (updateHero) {
                    // 英雄受伤
                    ctx.fillText(`-${diffMonster}`, 750, 140);
                } else {
                    // 怪物受伤
                    const monsterX = 90 + monsterImgWidth / 2;
                    ctx.fillText(`-${diffOur}`, monsterX, 140);
                }
                
                ctx.textAlign = 'left';
                
                requestAnimationFrame(battleLoop);
            };
            
            battleLoop();
        });
    }

    /**
     * 显示获得物品提示
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     */
    showInfo(ctx) {
        if (!this.obtainTips) return;
        
        this.showObtainTipsCount++;
        if (this.showObtainTipsCount > this.maxObtainTipsCount) {
            this.showObtainTipsCount = 0;
            this.obtainTips = null;
            return;
        }
        
        // 画框
        const left = this.cfg.BLOCKSIZE / 2;
        const top = 100;
        const width = Math.floor(this.cfg.SCREENSIZE[0] / this.cfg.BLOCKSIZE) - 1;
        const height = 2;
        
        // 边框
        ctx.strokeStyle = '#C76114';
        ctx.lineWidth = 7;
        ctx.strokeRect(
            left - 4, top - 4,
            this.cfg.BLOCKSIZE * width + 8,
            this.cfg.BLOCKSIZE * height + 8
        );
        
        // 底色
        for (let col = 0; col < width; col++) {
            for (let row = 0; row < height; row++) {
                const image = this.resourceLoader.images.mapelements['0'][0];
                if (image) {
                    ctx.drawImage(
                        image,
                        left + col * this.cfg.BLOCKSIZE,
                        top + row * this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE,
                        this.cfg.BLOCKSIZE
                    );
                }
            }
        }
        
        // 文字
        ctx.fillStyle = '#fff';
        ctx.font = `30px ${this.cfg.FONT_FAMILY}`;
        ctx.textAlign = 'center';
        
        if (Array.isArray(this.obtainTips)) {
            ctx.fillText(
                this.obtainTips[0],
                left + width * this.cfg.BLOCKSIZE / 2,
                top + 30
            );
            ctx.fillText(
                this.obtainTips[1],
                left + width * this.cfg.BLOCKSIZE / 2,
                top + 30 + this.cfg.BLOCKSIZE
            );
        } else {
            ctx.fillText(
                this.obtainTips,
                left + width * this.cfg.BLOCKSIZE / 2,
                top + height * this.cfg.BLOCKSIZE / 2 + 10
            );
        }
        
        ctx.textAlign = 'left';
    }
}
