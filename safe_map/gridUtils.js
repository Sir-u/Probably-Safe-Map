// gridUtils.js
const gridData = require('./grid_data.json');


function findClosestGrid(latitude, longitude) {
  // 입력한 위도와 경도와의 거리를 계산하는 함수를 정의합니다.
  function distance(lat1, lon1, lat2, lon2) {
    return Math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2);
  }

  // 가장 가까운 초(1/100) 값을 찾기 위한 초기값 설정
  let closestLatitude = null;
  let closestLongitude = null;
  let closestDistance = Infinity;

  // 데이터 배열을 순회하며 가장 가까운 초(1/100) 값을 찾습니다.
  for (let i = 0; i < gridData.length; i++) {
    const gridLatitude = gridData[i].Latitude;
    const gridLongitude = gridData[i].Longitude;
    const d = distance(latitude, longitude, gridLatitude, gridLongitude);

    if (d < closestDistance) {
      closestLatitude = gridLatitude;
      closestLongitude = gridLongitude;
      closestDistance = d;
    }
  }

  // 가장 가까운 초(1/100) 값의 행을 찾아 격자 X 좌표와 격자 Y 좌표를 반환합니다.
  const closestRow = gridData.find(
    (row) =>
      row.Latitude === closestLatitude && row.Longitude === closestLongitude
  );

  if (closestRow) {
    const gridX = closestRow.Grid_X;
    const gridY = closestRow.Grid_Y;
    return { gridX, gridY };
  } else {
    return null;
  }
}

module.exports = {
  findClosestGrid
};
