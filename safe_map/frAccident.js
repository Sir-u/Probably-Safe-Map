const gugun = [
  "680",
  "740",
  "305",
  "500",
  "620",
  "215",
  "545",
  "350",
  "320",
  "230",
  "590",
  "440",
  "410",
  "650",
  "200",
  "290",
  "710",
  "470",
  "560",
  "170",
  "380",
  "110",
  "140",
  "260"
];

let markers = []; // 마커들을 담을 배열
let markers1 = [];
let isMarkersVisible = true; // 마커 표시 여부를 나타내는 변수
let latlon = [];
let markerCluster;

var icons = [
  { imageUrl: "https://github.com/Sir-u/Probably-Safe-Map/blob/frost/Jen/icons/%ED%88%AC%EB%AA%85.png?raw=true", size: new Tmapv2.base.Size(35, 35), fontSize: "0px" }];

function accidentMarker() {
  // 이전에 생성된 마커들 제거
  removeMarkers();

  // 구군에 따라서 요청 URL을 생성하고 API에서 데이터 가져오기
  for (let i = 0; i < gugun.length; i++) {
    const frozenUrl = `http://apis.data.go.kr/B552061/frequentzoneFreezing/getRestFrequentzoneFreezing?ServiceKey=pyrAeFiu8z3NrKs4qD%2FP1uaXIpIel%2ByJs0N3l375UbMi6JUsKsfgu9Ci4oD0ed2Ok5BgtdEE0Pl8o5DVWxyjPA%3D%3D&searchYearCd=2021&siDo=11&guGun=${gugun[i]}&numOfRows=10&pageNo=1&type=json`;

    fetch(frozenUrl)
      .then((res) => res.json())
      .then((resJson) => {
        const frozen = resJson.items.item;

        for (let j = 0; j < frozen.length; j++) {
          var lat = frozen[j]["la_crd"];
          var lon = frozen[j]["lo_crd"];
          var lonlat = new Tmapv2.LatLng(lat, lon);
          var title = frozen[j]["spot_nm"];

          var marker = new Tmapv2.Marker({
            position: lonlat,
            map: map,
            icon: 'https://github.com/Sir-u/Probably-Safe-Map/blob/frost/Jen/icons/marker_frost.png?raw=true',
            title: title,
          });

          markers.push(marker);
          markers1.push(marker);
        }
        markerCluster = new Tmapv2.extension.MarkerCluster({
          markers: markers1,
          map: map,
          maxClusterZoom: 10, // 클러스터 적용 레벨 설정 
          icon: icons,
        });
        markerCluster.setIcons(icons)
      });
  }
}

function removeMarkers() {
  // 이전에 생성된 모든 마커 제거
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function toggleFrMarkers() {
  // 마커 표시 여부에 따라 마커 표시/삭제 실행
  if (isMarkersVisible) {
    console.log("마커를 표시합니다.");
    accidentMarker();
    isMarkersVisible = false;
    console.log(map.getZoom());
  } else {
    console.log("마커를 삭제합니다.");
    removeMarkers();
    isMarkersVisible = true;
  }
}

function toggleFrostButtonColor() {
  var button = document.getElementById("frostBtn");
  button.classList.toggle("changeColor_btn");
}

// DOM이 완전히 로드된 후에 요소에 접근할 수 있도록 대기합니다.
document.addEventListener("DOMContentLoaded", function () { //domcontentloaded안하면 안됨..
  // 체크박스 요소에 대한 참조를 가져옵니다.
  const frozenMapCheckbox = document.getElementById('frostBtn');

  // 체크박스의 상태 변경 이벤트 리스너를 추가합니다.
  frozenMapCheckbox.addEventListener('click', toggleFrMarkers);
});

