/**
 * 地图解析器类
 * 对应Python版本的MapParser类
 */
class MapParser {
    constructor(blocksize, filepath, elementImages, offset = [0, 0]) {
        this.count = 0;
        this.switchTimes = 15;
        this.imagePointer = 0;
        this.offset = offset;
        this.blocksize = blocksize;
        this.elementImages = elementImages;
        this.mapMatrix = [];
        this.mapSize = [0, 0];
        this.filepath = filepath;
        
        // 地图上所有怪物的属性: [名字, 生命值, 攻击力, 防御力, 金币, 经验]
        this.monstersDict = {
            '40': ['绿头怪', 50, 20, 1, 1, 1],
            '41': ['红头怪', 70, 15, 2, 2, 2],
            '42': ['小蝙蝠', 100, 20, 5, 3, 3],
            '43': ['青头怪', 200, 35, 10, 5, 5],
            '44': ['骷髅人', 110, 25, 5, 5, 4],
            '45': ['骷髅士兵', 150, 40, 20, 8, 6],
            '46': ['兽面人', 300, 75, 45, 13, 10],
            '47': ['初级卫兵', 450, 150, 90, 22, 19],
            '48': ['大蝙蝠', 150, 65, 30, 10, 8],
            '49': ['红蝙蝠', 550, 160, 90, 25, 20],
            '50': ['白衣武士', 1300, 300, 150, 40, 35],
            '51': ['怪王', 700, 250, 125, 32, 30],
            '52': ['红衣法师', 500, 400, 260, 47, 45],
            '53': ['红衣魔王', 15000, 1000, 1000, 100, 100],
            '54': ['金甲卫士', 850, 350, 200, 45, 40],
            '55': ['金甲队长', 900, 750, 650, 77, 70],
            '56': ['骷髅队长', 400, 90, 50, 15, 12],
            '57': ['灵法师', 1500, 830, 730, 80, 70],
            '58': ['灵武士', 1200, 980, 900, 88, 75],
            '59': ['冥灵魔王', 30000, 1700, 1500, 250, 220],
            '60': ['麻衣法师', 250, 120, 70, 20, 17],
            '61': ['冥战士', 2000, 680, 590, 70, 65],
            '62': ['冥队长', 2500, 900, 850, 84, 75],
            '63': ['初级法师', 125, 50, 25, 10, 7],
            '64': ['高级法师', 100, 200, 110, 30, 25],
            '65': ['石头怪人', 500, 115, 65, 15, 15],
            '66': ['兽面战士', 900, 450, 330, 50, 50],
            '67': ['双手剑士', 1200, 620, 520, 65, 75],
            '68': ['冥卫兵', 1250, 500, 400, 55, 55],
            '69': ['高级卫兵', 1500, 560, 460, 60, 60],
            '70': ['影子战士', 3100, 1150, 1050, 92, 80],
            '188': ['血影', 99999, 5000, 4000, 0, 0],
            '198': ['魔龙', 99999, 9999, 5000, 0, 0]
        };
    }

    /**
     * 加载并解析地图文件
     * @returns {Promise}
     */
    async load() {
        try {
            const response = await fetch(this.filepath);
            const text = await response.text();
            this.mapMatrix = this.parse(text);
            this.mapSize = [this.mapMatrix.length, this.mapMatrix[0].length];
        } catch (error) {
            console.error('地图加载失败:', error);
            // 创建空地图
            this.mapMatrix = Array(13).fill(null).map(() => Array(11).fill('0'));
            this.mapSize = [13, 11];
        }
    }

    /**
     * 解析地图文本
     * @param {string} text - 地图文件内容
     * @returns {Array} 地图矩阵
     */
    parse(text) {
        const mapMatrix = [];
        const lines = text.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            const row = trimmed.split(',').map(cell => cell.trim());
            mapMatrix.push(row);
        }
        
