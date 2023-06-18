const myData =
    "https://api.odcloud.kr/api/15067396/v1/uddi:1ac21e9c-ff05-4911-9772-b19a6310b1c3?page=1&perPage=100&serviceKey=pyrAeFiu8z3NrKs4qD%2FP1uaXIpIel%2ByJs0N3l375UbMi6JUsKsfgu9Ci4oD0ed2Ok5BgtdEE0Pl8o5DVWxyjPA%3D%3D";
// //출발지,도착지 마커
// var marker_s, marker_e, marker_p;

//경로그림정보


var resultdrawArr = [];

// var startX = "126.9850380932383";
// var startY = "37.566567545861645";
// var endX = "127.10331814639885";
// var endY = "37.403049076341794";

function routeTmap_fr(startX, startY, endX, endY) {
    var drawInfoArr = [];

    //var searchOption = $("9").val();

    var trafficInfochk = $("#year").val();
    var headers = {};
    headers["appKey"] = "3KpXgMcaMY4s4BLd0y68867oI2fUOuos4t9kNemn";


    //JSON TYPE EDIT [S]
    $.ajax({
        type: "POST",
        headers: headers,
        url: "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result&appKey=3KpXgMcaMY4s4BLd0y68867oI2fUOuos4t9kNemn",
        async: false,
        data: {
            "startX": startX,
            "startY": startY,
            "endX": endX,
            "endY": endY,
            "reqCoordType": "WGS84GEO", //위도경도
            "resCoordType": "EPSG3857", //또다른 위치표시방법
            "searchOption": "10",
            "trafficInfo": trafficInfochk
        },
        success: function (response) {

            var resultData = response.features; //response로 받아온다

            for (var i in resultData) { //for문 [S]
                var geometry = resultData[i].geometry;
                var properties = resultData[i].properties;

                if (geometry.type == "LineString") {
                    for (var j in geometry.coordinates) {
                        // 경로들의 결과값들을 포인트 객체로 변환 
                        var latlng = new Tmapv2.Point(
                            geometry.coordinates[j][0],
                            geometry.coordinates[j][1]); //위치 받아오는 중 ESPSG어쩌구로

                        // 포인트 객체를 받아 좌표값으로 변환
                        var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(//위도경도로 변환
                            latlng);
                        //console.log(convertPoint);
                        // 포인트객체의 정보로 좌표값 변환 객체로 저장
                        var convertChange = new Tmapv2.LatLng(
                            convertPoint._lat,
                            convertPoint._lng);
                        // 배열에 담기
                        drawInfoArr
                            .push(convertChange);
                    }

                    //traffic 정보 x


                    drawLine_fr(drawInfoArr,
                        "0");

                } else {

                    var markerImg = "";
                    var pType = "";

                    if (properties.pointType == "S") { //출발지 마커
                        markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
                        pType = "S";
                    } else if (properties.pointType == "E") { //도착지 마커
                        markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
                        pType = "E";
                    } else { //각 포인트 마커
                        markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
                        pType = "P"
                    }

                    // 경로들의 결과값들을 포인트 객체로 변환 
                    var latlon = new Tmapv2.Point(
                        geometry.coordinates[0],
                        geometry.coordinates[1]);
                    // 포인트 객체를 받아 좌표값으로 다시 변환
                    var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                        latlon);

                    var routeInfoObj = {
                        markerImage: markerImg,
                        lng: convertPoint._lng,
                        lat: convertPoint._lat,
                        pointType: pType
                    };

                    // Marker 추가
                    //addMarkers(routeInfoObj);
                }
            }//for문 [E]
        }
        ,
        error: function (request, status, error) {//에러 표시
            console.log("code:"
                + request.status + "\n"
                + "message:"
                + request.responseText
                + "\n" + "error:" + error);
        }
    })
};

//라인그리기
function drawLine_fr(arrPoint, traffic) {
    var polyline_;

    polyline_ = new Tmapv2.Polyline({
        path: arrPoint,
        strokeColor: "#55A9BB",
        strokeWeight: 8,
        map: map,
        strokeOpacity: 0.2,
    });

    resultdrawArr.push(polyline_);
}

//초기화 기능
function resettingMap() {
    //기존마커는 삭제

    if (resultdrawArr.length > 0) {
        console.log("삭제체크");
        for (var i = 0; i < resultdrawArr.length; i++) {
            resultdrawArr[i].setMap(null);
        }
    }

    drawInfoArr = [];
    resultdrawArr = [];
}

function drawRoute() {
    resettingMap();

    fetch(myData)
        .then((res) => res.json())
        .then((resJson) => {
            const contents = resJson.data;

            //console.log(contents);

            // 센터 좌표 리스트
            var centers = resJson.data;


            for (var i = 0; i < 5; i++) {//for문을 통하여 배열 안에 있는 값을 마커 생성
                var lat = centers[i]["기점_위도(WGS84(4326))"];
                var lng = centers[i]["기점_경도(WGS84(4326))"];
                var endLat = centers[i]["종점_위도(WGS84(4326))"];
                var endLng = centers[i]["종점_경도(WGS84(4326))"];

                //console.log(lat,lng,endLat,endLng);
                routeTmap_fr(lng, lat, endLng, endLat);
            }
        });
}

let isRouteVisible = true; // 표시 여부를 나타내는 변수

function toggleRoute() {
    // 마커 표시 여부에 따라 마커 표시/삭제 실행
    if (isRouteVisible) {
        console.log("루트를 표시합니다.");
        drawRoute();
        isRouteVisible = false;
    } else {
        console.log("루트를 삭제합니다.");
        resettingMap();
        isRouteVisible = true;
    }
}


// DOM이 완전히 로드된 후에 요소에 접근할 수 있도록 대기합니다.
document.addEventListener("DOMContentLoaded", function () { //domcontentloaded안하면 안됨..
    // 체크박스 요소에 대한 참조를 가져옵니다.
    const frozenMapCheckbox = document.getElementById('frostBtn');

    // 체크박스의 상태 변경 이벤트 리스너를 추가합니다.
    frozenMapCheckbox.addEventListener('click', toggleRoute);
});