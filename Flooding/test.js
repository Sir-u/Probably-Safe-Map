function floodPolygon() {
   // 기상청 API 호출
   var weatherXhr = new XMLHttpRequest();
   weatherXhr.open("GET", "기상청 API 주소");
   weatherXhr.onreadystatechange = function () {
      if (weatherXhr.readyState === 4 && weatherXhr.status === 200) {
         var weatherResponse = JSON.parse(weatherXhr.responseText);
         var isRaining = weatherResponse.rain; // 비가 오는지 여부 확인

         if (isRaining) {
            // 상습 침수 구역 정보 가져오기
            var floodXhr = new XMLHttpRequest();
            floodXhr.open("GET", "https://cors-anywhere.herokuapp.com/https://smart.incheon.go.kr/server/rest/services/Hosted/상습_침수구역/FeatureServer/194/query?outFields=*&where=1%3D1&f=geojson");
            floodXhr.onreadystatechange = function () {
               if (floodXhr.readyState === 4 && floodXhr.status === 200) {
                  var response = JSON.parse(floodXhr.responseText);
                  //var features = response.features;
                  console.log("features");
                  console.log(response);

                  for (var i = 0; i < features.length; i++) {
                     var coordinates = features[i].geometry.coordinates;
                     var polygonCoordinates = [];
                     console.log("coordinates");
                     console.log(coordinates);
                     console.log("coordinates[0][0]");
                     console.log(coordinates[0][0]);
                     for (var j = 0; j < coordinates[0].length; j++) {
                        var lng = coordinates[0][j][0];
                        console.log("lng");
                        console.log(lng);
                        var lat = coordinates[0][j][1];
                        polygonCoordinates.push(new Tmapv2.LatLng(lat, lng));
                     }
                     console.log("polygonCoordinates");
                     console.log(polygonCoordinates);

                     var polygon = new Tmapv2.Polygon({
                        paths: polygonCoordinates,
                        strokeColor: "#FF0000",
                        strokeWeight: 2,
                        fillColor: "#FF0000",
                        fillOpacity: 0.3,
                        map: map
                     });
                  }
               }
            };
            floodXhr.send();
         }
      }
   };
   weatherXhr.send();
}