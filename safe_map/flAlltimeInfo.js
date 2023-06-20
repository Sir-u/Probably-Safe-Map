var today = new Date();
var polygonCoordinates;
var isFloodingMarkersVisible = false;
var polygons = [];

function formatDate() {
   var year = today.getFullYear();
   var month = today.getMonth() + 1;
   var day = today.getDate();
   //day = day - 1;

   // 월과 일이 한 자리 수인 경우 앞에 0을 추가하여 두 자리로 만듭니다.
   month = month < 10 ? '0' + month : month;
   day = day < 10 ? '0' + day : day;

   var formattedDate = year + month + day;
   return formattedDate;
}

function getCurrentTime() {
   var minutes = today.getMinutes();
   if (minutes >= 30) {
      var hours = today.getHours().toString().padStart(2, '0');
      return hours + '00';
   } else {
      today.setHours(today.getHours() - 1);
      var hours = today.getHours().toString().padStart(2, '0');
      return hours + '00';
   }
}

var formattedToday = formatDate();
var currentTime = getCurrentTime();

async function weatherResponse() {

   var xhr = new XMLHttpRequest();
   var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'; /*URL*/
   var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'zLzLsz6TwuV3XckkNxeibskoB4TQWO%2B4E0Ob3QC4SLnFpBdhF%2BhH9BEm0%2FdPZPrCYKbtcj12ixLGeX24tWYSig%3D%3D'; /*Service Key*/
   queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
   queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /**/
   queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /**/
   queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(formattedToday); /**/
   queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(currentTime); /**/
   queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); /**/
   queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('124'); /**/

   xhr.open('GET', url + queryParams);
   xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
         var response = JSON.parse(xhr.responseText);
         var pty = response.response.body.items.item[0].obsrValue; //pty값 : 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4), 빗방울(5), 빗방울/눈날림(6), 눈날림(7)
         var rn1 = response.response.body.items.item[2].obsrValue; //1시간 당 강우량 => 35이상일떄 침수 피해 위험

         //pty = 4; rn1 = 40; // 40mm 강우량의 소나기가 1시간 이상 온다고 가정

         if (pty == 1 || pty == 2 || pty == 4 && rn1 >= 35) {
            floodPolygon();
         }
      }
   };
   xhr.send('');
}

function floodPolygon() {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "https://cors-anywhere.herokuapp.com/https://smart.incheon.go.kr/server/rest/services/Hosted/상습_침수구역/FeatureServer/194/query?outFields=*&where=1%3D1&f=geojson");
   xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
         var response = JSON.parse(xhr.responseText);
         var features = response.features;

         // 이전 폴리곤 제거
         for (var k = 0; k < polygons.length; k++) {
            polygons[k].setMap(null);
         }
         polygons = []; // 배열 초기화

         for (var i = 0; i < features.length; i++) {
            var coordinates = features[i].geometry.coordinates;
            var polygonCoordinates = [];

            for (var j = 0; j < coordinates[0].length; j++) {
               var lng = coordinates[0][j][0];
               var lat = coordinates[0][j][1];
               polygonCoordinates.push(new Tmapv2.LatLng(lat, lng));
            }

            var polygon = new Tmapv2.Polygon({
               paths: polygonCoordinates,
               strokeColor: "#461be4",
               strokeWeight: 2,
               fillColor: "#461be4",
               fillOpacity: 0.3,
               map: map
            });

            polygons.push(polygon); // 폴리곤 객체를 배열에 저장합니다.
         }
      }
   };
   xhr.send('');
}

function toggleFlMarkers() {
   // 마커 표시 여부에 따라 마커 표시/삭제 실행
   if (!isFloodingMarkersVisible) {
      console.log("마커를 표시합니다.");
      weatherResponse();
      isFloodingMarkersVisible = true;
      console.log(map.getZoom());
   } else {
      console.log("마커를 삭제합니다.");
      // 모든 폴리곤 제거
      for (var k = 0; k < polygons.length; k++) {
         polygons[k].setMap(null);
      }
      polygons = []; // 배열 초기화
      isFloodingMarkersVisible = false;
   }
}

function toggleFloodingButtonColor() {
   var button = document.getElementById("floodingBtn");
   button.classList.toggle("changeColor_btn");
}

// DOM이 완전히 로드된 후에 요소에 접근할 수 있도록 대기합니다.
document.addEventListener("DOMContentLoaded", function () {
   // 체크박스 요소에 대한 참조를 가져옵니다.
   const floodingBtn = document.getElementById("floodingBtn");

   // 버튼 클릭 이벤트 리스너를 등록합니다.
   floodingBtn.addEventListener("click", toggleFlMarkers);
});
