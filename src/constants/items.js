export const ITEMS = {
  WOOD: { id: 'wood', name: '木板',  icon: new URL('../assets/wood.png', import.meta.url).href,  stackable: true, isImage: true },
  STICK: { id: 'stick', name: '木棍', icon: '🥢', stackable: true, isImage: false },
  IRON: { 
    id: 'iron', 
    name: '铁锭', 
    icon: new URL('../assets/iron_ingot.png', import.meta.url).href, 
    stackable: true,
    isImage: true 
  },
  SWORD: { id: 'sword', name: '铁剑', icon: new URL('../assets/Iron_gaozi.png', import.meta.url).href,  stackable: true, isImage: true },
};

export const RECIPES = [
  {
    pattern: [
      ['wood'],
      ['wood']
    ],
    result: { ...ITEMS.STICK, count: 4 }
  },
  {
    pattern: [
      ['iron'],
      ['iron'],
      ['stick']
    ],
    result: { ...ITEMS.SWORD, count: 1 }
  }
];