
drawMap();
click_listeners();

var map, marker;
var markerArr1 = [];

var marker_s;
var marker_e;
var marker_p;

////장소 검색 토글버튼 설정.
function removeSearchSection_POINT() {
	// 검색 토글버튼 올라왔을때 검색창이 사라지도록
	$('#searchSection_POINT').hide();
	$('#result_div').hide();
	if (marker_p != null) {
		marker_p.setVisible(false);
	}
	resetSearch("searchKeyword");
}

function showSearchSection_POINT() {
	// 검색 토글버튼 눌렀을때 검색창이 보이도록
	$('#searchSection_POINT').show();
	$('#result_div').show();
}

function toggleFindPoint() {
	var button = document.querySelector('#findPlaceBtn');
	button.classList.toggle("changeColor_btn"); //버튼 색상을 지정해줌. 색상 설정은 css에서
	var isPressed = button.getAttribute('aria-pressed') === 'true'; //aria-pressed속성을 설정해주고 true로 처음 설정

	if (isPressed) {
		button.setAttribute('aria-pressed', 'false');
		removeSearchSection_POINT(); // 검색버튼 눌렀을 때 검색창 없애기
	} else {
		button.setAttribute('aria-pressed', 'true');
		showSearchSection_POINT(); // 검색버튼 눌렀을 때 검색창 띄우기
	}
}

////길찾기 토글버튼 설정.
function removeSearchRoute() {
	// 길찾기 토글버튼 올라와있을때, 이거누르면 없어짐
	$('#searchRoute').hide();
	$('#result_div').hide();
	resettingMap1();
	if (marker_s != null || marker_e != null) {
		marker_s.setVisible(false);
		marker_e.setVisible(false);
	}
	resetSearch("searchKeyword_start");
	resetSearch("searchKeyword_dest");
}

function showSearchRoute() {
	// 길찾기 토글버튼 눌러져있을때, 이거 누르면 생겨남
	$('#searchRoute').show();
	$('#result_div').show();

}

//장소검색에서 경로검색으로
function placeToRoute(lat, lon, name) {
	// 길찾기 토글버튼 눌러져있을때 --> 그냥 show하면 됨.
	$("#btn_place_to_route").click(function () {
		removeSearchSection_POINT();
		toggleFindPoint();
		showSearchRoute();
		toggleFindRoute();

		//경로검색창 띄우기
		showSearchRoute();
		createStartMarker(lat, lon);
		setStartLocation(lat, lon);
		//keyword 띄우기
		var searchKeyword = $('#searchKeyword_start').val(name);
		searchPOI(searchKeyword, 1); //0일 때 검색
		console.log(searchKeyword);
	});
}

function toggleFindRoute() {
	var button = document.querySelector('#findRouteBtn');
	button.classList.toggle("changeColor_btn"); //버튼 색상을 지정해줌. 색상 설정은 css에서
	var isPressed = button.getAttribute('aria-pressed') === 'true'; //aria-pressed속성을 설정해주고 true로 처음 설정

	if (isPressed) {
		button.setAttribute('aria-pressed', 'false');
		removeSearchRoute(); // 검색버튼 눌렀을 때 검색창 없애기
	} else {
		button.setAttribute('aria-pressed', 'true');
		showSearchRoute(); // 검색버튼 눌렀을 때 검색창 띄우기
	}
}

//장소 검색 후 선택된 마커
function createPlaceMarker(lat, lon, dataNum) {
	if (marker_p) {
		marker_p.setMap(null); //기존 시작마커 제거
	}

	//출발지 마커로 저장
	marker_p = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(lat, lon),
		icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + dataNum + ".png",
		iconSize: new Tmapv2.Size(24, 38),
		map: map
	});
}

//시작마커 생성 함수
function createStartMarker(lat, lon) {
	if (marker_s) {
		marker_s.setMap(null); //기존 시작마커 제거
	}

	//출발지 마커로 저장
	marker_s = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(lat, lon),
		icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
		iconSize: new Tmapv2.Size(24, 38),
		map: map
	});
}
//도착마커 생성 함수
function createDestMarker(lat, lon) {
	if (marker_e) {
		marker_e.setMap(null); // 기존 엔드마커 제거
	}

	//도착지 마커로 저장
	marker_e = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(lat, lon),
		icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
		iconSize: new Tmapv2.Size(24, 38),
		map: map
	});
}

//위도 경도 바꾸기 함수
var startLat, startLon; // 출발지 위도, 경도 저장 변수
var destLat, destLon; // 도착지 위도, 경도 저장 변수
//start
function setStartLocation(lat, lon) {
	startLat = lat; //출발 lat
	startLon = lon; //도착 lon
}
//destination
function setDestLocation(lat, lon) {
	destLat = lat; //도착 lat
	destLon = lon; //도착 lon
}


