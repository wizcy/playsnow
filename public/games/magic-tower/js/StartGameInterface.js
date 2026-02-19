/**
 * 游戏开始界面
 * 对应Python版本的StartGameInterface类
 */
class StartGameInterface {
    constructor(cfg) {
        this.cfg = cfg;
        this.selectedIndex = 0;
        this.buttons = ['开始游戏', '游戏说明', '离开游戏'];
        this.showIntro = false;
    }

    /**
     * 运行开始界面
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @returns {Promise<boolean>} 是否开始游戏
     */
    run(canvas) {
        return new Promise((resolve) => {
            const ctx = canvas.getContext('2d');
            let animationId = null;
            
            // 鼠标位置
            let mousePos = { x: 0, y: 0 };
            
            // 鼠标移动事件
            const mouseMoveHandler = (e) => {
                const rect = canvas.getBoundingClientRect();
                mousePos.x = e.clientX - rect.left;
                mousePos.y = e.clientY - rect.top;
                
                // 检测鼠标悬停在哪个按钮上
                for (let i = 0; i < this.buttons.length; i++) {
                    const buttonY = canvas.height - 300 + i * 100;
                    if (mousePos.y >= buttonY - 25 && mousePos.y <= buttonY + 25) {
                        this.selectedIndex = i;
                    }
                }
            };
            
            // 鼠标点击事件
            const clickHandler = (e) => {
                const rect = canvas.getBoundingClientRect();
                mousePos.x = e.clientX - rect.left;
                mousePos.y = e.clientY - rect.top;
                
                // 检测点击了哪个按钮
                for (let i = 0; i < this.buttons.length; i++) {
                    const buttonY = canvas.height - 300 + i * 100;
                    if (mousePos.y >= buttonY - 25 && mousePos.y <= buttonY + 25) {
                        if (i === 0) {
                            // 开始游戏
                            cleanup();
                            resolve(true);
                        } else if (i === 1) {
                            // 游戏说明
                            this.showIntro = true;
                        } else if (i === 2) {
                            // 离开游戏
                            cleanup();
                            resolve(false);
                        }
                    }
                }
                
                // 如果在游戏说明界面，点击返回
                if (this.showIntro) {
                    this.showIntro = false;
                }
            };
            
            // 键盘事件
            const keyHandler = (e) => {
                if (e.key === 'ArrowUp' || e.key === 'w') {
                    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
                } else if (e.key === 'ArrowDown' || e.key === 's') {
                    this.selectedIndex = Math.min(2, this.selectedIndex + 1);
                } else if (e.key === 'Enter' || e.key === ' ') {
                    if (this.selectedIndex === 0) {
                        cleanup();
                        resolve(true);
                    } else if (this.selectedIndex === 1) {
                        this.showIntro = true;
                    } else if (this.selectedIndex === 2) {
                        cleanup();
                        resolve(false);
                    }
                } else if (e.key === 'Escape' && this.showIntro) {
                    this.showIntro = false;
                }
            };
            
            canvas.addEventListener('mousemove', mouseMoveHandler);
            canvas.addEventListener('click', clickHandler);
            window.addEventListener('keydown', keyHandler);
            
            const cleanup = () => {
                canvas.removeEventListener('mousemove', mouseMoveHandler);
                canvas.removeEventListener('click', clickHandler);
                window.removeEventListener('keydown', keyHandler);
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
            
            // 渲染循环
            const render = () => {
                // 清空画布
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                if (this.showIntro) {
                    this.drawIntro(ctx, canvas);
                } else {
                    this.drawMenu(ctx, canvas);
                }
                
                animationId = requestAnimationFrame(render);
            };
            
            render();
        });
    }

    /**
     * 绘制主菜单
     */
    drawMenu(ctx, canvas) {
        // 绘制标题 - 魔塔
        ctx.fillStyle = '#fff';
        ctx.font = `80px ${this.cfg.FONT_FAMILY}`;
        ctx.textAlign = 'center';
        ctx.fillText('魔塔', canvas.width / 2, 100);
        
        // 绘制英文标题
        ctx.font = '80px Arial, sans-serif';
        ctx.fillText('Magic Tower', canvas.width / 2, 250);
        
        // 绘制版本号
        ctx.font = `40px ${this.cfg.FONT_FAMILY}`;
        ctx.fillText('(Ver H5 1.0)', canvas.width / 2, 310);
        
        // 绘制按钮
        for (let i = 0; i < this.buttons.length; i++) {
            const buttonY = canvas.height - 300 + i * 100;
            
            if (this.selectedIndex === i) {
                ctx.fillStyle = '#ff0';
                ctx.font = `bold 50px ${this.cfg.FONT_FAMILY}`;
            } else {
                ctx.fillStyle = '#fff';
                ctx.font = `50px ${this.cfg.FONT_FAMILY}`;
            }
            
            ctx.fillText(this.buttons[i], canvas.width / 2, buttonY);
        }
    }

    /**
     * 绘制游戏说明
     */
    drawIntro(ctx, canvas) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = `${this.cfg.FONT_SIZE_SMALL}px ${this.cfg.FONT_FAMILY}`;
        ctx.textAlign = 'center';
        
        const introTexts = [
            '魔塔小游戏 H5版本',
            '游戏素材来自: http://www.4399.com/flash/1749_1.htm',
            '游戏背景故事为公主被大魔王抓走, 需要勇士前往魔塔将其救出',
            '原作者: Charles. 学习改造：wizcy. H5移植: AI',
            '操作说明:',
            'WASD或方向键 - 移动',
            'J键 - 楼层跳转 (需要风之罗盘)',
            'L键 - 查看怪物信息 (需要圣光徽)',
            'B键 - 保存游戏',
            'N键 - 加载游戏',
            'V1.13版本降低难度，增加怪物掉落红蓝宝石，极低概率掉落钻石剑盾',
            '',
            '点击任意位置返回'
        ];
        
        for (let i = 0; i < introTexts.length; i++) {
            ctx.fillText(introTexts[i], canvas.width / 2, 50 + i * 35);
        }
    }
}
