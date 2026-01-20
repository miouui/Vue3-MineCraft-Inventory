/**
 * 修剪矩阵：移除 3x3 网格周围多余的 null
 */
export function trimMatrix(matrix) {
  let rows = matrix.length;
  let cols = matrix[0].length;
  let minRow = rows, maxRow = -1, minCol = cols, maxCol = -1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c]) {
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  if (maxRow === -1) return []; 

  return matrix.slice(minRow, maxRow + 1).map(row => 
    row.slice(minCol, maxCol + 1)
  );
}

/**
 * 比较合成区与配方
 */
export function findRecipe(craftingGrid, recipes) {
  const currentMatrix = craftingGrid.map(row => row.map(item => item?.id || null));
  const trimmedCurrent = JSON.stringify(trimMatrix(currentMatrix));

  for (const recipe of recipes) {
    if (JSON.stringify(trimMatrix(recipe.pattern)) === trimmedCurrent) {
      return JSON.parse(JSON.stringify(recipe.result));
    }
  }
  return null;
}