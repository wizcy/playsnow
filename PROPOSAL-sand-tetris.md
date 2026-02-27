# PROPOSAL-sand-tetris.md
# 流沙俄罗斯方块 — 技术方案

> 项目：playsnow.top
> 任务：TASK-012
> 日期：2026-02-27

---

## 一、技术选型

- 纯 HTML5 Canvas + Vanilla JS，单文件 `index.html`
- 零依赖，零构建
- 目标帧率：60fps
- 移动端：触摸手势支持

---

## 二、网格设计

```
Canvas 尺寸：320px × 640px（游戏区） + 120px（右侧面板）
沙粒大小：4px × 4px
逻辑网格：80列 × 160行
```

用 `Uint32Array(80 * 160)` 存储网格，每格存 RGBA 颜色值，0 = 空。

方块坐标系（格子单位）= 沙粒坐标系 / 4，落地时每个方块格子展开为 4×4=16 粒沙。

---

## 三、方块系统

标准7种形状，每种对应固定颜色：

| 形状 | 颜色 |
|------|------|
| I | 青色 #00FFFF |
| O | 黄色 #FFD700 |
| T | 紫色 #9B59B6 |
| S | 绿色 #2ECC71 |
| Z | 红色 #E74C3C |
| J | 蓝色 #3498DB |
| L | 橙色 #E67E22 |

方块在顶部以"整块"形式移动旋转，**触底瞬间**分解为沙粒写入 grid。

---

## 四、主循环（每帧执行顺序）

```
1. 处理输入（左/右/旋转/加速）
2. 当前方块自动下落计时
3. 碰撞检测 → 触底则 lockPiece()
4. updateSand()  ← 沙粒物理，最耗性能
5. checkLines()  ← 消行检测
6. render()
```

---

## 五、沙粒物理算法

**从底部往上逐行扫描**（避免同帧连续移动）：

```javascript
function updateSand() {
  for (let row = ROWS - 2; row >= 0; row--) {
    // 随机左右扫描方向，避免方向偏差
    const leftToRight = Math.random() > 0.5;
    for (let i = 0; i < COLS; i++) {
      const col = leftToRight ? i : COLS - 1 - i;
      if (grid[row * COLS + col] === 0) continue;

      const color = grid[row * COLS + col];
      const below = (row + 1) * COLS + col;

      // 优先：正下方
      if (grid[below] === 0) {
        grid[below] = color;
        grid[row * COLS + col] = 0;
        continue;
      }
      // 次选：随机左下或右下
      const dl = col - 1, dr = col + 1;
      const tryLeft  = dl >= 0    && grid[(row+1)*COLS + dl] === 0;
      const tryRight = dr < COLS  && grid[(row+1)*COLS + dr] === 0;

      if (tryLeft && tryRight) {
        const c = Math.random() > 0.5 ? dl : dr;
        grid[(row+1)*COLS + c] = color;
        grid[row*COLS + col] = 0;
      } else if (tryLeft) {
        grid[(row+1)*COLS + dl] = color;
        grid[row*COLS + col] = 0;
      } else if (tryRight) {
        grid[(row+1)*COLS + dr] = color;
        grid[row*COLS + col] = 0;
      }
      // 否则静止
    }
  }
}
```

---

## 六、方块分解

```javascript
function lockPiece(piece) {
  for (const [r, c] of piece.blocks()) {   // 方块格子坐标
    for (let dr = 0; dr < 4; dr++) {
      for (let dc = 0; dc < 4; dc++) {
        const sr = r * 4 + dr;
        const sc = c * 4 + dc;
        if (sr < ROWS && sc < COLS) {
          grid[sr * COLS + sc] = piece.color;
        }
      }
    }
  }
  spawnNext();
}
```

---

## 七、消行逻辑

密度阈值定为 **85%**（比90%更宽松，沙粒堆积不规则，85%手感更好）：

```javascript
function checkLines() {
  let cleared = 0;
  for (let row = ROWS - 1; row >= 0; row--) {
    let count = 0;
    for (let col = 0; col < COLS; col++) {
      if (grid[row * COLS + col] !== 0) count++;
    }
    if (count / COLS >= 0.85) {
      // 清空这行
      for (let col = 0; col < COLS; col++) {
        grid[row * COLS + col] = 0;
      }
      cleared++;
      row++; // 重新检查当前行（上方沙粒会落下来）
    }
  }
  if (cleared > 0) updateScore(cleared);
}
```

消行后不需要手动移动上方内容——下一帧 `updateSand()` 会自动让上方沙粒受重力下落，这正是流沙版最好看的效果。

---

## 八、性能优化

沙粒上限约 80×160=12800 粒，每帧全扫有压力，两个优化：

**优化1：稳定标记**
用第二个 `Uint8Array stable[]` 标记连续3帧未移动的沙粒，跳过物理计算。消行时重置附近区域的 stable 标记。

**优化2：活跃行范围**
记录 `minActiveRow`，只扫描有活跃沙粒的行以上区域。

---

## 九、操作方式

| 操作 | 键盘 | 移动端 |
|------|------|--------|
| 左移 | ← | 左滑 |
| 右移 | → | 右滑 |
| 旋转 | ↑ / Z | 点击 |
| 加速下落 | ↓ | 下滑 |
| 硬降 | 空格 | 双击 |

---

## 十、视觉风格

- 背景：深灰 `#1a1a2e`，营造夜晚沙漠感
- 网格线：极淡 `rgba(255,255,255,0.03)`
- 沙粒：每粒略有亮度随机偏差（±10%），避免色块感
- 消行特效：消行瞬间该行沙粒变白闪烁一帧
- 右侧面板：下一块预览 + 分数 + 等级 + 消行数

---

## 十一、文件结构

```
games/sand-tetris/
├── index.html    # 单文件，内嵌全部 CSS + JS（预计 ~300行）
└── cover.png     # 400×300，游戏截图
```

`src/games.ts` 新增：
```typescript
{
  id: 'sand-tetris',
  title: { zh: '流沙俄罗斯方块', en: 'Sand Tetris' },
  description: {
    zh: '方块落地后化为沙粒自然堆积，消行时沙粒重新流动',
    en: 'Blocks dissolve into sand particles with realistic physics'
  },
  tags: ['puzzle', 'physics', 'classic'],
  path: '/games/sand-tetris/'
}
```

---

## 十二、验收标准

- [ ] 方块落地后正确分解为 4×4 沙粒
- [ ] 沙粒物理：正下 > 左下/右下 > 静止，效果自然
- [ ] 消行密度 85% 触发，消行后沙粒自然下落
- [ ] 60fps 无卡顿（Chrome + Safari）
- [ ] 移动端触摸操作流畅
- [ ] 游戏结束检测：沙粒堆到第3行触发
- [ ] 分数：1消=100，2消=300，3消=500，4消=800（×等级倍率）

