// app.js
const gridUtils = require('./gridUtils.js');

const latitude = 37.73456; // 입력한 위도 값
const longitude = 126.687654; // 입력한 경도 값
const closestGrid = gridUtils.findClosestGrid(latitude, longitude);

if (closestGrid) {
  const { gridX, gridY } = closestGrid;
  console.log(`격자 X 좌표: ${gridX}, 격자 Y 좌표: ${gridY}`);
} else {
  console.log('가장 가까운 격자를 찾을 수 없습니다.');
}
