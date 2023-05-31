const url =
"https://api.odcloud.kr/api/15067396/v1/uddi:1ac21e9c-ff05-4911-9772-b19a6310b1c3?page=1&perPage=100&serviceKey=pyrAeFiu8z3NrKs4qD%2FP1uaXIpIel%2ByJs0N3l375UbMi6JUsKsfgu9Ci4oD0ed2Ok5BgtdEE0Pl8o5DVWxyjPA%3D%3D";

var map,marker;
var markers1 = [];
function initTmap(){
  
  //맵 설정
  map = new Tmapv2.Map("map_div", {
    center : new Tmapv2.LatLng(37.56520450, 126.98702028), // 지도 초기 좌표
    width : "100%", // 지도의 넓이
    height : "400px", // 지도의 높이
    zoom : 17
  });

//fetch
fetch(url)
        .then((res) => res.json())
        .then((resJson) => { 
            const contents = resJson.data;

            console.log(contents);

          // 센터 좌표 리스트
          var centers = resJson.data;
          

        for (var i = 0; i < centers.length; i++) {//for문을 통하여 배열 안에 있는 값을 마커 생성
          var lat = centers[i]["기점_위도(WGS84(4326))"];
          var lng = centers[i]["기점_경도(WGS84(4326))"];
          var endLat = centers[i]["종점_위도(WGS84(4326))"];
          var endLng = centers[i]["종점_경도(WGS84(4326))"];
          var lonlat = new Tmapv2.LatLng(lat, lng);
          var title = centers[i]["도로(노선)명"];
          var radius = centers[i]["총길이(km)"]*1000;
          
          // //원그리기
          // var circle = new Tmapv2.Circle({
          //   center: lonlat,	// 중심좌표
          //   radius: radius,	// 원의 반지름. 크기설정
          //   strokeColor: "red",	// 테두리 색상
          //   fillColor: "yellow",	// 원 내부 색상
          //    map: map	// 지도 객체
          // });

          //선 그리기
          var polyline = new Tmapv2.Polyline({
            path: [new Tmapv2.LatLng(lat,lng),	// 선의 꼭짓점 좌표
             new Tmapv2.LatLng(endLat,endLng)],	// 선의 꼭짓점 좌표
           strokeColor: "#dd00dd",	// 라인 색상
           strokeWeight: 6,	// 라인 두께
           map: map	// 지도 객체
         });
          

          //label="<span style='background-color: #46414E;color:white'>"+title+"</span>";
          //Marker 객체 생성.
          marker = new Tmapv2.Marker({
            position : lonlat, //Marker의 중심좌표 설정.
            map : map, //Marker가 표시될 Map 설정.
            title : title, //Marker 타이틀.
            //label : label //Marker의 라벨.
          });

          markers1.push(marker);
      }
      //클러스터 등록
      markerCluster = new Tmapv2.extension.MarkerCluster({
        markers: markers1,
        map: map,
      });
    });
}

