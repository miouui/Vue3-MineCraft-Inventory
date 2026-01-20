<template>
  <div class="mc-container">
    <div class="section-title">合成</div>
    <div class="crafting-wrapper">
      <div class="crafting-grid">
        <div v-for="r in 3" :key="r" class="grid-row">
          <div v-for="c in 3" :key="c" class="slot">
          </div>
        </div>
      </div>

      <div class="arrow">➡️</div>

      <div class="slot result-slot">
        <!-- <span class="item-icon">🥢</span>
        <span class="count-tag">4</span> -->
      </div>
    </div>

    <div class="section-title">
      <span>背包</span>
      <button class="mc-button">整理</button>
    </div>
    
    <div class="inventory-grid">
      <div v-for="i in 27" :key="i" class="slot">

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. 整体容器：模拟 MC 菜单背景色和边框 */
.mc-container {
  background-color: #c6c6c6;
  padding: 20px;
  border: 4px solid;
  border-color: #ffffff #555555 #555555 #ffffff; /* 模拟凸起边缘 */
  display: inline-block;
  font-family: 'Courier New', Courier, monospace;
  user-select: none;
}

/* 2. 标题和按钮 */
.section-title {
  color: #3f3f3f;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mc-button {
  background: #c6c6c6;
  border: 2px solid;
  border-color: #ffffff #555555 #555555 #ffffff;
  cursor: pointer;
  padding: 4px 10px;
  font-size: 12px;
  color: #3f3f3f;
}

.mc-button:active {
  border-color: #555555 #ffffff #ffffff #555555;
}

/* 3. 核心网格单元 (Slot) */
.slot {
  width: 50px;
  height: 50px;
  background-color: #8b8b8b;
  border: 3px solid;
  /* 经典的 MC 内凹槽边框色 */
  border-color: #373737 #ffffff #ffffff #373737; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
}

.slot:hover {
  background-color: #b0b0b0;
  outline: 2px solid white; 
  z-index: 10;
}

/* 4. 合成区域布局 */
.crafting-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.grid-row {
  display: flex;
}

.arrow {
  font-size: 30px;
  color: #3f3f3f;
  text-shadow: 2px 2px #ffffff;
}

/* 5. 产物格特殊样式 */
.result-slot {
  width: 62px;
  height: 62px;
  border-width: 4px;
}

/* 6. 背包布局 */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(9, 50px); /* 9列 */
  gap: 2px;
}

/* 7. 物品和数字标签 */
.item-icon {
  font-size: 30px;
}

.item-image {
  width: 32px;
  height: 32px;
  image-rendering: pixelated; /* 保证像素风格不模糊 */
}

.count-tag {
  position: absolute;
  bottom: 2px;
  right: 4px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  /* 黑色投影效果 */
  text-shadow: 2px 2px 0px #3f3f3f;
  pointer-events: none;
}
</style>