let isStart = 0;

//장소 검색 api 요청
function searchPOI(searchKeyword, isStart) {
	// POI 통합 검색 API 요청

	var headers = {};
	headers["appKey"] = "3KpXgMcaMY4s4BLd0y68867oI2fUOuos4t9kNemn";

	$.ajax({
		method: "GET",
		headers: headers,
		url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
		async: false,
		data: {
			"searchKeyword": searchKeyword,
			"resCoordType": "EPSG3857",
			"reqCoordType": "WGS84GEO",
			"count": 10
		},

		//응답 받아오기
		success: function (response) {
			var resultpoisData = response.searchPoiInfo.pois.poi;

			// 기존 마커, 팝업 제거
			if (markerArr1.length > 0) {
				for (var i in markerArr1) {
					markerArr1[i].setMap(null);
				}
			}
			var innerHtml = "";	// Search Reulsts 결과값 노출 위한 변수
			var positionBounds = new Tmapv2.LatLngBounds();		//맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
			//position data response
			for (var k in resultpoisData) {

				var noorLat = Number(resultpoisData[k].noorLat); //Latitude
				var noorLon = Number(resultpoisData[k].noorLon); //longitude
				var name = resultpoisData[k].name;

				var pointCng = new Tmapv2.Point(noorLon, noorLat);
				var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);

				//위도,경도로 바꾸기
				var lat = projectionCng._lat; //위도
				var lon = projectionCng._lng; //경도

				var markerPosition = new Tmapv2.LatLng(lat, lon);

				marker = new Tmapv2.Marker({
					position: markerPosition,
					//icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png",
					icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_g_m_" + k + ".png",
					iconSize: new Tmapv2.Size(24, 38),
					title: name,
					map: map
				});
				//innerHtml
				//list-group-item 클래스에 data-lat, data-lon 추가
				innerHtml += "<li class='place-items' data-num='" + k + "' data-lat='" + lat + "' data-lon='" + lon + "' data-name='" + name + "'><img src='http://tmapapi.sktelecom.com/upload/tmap/marker/pin_g_m_" + k + ".png' style='vertical-align:middle;'/><span> " + name + "</span></li>";

				markerArr1.push(marker);
				positionBounds.extend(markerPosition);	// LatLngBounds의 객체 확장
			}

			$("#searchResult").html(innerHtml);	//searchResult 결과값 노출
			map.panToBounds(positionBounds);	// 확장된 bounds의 중심으로 이동시키기
			map.zoomOut();

			//결과 리스트 클릭할 수 있게 만들기--------------------
			// 클릭 이벤트 핸들러를 추가할 <li> 요소 선택
			var listItem = $("#searchResult li");

			// <li> 요소에 클릭 이벤트 리스너 등록
			listItem.on("click", function () {
				//클릭한 것의 data를 가져옴
				var lat = $(this).data("lat");
				var lon = $(this).data("lon");
				var name = $(this).data("name");
				var dataNum = $(this).data("num");

				// 예시로 경고창에 장소 정보 출력 (연습용)
				//alert("선택한 장소: " + name + "\n위도: " + lat + "\n경도: " + lon);

				// 클릭한 위치를 지도의 중심으로 설정
				map.setCenter(new Tmapv2.LatLng(lat, lon));
				// 지도 확대 레벨을 높임 (19가 최대인 듯)
				map.setZoom(17);


				//그냥 검색일 때
				if (isStart == 0) {

					createPlaceMarker(lat, lon, dataNum);
					console.log(dataNum);

					$("#searchKeyword").val(name);
					showAreaRAIMarkers(lon - 0.05, lat - 0.05, lon + 0.05, lat + 0.05);   //해당 위치에서 대략 10km 반경내 위치 돌발정보 표시

					placeToRoute(lat, lon, name);
				}
				//출발지인 경우
				else if (isStart == 1) {

					console.log("1");

					createStartMarker(lat, lon);
					setStartLocation(lat, lon);
					//검색란에 선택한 위치 세팅
					$("#searchKeyword_start").val(name);

				}
				//도착지인 경우
				else {
					createDestMarker(lat, lon);
					setDestLocation(lat, lon);
					//검색란에 선택한 위치 세팅
					$("#searchKeyword_dest").val(name);
				}

			});

		},
		error: function (request, status, error) {
			console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

		}

	});
}

//장소, 길찾기 버튼 클릭했을때 나타나는 출발지 검색&도착지 검색&경로표시 버튼들의 클릭리스너 설정

