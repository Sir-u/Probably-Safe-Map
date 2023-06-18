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

  // 가장 가까운 초(1/100) 값의 행을 찾아 격자 X 좌표와 격자 Y 좌표를 출력합니다.
  const closestRow = gridData.find(
    (row) =>
      row.Latitude === closestLatitude && row.Longitude === closestLongitude
  );
  const gridX = closestRow.Grid_X;
  const gridY = closestRow.Grid_Y;
  console.log(`격자 X 좌표: ${gridX}, 격자 Y 좌표: ${gridY}`);
}

// 사용 예시
const latitude = 37.123456; // 입력한 위도 값
const longitude = 127.987654; // 입력한 경도 값
findClosestGrid(latitude, longitude);
