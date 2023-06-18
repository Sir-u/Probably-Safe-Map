var item = [];
var polyVisible = false; // 폴리곤 표시 여부를 추적하는 변수
var markerPolygons = {}; // 개별 폴리곤 객체를 관리하는 객체
var siteNames = []; // 변경된 변수 이름
var sttusNm = [];

function setPolygon(){
    for (var i = 0; i < item.length; i++) {
        item[i]['sttus'] = 60;

        if (item[i]['sttus'] >= 50) {
            siteNames.push(item[i]['siteName']); // 변경된 변수 이름
            console.log(siteNames);
        }
        sttusNm.push(item[i]['sttusNm']);
    }
}

async function getPolygon() {
    const floodingUrl = 'http://apis.data.go.kr/6260000/BusanWaterImrsnInfoService/getWaterImrsnInfo?serviceKey=zLzLsz6TwuV3XckkNxeibskoB4TQWO%2B4E0Ob3QC4SLnFpBdhF%2BhH9BEm0%2FdPZPrCYKbtcj12ixLGeX24tWYSig%3D%3D&pageNo=1&numOfRows=10&resultType=json';
    fetch(floodingUrl)
        .then((res) => res.json())
        .then((resJson) => {
            item = resJson.getWaterImrsnInfo.body.items.item;
            setPolygon();

        })
        .catch((error) => {
            console.log(error);
        });

}

function createPolygon(name, paths, fillColor) {
    return new Tmapv2.Polygon({
        paths: paths,
        fillColor: fillColor,
        map: map
    });
}

function addPolygon(name, paths, fillColor) {
    if (!(name in markerPolygons)) {
        markerPolygons[name] = createPolygon(name, paths, fillColor);
        console.log(markerPolygons);
    }
}

function removePolygon(name) {
    if (name in markerPolygons) {
        markerPolygons[name].setMap(null);
        delete markerPolygons[name];
    }
}

function showPolygon() {
    if (!polyVisible) {
        if (siteNames.includes('감천동')) {
            addPolygon('감천동', [
                new Tmapv2.LatLng(35.086200, 129.004464),
                new Tmapv2.LatLng(35.088096, 129.005709),
                new Tmapv2.LatLng(35.090932, 129.000130),
                new Tmapv2.LatLng(35.091432, 128.996396),
                new Tmapv2.LatLng(35.087692, 128.997651)
            ], 'pink');
        }

        if (siteNames.includes('용호동')) {
            addPolygon('용호동', [
                new Tmapv2.LatLng(35.12714367965824, 129.11000354037566),
                new Tmapv2.LatLng(35.12718052252627, 129.10788613168248),
                new Tmapv2.LatLng(35.12502500560947, 129.1105441176665),
                new Tmapv2.LatLng(35.124656520937165, 129.11185055633598),
                new Tmapv2.LatLng(35.1199401970716, 129.11135488348842),
                new Tmapv2.LatLng(35.116758339558366, 129.11037977726397),
                new Tmapv2.LatLng(35.11231267115906, 129.11034825635645),
                new Tmapv2.LatLng(35.11028254738274, 129.110850839376),
                new Tmapv2.LatLng(35.11097636770201, 129.11176184779802),
                new Tmapv2.LatLng(35.11644995178401, 129.11160494499367),
                new Tmapv2.LatLng(35.121872089691514, 129.11305033892555),
                new Tmapv2.LatLng(35.125443800513416, 129.11345874764757)
            ], 'pink');
        }

        if (siteNames.includes('대연동')) {
            addPolygon('대연동', [
                new Tmapv2.LatLng(35.131328, 129.105250),
                new Tmapv2.LatLng(35.132513, 129.100615),
                new Tmapv2.LatLng(35.129995, 129.100465),
                new Tmapv2.LatLng(35.129832, 129.106942)
            ], 'pink');
        }

        polyVisible = true;
    }
    else {
        console.log(markerPolygons);
        for (var name in markerPolygons) {
            removePolygon(name);
        }
        polyVisible = false;
    }
}


document.getElementById("floodingBtn").addEventListener("click", showPolygon);

//  // DOM이 완전히 로드된 후에 요소에 접근할 수 있도록 대기합니다.
// document.addEventListener("DOMContentLoaded", function () {
//     // 체크박스 요소에 대한 참조를 가져옵니다.
//     const floodBtn = document.getElementById("floodingBtn");
 
//     // 버튼 클릭 이벤트 리스너를 등록합니다.
//     floodBtn.addEventListener("click", showPolygon);
//     //floodingBtn.addEventListener("click", toggleFloodingButtonColor);
//  });
// //document.getElementById("showRectangleButton").addEventListener("click", showPolygon);