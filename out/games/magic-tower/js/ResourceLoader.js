/**
 * 资源加载器类
 * 对应Python版本的ResourceLoader类
 */
class ResourceLoader {
    constructor(cfg) {
        this.cfg = cfg;
        this.images = {
            'mapelements': {},
            'hero': {},
            'battlebg': null,
            'blankbg': null,
            'gamebg': null
        };
        this.loadProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }

    /**
     * 加载所有资源
     * @returns {Promise} 加载完成的Promise
     */
    async loadAll() {
        // 计算总资源数
        this.totalAssets = 
            this.cfg.MAP_ELEMENT_IDS.length * 2 + // 每个地图元素有2张图（map0和map1）
            this.cfg.HERO_IMAGES.length +          // 英雄4个方向
            3;                                      // 3张背景图
        
        try {
            // 加载地图元素图片
            await this.loadMapElements();
            
            // 加载英雄图片
            await this.loadHeroImages();
            
            // 加载背景图片
            await this.loadBackgroundImages();
            
            return this.images;
        } catch (error) {
            console.error('资源加载失败:', error);
            throw error;
        }
    }

    /**
     * 加载地图元素图片
     */
    async loadMapElements() {
        const promises = [];
        
        for (const id of this.cfg.MAP_ELEMENT_IDS) {
            this.images.mapelements[id] = [null, null];
            
            // 加载map0图片
            const promise0 = this.loadImage(`resources/images/map0/${id}.png`)
                .then(img => {
                    this.images.mapelements[id][0] = img;
                    this.updateProgress();
                })
                .catch(() => {
                    // 如果图片不存在，使用占位符
                    this.images.mapelements[id][0] = this.createPlaceholder();
                    this.updateProgress();
                });
            
            // 加载map1图片
            const promise1 = this.loadImage(`resources/images/map1/${id}.png`)
                .then(img => {
                    this.images.mapelements[id][1] = img;
                    this.updateProgress();
                })
                .catch(() => {
                    // 如果图片不存在，使用占位符
                    this.images.mapelements[id][1] = this.createPlaceholder();
                    this.updateProgress();
                });
            
            promises.push(promise0, promise1);
        }
        
        await Promise.all(promises);
    }

    /**
     * 加载英雄图片
     */
    async loadHeroImages() {
        const promises = this.cfg.HERO_IMAGES.map(direction => {
            return this.loadImage(`resources/images/player/${direction}.png`)
                .then(img => {
                    this.images.hero[direction] = img;
                    this.updateProgress();
                })
                .catch(() => {
                    this.images.hero[direction] = this.createPlaceholder();
                    this.updateProgress();
                });
        });
        
        await Promise.all(promises);
    }

    /**
     * 加载背景图片
     */
    async loadBackgroundImages() {
        const backgrounds = ['battlebg', 'blankbg', 'gamebg'];
        const promises = backgrounds.map(bg => {
            return this.loadImage(`resources/images/${bg}.png`)
                .then(img => {
                    this.images[bg] = img;
                    this.updateProgress();
                })
                .catch(() => {
                    this.images[bg] = this.createPlaceholder();
                    this.updateProgress();
                });
        });
        
        await Promise.all(promises);
    }

    /**
     * 加载单个图片
     * @param {string} path - 图片路径
     * @returns {Promise<Image>}
     */
    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
            img.src = path;
        });
    }

    /**
     * 创建占位符图片
     * @returns {HTMLCanvasElement}
     */
    createPlaceholder() {
        const canvas = document.createElement('canvas');
        canvas.width = this.cfg.BLOCKSIZE;
        canvas.height = this.cfg.BLOCKSIZE;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#666';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas;
    }

    /**
     * 更新加载进度
     */
    updateProgress() {
        this.loadedAssets++;
        this.loadProgress = (this.loadedAssets / this.totalAssets) * 100;
        
        // 更新进度条
        const progressBar = document.getElementById('loadingProgress');
        if (progressBar) {
            progressBar.style.width = this.loadProgress + '%';
        }
    }
}
