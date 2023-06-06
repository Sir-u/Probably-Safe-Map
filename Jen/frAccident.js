//서울시 구군 담음
const gugun =
["680",
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
"260"];

function frozenMap(){
//구군따라서 요청url키 달리 해줌

// 맵 설정
  // var map = new Tmapv2.Map("map_div", {
  //   center : new Tmapv2.LatLng(37.52986300, 126.9510350), // 지도 초기 좌표
  //   width : "100%", // 지도의 넓이
  //   height : "400px", // 지도의 높이
  //   zoom : 14
  // });

for (var i = 0; i < gugun.length; i++) {
const frozenUrl = 
"http://apis.data.go.kr/B552061/frequentzoneFreezing/getRestFrequentzoneFreezing?ServiceKey=pyrAeFiu8z3NrKs4qD%2FP1uaXIpIel%2ByJs0N3l375UbMi6JUsKsfgu9Ci4oD0ed2Ok5BgtdEE0Pl8o5DVWxyjPA%3D%3D&searchYearCd=2021&siDo=11&guGun="+gugun[i]+"&numOfRows=10&pageNo=1&type=json"
// var map,marker;
let markers1 = [];


//  //맵 설정
//  map = new Tmapv2.Map("map_div", {
//     center : new Tmapv2.LatLng(37.52986300, 126.9510350), // 지도 초기 좌표
//     width : "100%", // 지도의 넓이
//     height : "400px", // 지도의 높이
//     zoom : 14
//   });



fetch(frozenUrl)
            .then((res) => res.json())
            .then((resJson) => { 
              //구 안의 items를 frozen에 담음.
                const frozen = resJson.items.item;

                console.log(frozen);

                for (var i = 0; i < frozen.length; i++) {

                var lat = frozen[i]["la_crd"];
                var lon = frozen[i]["lo_crd"];
                var lonlat = new Tmapv2.LatLng(lat,lon);
                var title = frozen[i]["spot_nm"];
                }


            markers1 = new Tmapv2.Marker({
            position : lonlat, //Marker의 중심좌표 설정.
            map : map, //Marker가 표시될 Map 설정.
            title : title, //Marker 타이틀.
            //label : label //Marker의 라벨.

          });
            });
          }}