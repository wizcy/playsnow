/**
 * 游戏主入口
 */

// 全局变量
let config = null;
let resourceLoader = null;
let gameClient = null;

/**
 * 初始化游戏
 */
async function initGame() {
    try {
        // 创建配置
        config = new Config();
        
        // 设置Canvas
        const canvas = document.getElementById('gameCanvas');
        canvas.width = config.SCREENSIZE[0];
        canvas.height = config.SCREENSIZE[1];
        
        // 显示加载界面
        const loadingDiv = document.getElementById('loading');
        loadingDiv.classList.remove('hidden');
        
        // 加载资源
        resourceLoader = new ResourceLoader(config);
        await resourceLoader.loadAll();
        
        // 隐藏加载界面
        loadingDiv.classList.add('hidden');
        
        // 显示开始界面
        const startInterface = new StartGameInterface(config);
        const shouldStart = await startInterface.run(canvas);
        
        if (shouldStart) {
            // 开始游戏
            gameClient = new GameLevels(config, resourceLoader);
            await gameClient.initialize(canvas);
            await gameClient.run();
        } else {
            // 退出游戏
            window.close();
        }
        
    } catch (error) {
        console.error('游戏初始化失败:', error);
        alert('游戏初始化失败，请检查资源文件是否完整！');
    }
}

// 页面加载完成后初始化游戏
window.addEventListener('load', initGame);

// 防止页面滚动
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});
