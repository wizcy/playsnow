# 魔塔游戏 H5 移植版

## 项目说明

这是将Python版魔塔游戏完整移植到H5的版本，使用纯JavaScript开发，可以在浏览器中直接运行。

## 文件结构

```
magictower-h5/
├── index.html                 # 主HTML文件
├── css/
│   └── style.css             # 样式文件
├── js/
│   ├── config.js             # 游戏配置
│   ├── ResourceLoader.js     # 资源加载器
│   ├── MapParser.js          # 地图解析器
│   ├── Hero.js               # 英雄类
│   ├── GameLevels.js         # 游戏主逻辑
│   ├── StartGameInterface.js # 开始界面
│   └── main.js               # 主入口
└── resources/                # 游戏资源（需要从Python版本复制）
    ├── images/
    │   ├── map0/            # 地图元素图片（第一帧）
    │   ├── map1/            # 地图元素图片（第二帧）
    │   ├── player/          # 玩家图片
    │   ├── battlebg.png     # 战斗背景
    │   ├── blankbg.png      # 空白背景
    │   └── gamebg.png       # 游戏背景
    ├── fonts/               # 字体文件（可选，使用系统字体）
    └── levels/              # 地图文件（.lvl）
        ├── 0.lvl
        ├── 1.lvl
        └── ...
```

## 资源迁移步骤

### 1. 复制图片资源

```bash
# 在项目根目录执行
cp -r ../magictower_副本/resources/images ./resources/
```

### 2. 复制地图文件

```bash
# 复制所有地图文件
cp -r ../magictower_副本/resources/levels ./resources/
```

### 3. 复制字体文件（可选）

```bash
# 如果需要使用原版字体
cp -r ../magictower_副本/resources/fonts ./resources/
```

## 运行方式

### 方法1: 使用本地HTTP服务器（推荐）

由于浏览器的跨域限制，需要通过HTTP服务器运行：

```bash
# 使用Python 3
cd magictower-h5
python3 -m http.server 8000

# 或使用Node.js的http-server
npx http-server -p 8000
```

然后在浏览器中访问：http://localhost:8000

### 方法2: 使用VS Code的Live Server扩展

1. 安装Live Server扩展
2. 右键点击index.html
3. 选择"Open with Live Server"

## 核心功能实现

### 已完成的核心功能

1. ✅ **基础框架**
   - Canvas渲染系统
   - 资源加载系统
   - 游戏配置管理

2. ✅ **地图系统**
   - 地图文件解析
   - 地图渲染（支持动画切换）
   - 28个关卡支持

3. ✅ **英雄系统**
   - 英雄移动（WASD/方向键）
   - 属性管理（生命、攻击、防御等）
   - 碰撞检测
   - 战斗系统
   - 宝物系统

4. ✅ **游戏逻辑**
   - 楼层切换
   - 开门系统（黄/蓝/红钥匙）
   - 物品拾取
   - 怪物战斗
   - 掉落系统

5. ✅ **UI系统**
   - 开始界面
   - 游戏说明
   - 左侧信息面板
   - 物品获得提示

6. ✅ **存档系统**
   - 使用localStorage保存/加载游戏
   - 保存英雄状态和地图状态

### 需要补充的功能

以下功能已在代码中预留接口，但需要进一步实现完整逻辑：

1. **对话系统**
   - 仙女对话（多个场景）
   - 盗贼对话
   - 公主对话
   - 老人/商人对话
   - 魔王对话

2. **商店系统**
   - 第3层商店
   - 第11层商店
   - 第5/13层老人
   - 第5/12层商人

3. **特殊功能**
   - 楼层跳转界面（J键）
   - 怪物预测界面（L键）
   - 铁门机关（部分已实现）

## 与Python版本的对应关系

| Python文件 | H5文件 | 说明 |
|-----------|--------|------|
| game.py -> Config | config.js | 游戏配置 |
| game.py -> ResourceLoader | ResourceLoader.js | 资源加载 |
| modules/maps/mapparser.py | MapParser.js | 地图解析 |
| modules/sprites/hero.py | Hero.js | 英雄类 |
| modules/gamelevels.py | GameLevels.js | 游戏主逻辑 |
| modules/interfaces/start.py | StartGameInterface.js | 开始界面 |
| game.py -> main() | main.js | 主入口 |

## 关键技术点

### 1. Canvas渲染
使用HTML5 Canvas进行2D图形渲染，替代Pygame的screen.blit()

### 2. 异步资源加载
使用Promise和async/await处理图片和地图文件的异步加载

### 3. 游戏循环
使用requestAnimationFrame实现60fps游戏循环，替代Pygame的clock.tick()

### 4. 事件处理
使用DOM事件监听器处理键盘和鼠标事件

### 5. 数据持久化
使用localStorage替代JSON文件进行存档

## 待完成事项

1. **补充对话内容**
   - 将Python版本中所有对话内容转换到JavaScript
   - 实现对话框的显示逻辑

2. **完善商店系统**
   - 实现购买界面
   - 实现选择逻辑

3. **完善特殊功能**
   - 楼层跳转界面
   - 怪物预测界面

4. **测试和优化**
   - 完整测试所有28个关卡
   - 测试所有NPC对话
   - 优化性能
   - 修复bug

## 开发建议

1. 建议使用浏览器的开发者工具进行调试
2. 可以在Console中直接访问全局变量gameClient, hero等进行调试
3. 出现问题时检查浏览器Console的错误信息
4. 地图文件路径和图片路径要正确

## 注意事项

1. 确保所有资源文件都已正确复制到resources目录
2. 必须通过HTTP服务器运行，不能直接打开HTML文件
3. 浏览器需要支持ES6语法
4. 建议使用Chrome、Firefox或Edge浏览器

## 版权说明

- 原游戏素材来自: http://www.4399.com/flash/1749_1.htm
- Python版本作者: Charles, wizcy
- H5版本移植: AI辅助完成
- 仅供学习交流使用，请勿用于商业用途
