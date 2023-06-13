

async function drawMap() {
    try {
        const position = await getUserLocation();
        console.log(position);
        //alert(`위도: ${position.coords.latitude}, 경도: ${position.coords.longitude}`);
        map = new Tmapv2.Map("map", {
            center: new Tmapv2.LatLng(position.coords.latitude, position.coords.longitude),
            width: "100%",
            height: "95vh",
            zoom: 12,
        });
    } catch (error) {
        console.error(error);
        // 위치 정보를 얻을 수 없을 때 부경대를 센터로 지정
        map = new Tmapv2.Map("map", {
            center: new Tmapv2.LatLng(35.133238684709, 129.10144001966),
            width: "100%",
            height: "95vh",
            zoom: 10,
        });
    }
}

//TODO:
//FIXME:
function showPolygon(name, status) {
    //console.log(name); // 잘 받아오는지 테스트
    if (!poly) {
        if (name == '감천동' && status >= 50) {
            poly = new Tmapv2.Polygon({	
                paths: [new Tmapv2.LatLng(35.086200, 129.004464),
                    new Tmapv2.LatLng(35.088096, 129.005709),
                    new Tmapv2.LatLng(35.090932, 129.000130),
                    new Tmapv2.LatLng(35.091432, 128.996396),
                    new Tmapv2.LatLng(35.087692, 128.997651)],
                fillColor:"pink",	// 다각형 내부 색상
                map: map	// 지도 객체
            });
        }
        if (name == '용호동' && status >= 50) {
            poly = new Tmapv2.Polygon({	
                paths: [new Tmapv2.LatLng(35.086200, 129.004464),
                    new Tmapv2.LatLng(35.088096, 129.005709),
                    new Tmapv2.LatLng(35.090932, 129.000130),
                    new Tmapv2.LatLng(35.091432, 128.996396),
                    new Tmapv2.LatLng(35.087692, 128.997651)],
                fillColor:"pink",	// 다각형 내부 색상
                map: map	// 지도 객체
            });
        }
        if (name == '대연동' && status >= 50) {
            poly = new Tmapv2.Polygon({	
                paths: [new Tmapv2.LatLng(35.131328, 129.105250),
                    new Tmapv2.LatLng(35.132513, 129.100615),
                    new Tmapv2.LatLng(35.129995, 129.100465),
                    new Tmapv2.LatLng(35.131328, 129.105250),
                    new Tmapv2.LatLng(35.129832, 129.106942)],
                fillColor:"red",	// 다각형 내부 색상
                map: map	// 지도 객체
            });
        }
    } else {
        if (poly.getMap()) {
            poly.setMap(null);
        } else {
            poly.setMap(map);
        }
    }
}


document.getElementById("showRectangleButton").addEventListener("click", showPolygon);