        return mapMatrix;
    }

    /**
     * 获取英雄的位置
     * @param {string} posType - 'pixel' 或 'block'
     * @returns {Array|null} [x, y] 坐标
     */
    getHeroPosition(posType = 'block') {
        for (let rowIdx = 0; rowIdx < this.mapMatrix.length; rowIdx++) {
            for (let colIdx = 0; colIdx < this.mapMatrix[rowIdx].length; colIdx++) {
                if (this.mapMatrix[rowIdx][colIdx] === 'hero') {
                    if (posType === 'pixel') {
                        return [
                            colIdx * this.blocksize + this.offset[0],
                            rowIdx * this.blocksize + this.offset[1]
                        ];
                    } else {
                        return [colIdx, rowIdx];
                    }
                }
            }
        }
        return null;
    }

    /**
     * 获取所有怪物信息
     * @returns {Array} 怪物信息数组
     */
    getAllMonsters() {
        const monsters = [];
        const seen = new Set();
        
        for (let rowIdx = 0; rowIdx < this.mapMatrix.length; rowIdx++) {
            for (let colIdx = 0; colIdx < this.mapMatrix[rowIdx].length; colIdx++) {
                const elem = this.mapMatrix[rowIdx][colIdx];
                if (elem in this.monstersDict) {
                    const key = JSON.stringify(this.monstersDict[elem]) + elem;
                    if (!seen.has(key)) {
                        seen.add(key);
                        const monster = [...this.monstersDict[elem], elem];
                        monsters.push(monster);
                    }
                }
            }
        }
        
        return monsters;
    }

    /**
     * 绘制地图
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {Hero} hero - 英雄对象（可选，用于显示怪物损失值）
     */
    draw(ctx, hero = null) {
        this.count++;
        if (this.count === this.switchTimes) {
            this.count = 0;
            this.imagePointer = 1 - this.imagePointer;
        }

        for (let rowIdx = 0; rowIdx < this.mapMatrix.length; rowIdx++) {
            for (let colIdx = 0; colIdx < this.mapMatrix[rowIdx].length; colIdx++) {
                const elem = this.mapMatrix[rowIdx][colIdx];
                const position = [
                    colIdx * this.blocksize + this.offset[0],
                    rowIdx * this.blocksize + this.offset[1]
                ];

                let image = null;

                if (elem in this.elementImages) {
                    image = this.elementImages[elem][this.imagePointer];
                } else if (elem === '00' || elem === 'hero') {
                    image = this.elementImages['0'][this.imagePointer];
                } else if (['301', '302', '303', '305', '306'].includes(elem)) {
                    // 特殊楼梯使用13的图片
                    image = this.elementImages['13'][this.imagePointer];
                }

                if (image) {
                    ctx.drawImage(
                        image,
                        position[0],
                        position[1],
                        this.blocksize,
                        this.blocksize
                    );
                }
                
                // 如果是怪物，显示损失值（暂时屏蔽圣光徽检查，默认显示）
                // if (hero && hero.hasForecast && elem in this.monstersDict) {
                if (hero && elem in this.monstersDict) {
                    const monster = this.monstersDict[elem];
                    const [canWin, damage] = hero.winMonster([...monster, elem]);
                    
                    // 在怪物右下角绘制损失值
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'right';
                    
                    if (!canWin) {
                        // 打不过显示红色 ???
                        ctx.fillStyle = '#ff0000';
                        ctx.fillText('???', position[0] + this.blocksize - 2, position[1] + this.blocksize - 2);
                    } else if (damage === '0') {
                        // 无伤显示绿色
                        ctx.fillStyle = '#00ff00';
                        ctx.fillText('0', position[0] + this.blocksize - 2, position[1] + this.blocksize - 2);
                    } else {
                        // 有损失显示黄色
                        ctx.fillStyle = '#ffff00';
                        ctx.fillText(damage, position[0] + this.blocksize - 2, position[1] + this.blocksize - 2);
                    }
                }
            }
        }
    }
}
