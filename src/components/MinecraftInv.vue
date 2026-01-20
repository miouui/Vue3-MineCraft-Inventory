<template>
  <div class="mc-container" @dragover.prevent>
    <div class="section-title">合成</div>
    <div class="crafting-wrapper">
      <div class="crafting-grid" @dragover.prevent>
        <div v-for="(row, r) in craftingGrid" :key="r" class="grid-row">
          <div v-for="(slot, c) in row" :key="c" class="slot" 
            @dragover.prevent
            @drop.stop="handleDrop('CRAFT', { r, c })" 
            @dragstart="handleDragStart('CRAFT', { r, c })"
            @dragend="handleDragEnd"
            @mouseenter="hoveredSlot = { type: 'CRAFT', pos: { r, c } }" 
            @mouseleave="hoveredSlot = null"
            draggable="true">
            <template v-if="slot">
              <img v-if="slot.isImage" :src="slot.icon" class="item-image" />
              <span v-else class="item-icon">{{ slot.icon }}</span>
              <span class="count-tag">{{ slot.count }}</span>
            </template>
          </div>
        </div>
      </div>

      <div class="arrow">➡️</div>

      <div class="slot result-slot" @click="takeResult">
        <template v-if="result">
          <img v-if="result.isImage" :src="result.icon" class="item-image" />
          <span v-else class="item-icon">{{ result.icon }}</span>
          <span class="count-tag">{{ result.count }}</span>
        </template>
      </div>
    </div>

    <div class="section-title">
      <span>背包 (指向物品按 E 平分)</span>
      <button @click="sortInv">快速排序</button>
    </div>

    <div class="inventory-grid" @dragover.prevent>
      <div v-for="(slot, i) in inventory" :key="i" class="slot" 
        @dragover.prevent 
        @drop.stop="handleDrop('INV', i)"
        @dragstart="handleDragStart('INV', i)" 
        @dragend="handleDragEnd"
        @mouseenter="hoveredSlot = { type: 'INV', pos: i }"
        @mouseleave="hoveredSlot = null" 
        draggable="true">
        <template v-if="slot">
          <img v-if="slot.isImage" :src="slot.icon" class="item-image" />
          <span v-else class="item-icon">{{ slot.icon }}</span>
          <span class="count-tag">{{ slot.count }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { ITEMS, RECIPES } from '../constants/items';
import { findRecipe } from '../utils/inventoryLogic';

const inventory = ref(new Array(27).fill(null));
inventory.value[0] = { ...ITEMS.WOOD, count: 64 };
inventory.value[1] = { ...ITEMS.IRON, count: 10 };

const craftingGrid = reactive([
  [null, null, null], [null, null, null], [null, null, null]
]);

const result = ref(null);
const hoveredSlot = ref(null);
let draggingSource = null; 

const handleDragStart = (type, pos) => {
  draggingSource = { type, pos };
  if (event.target && event.target.style) {
    event.target.style.opacity = '0.5';
  }
};

const handleDragEnd = (event) => {
  if (event.target && event.target.style) {
    event.target.style.opacity = '1';
  }
  draggingSource = null;
};

const handleDrop = (targetType, targetPos) => {
  if (!draggingSource) return;
  const isSameType = draggingSource.type === targetType;
  const isSamePos = isSameType && (
    targetType === 'INV' 
      ? draggingSource.pos === targetPos 
      : (draggingSource.pos.r === targetPos.r && draggingSource.pos.c === targetPos.c)
  );

  if (isSamePos) {
    draggingSource = null;
    return;
  }

  const sourceItem = draggingSource.type === 'INV' 
    ? inventory.value[draggingSource.pos] 
    : craftingGrid[draggingSource.pos.r][draggingSource.pos.c];

  if (!sourceItem) return;

  const setTarget = (val) => {
    if (targetType === 'INV') inventory.value[targetPos] = val;
    else craftingGrid[targetPos.r][targetPos.c] = val;
  };
  const setSource = (val) => {
    if (draggingSource.type === 'INV') inventory.value[draggingSource.pos] = val;
    else craftingGrid[draggingSource.pos.r][draggingSource.pos.c] = val;
  };

  const targetItem = targetType === 'INV' 
    ? inventory.value[targetPos] 
    : craftingGrid[targetPos.r][targetPos.c];

  if (targetItem && targetItem.id === sourceItem.id && sourceItem.stackable) {
    setTarget({ ...targetItem, count: targetItem.count + sourceItem.count });
    setSource(null);
  } else {
    const tempSource = { ...sourceItem };
    const tempTarget = targetItem ? { ...targetItem } : null;
    setTarget(tempSource);
    setSource(tempTarget);
  }

  draggingSource = null;
};

const handleKeyDown = (e) => {
  if (e.key.toLowerCase() === 'e' && hoveredSlot.value) {
    const { type, pos } = hoveredSlot.value;
    const item = type === 'INV' ? inventory.value[pos] : craftingGrid[pos.r][pos.c];
    if (item && item.count > 1) {
      const half = Math.floor(item.count / 2);
      const remain = item.count - half;
      const emptyIdx = inventory.value.findIndex(s => s === null);
      if (emptyIdx !== -1) {
        item.count = remain;
        inventory.value[emptyIdx] = { ...item, count: half };
      }
    }
  }
};

const sortInv = () => {
  const summary = {};
  inventory.value.forEach(item => {
    if (item) {
      if (summary[item.id]) summary[item.id].count += item.count;
      else summary[item.id] = JSON.parse(JSON.stringify(item));
    }
  });
  const sorted = Object.values(summary).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
  const newInv = new Array(27).fill(null);
  sorted.forEach((item, index) => { if (index < 27) newInv[index] = item; });
  inventory.value = newInv;
};

watch(craftingGrid, () => { result.value = findRecipe(craftingGrid, RECIPES); }, { deep: true });

const takeResult = () => {
  if (!result.value) return;
  const emptyIdx = inventory.value.findIndex(s => s === null);
  if (emptyIdx !== -1) {
    inventory.value[emptyIdx] = JSON.parse(JSON.stringify(result.value));
    craftingGrid.forEach((row, r) => {
      row.forEach((slot, c) => {
        if (slot) {
          slot.count--;
          if (slot.count <= 0) craftingGrid[r][c] = null;
        }
      });
    });
  }
};

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
</script>

<style scoped>
.mc-container {
  background-color: #c6c6c6;
  padding: 20px;
  border: 4px solid;
  border-color: #ffffff #555555 #555555 #ffffff;
  display: inline-block;
}
.section-title {
  color: #3f3f3f;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.crafting-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}
.slot {
  width: 50px;
  height: 50px;
  background-color: #8b8b8b;
  border: 3px solid;
  border-color: #373737 #ffffff #ffffff #373737;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.slot:hover { outline: 2px solid white; z-index: 10; }
.item-image { width: 32px; height: 32px; image-rendering: pixelated; }
.count-tag {
  position: absolute;
  bottom: 2px; right: 4px;
  color: white; font-size: 16px; font-weight: bold;
  text-shadow: 2px 2px 0px #3f3f3f;
  pointer-events: none;
}
.inventory-grid { display: grid; grid-template-columns: repeat(9, 54px); gap: 2px; }
.grid-row { display: flex; }
.arrow { font-size: 30px; }
.result-slot { width: 60px; height: 60px; border-width: 4px; }
button { background: #c6c6c6; border: 2px solid; border-color: #fff #555 #555 #fff; cursor: pointer; padding: 2px 8px; }
</style>