function click_listeners() {

	//장소 검색 버튼 눌렀을 때
	$("#btn_select_place").click(function () {
		//검색한 키워드 보냄
		var searchKeyword = $('#searchKeyword').val();
		searchPOI(searchKeyword, 0); //0일 때 검색
		console.log(searchKeyword);
	});


	//경로 검색 버튼 눌렀을 때
	//출발지 검색 버튼 눌렀을 때
	$("#btn_select_start").click(function () {
		resettingMap1();
		// searchKeyword 값을 넘겨주기
		var searchKeyword = $('#searchKeyword_start').val();
		searchPOI(searchKeyword, 1); //true일 때 출발지
	});

	//도착지 검색 버튼 눌렀을 때
	$("#btn_select_dest").click(function () {
		resettingMap1();
		//searchKeyword 값을 넘겨주기
		var searchKeyword = $('#searchKeyword_dest').val();
		searchPOI(searchKeyword, 2); //false일 때 도착지
	});


	//경로 검색 눌렀을 때
	$("#btn_showway").click(function () {

		////출발지, 검색지 값 받고
		//출발지 위도경도 가져오기
		var position_s = marker_s.getPosition();
		var lat_s = position_s.lat();
		var lng_s = position_s.lng();

		//도착지 위도경도 가져오기
		var position_e = marker_e.getPosition();
		var lat_e = position_e.lat();
		var lng_e = position_e.lng();

		// 검색란의 마커, 팝업 제거
		if (markerArr1.length > 0) {
			for (var i in markerArr1) {
				markerArr1[i].setMap(null);
			}
		}

		//경로 표시
		resettingMap1();
		routeTmap(lng_s, lat_s, lng_e, lat_e);

		//장소 검색결과 창 닫기
		$('#result_div').hide();

		//경로 내 돌발정보들만 표시
		showAreaRAIMarkers(lng_s, lat_s, lng_e, lat_e);

	});

	$("#btn_change").click(function () {
		// 출발지와 도착지 위치값을 서로 교환
		var tempLat = startLat;
		var tempLon = startLon;
		startLat = destLat;
		startLon = destLon;
		destLat = tempLat;
		destLon = tempLon;

		//검색창에 표시되는 장소명 바꾸기
		var startValue = $('#searchKeyword_start').val();
		var destValue = $('#searchKeyword_dest').val();

		$('#searchKeyword_start').val(destValue);
		$('#searchKeyword_dest').val(startValue);
		console.log(destValue);
		console.log(startValue);

		// 출발지와 도착지 마커 이미지도 교환
		createStartMarker(startLat, startLon);
		createDestMarker(destLat, destLon);

		resettingMap1();
	});

}


// 검색창과 관련된 요소들을 초기화
function resetSearch(keyName) {
	var searchInput = document.getElementById(keyName);
	searchInput.value = '';
	//마커 없애기
	for (var i = 0; i < markerArr1.length; i++) {
		markerArr1[i].setVisible(false);
	}

	//검색결과 리스트 지우기
	var listItems = document.getElementsByClassName('place-items');
	console.log(listItems.length);

	//업데이트 방지를 위해 역순으로 지워줌
	for (var i = listItems.length - 1; i >= 0; i--) {
		var listItem = listItems[i];
		listItem.remove();
	}
}

//경로표시-----------------------------------------------------------------------------------------------------------
var resultdrawArr1 = [];

function routeTmap(startX, startY, endX, endY) {
	var drawInfoArr2 = [];
	//var searchOption = $("9").val();

	var trafficInfochk = $("#year").val();
	var headers = {};
	headers["appKey"] = "vqCR8cMhVh5aSpuDuOxJj5W4OQ46SWvU5rHuRI7H";


	//JSON TYPE EDIT [S]
	$.ajax({
		type: "POST",
		headers: headers,
		url: "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result&appKey=vqCR8cMhVh5aSpuDuOxJj5W4OQ46SWvU5rHuRI7H",
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
						drawInfoArr2
							.push(convertChange);
					}

					//traffic 정보 x

					drawLine(drawInfoArr2, "0");

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

//라인 설정 함수, traffic은 사용 안함
function drawLine(arrPoint, traffic) {
	var polyline_;

	polyline_ = new Tmapv2.Polyline({
		path: arrPoint,
		strokeColor: "#d40052",
		strokeWeight: 8,
		map: map,
		strokeOpacity: 1,
	});

	resultdrawArr1.push(polyline_);
}

//초기화 기능
function resettingMap1() {

	//기존경로 삭제
	if (resultdrawArr1.length > 0) {
		for (var i = 0; i < resultdrawArr1.length; i++) {
			resultdrawArr1[i].setMap(null);
		}
	}

	drawInfoArr2 = [];                                                            
	resultdrawArr1 = [];
}
