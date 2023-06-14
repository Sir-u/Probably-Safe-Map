
drawMap();
click_listeners();


function removeSearchSection_POINT() {
    // 검색 토글버튼 올라와있을때
    $('#searchSection_POINT').hide();
    $('#result_div').hide();
}

function showSearchSection_POINT() {
    // 검색 토글버튼 눌러져있을때 --> 그냥 show하면 됨.
    $('#searchSection_POINT').show(); 
    $('#result_div').show();
}

function toggleFindPoint() {
    var button = document.querySelector('#findPlaceBtn');
    var isPressed = button.getAttribute('aria-pressed') === 'false';

    if (isPressed) {
        removeSearchSection_POINT(); //검색버튼 눌렀을 때 검색창 없애기
    } else {
        showSearchSection_POINT(); //검색버튼 눌렀을 때 검색창 띄우기
    }
}







var map, marker;
var markerArr = [];

var marker_s;
var marker_e;

let isStart = 0;

//장소 검색 api 요청
function searchPOI(searchKeyword, isStart){
	// POI 통합 검색 API 요청
    
		var headers = {}; 
		headers["appKey"]="3KpXgMcaMY4s4BLd0y68867oI2fUOuos4t9kNemn";

		$.ajax({
			method:"GET",
			headers : headers,
			url:"https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
			async:false,
			data:{
				"searchKeyword" : searchKeyword,
				"resCoordType" : "EPSG3857",
				"reqCoordType" : "WGS84GEO",
				"count" : 10
			},

            //응답 받아오기
			success:function(response){
				var resultpoisData = response.searchPoiInfo.pois.poi;
				
				// 기존 마커, 팝업 제거
				if(markerArr.length > 0){
					for(var i in markerArr){
						markerArr[i].setMap(null);
					}
				}
				var innerHtml ="";	// Search Reulsts 결과값 노출 위한 변수
				var positionBounds = new Tmapv2.LatLngBounds();		//맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
				//position data response
				for(var k in resultpoisData){
					
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
				 		position : markerPosition,
				 		//icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png",
				 		icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png",
						iconSize : new Tmapv2.Size(24, 38),
						title : name,
						map:map
				 	});
					//innerHtml
					//list-group-item 클래스에 data-lat, data-lon 추가
					 innerHtml += "<li class='place-items' data-lat='" + lat + "' data-lon='" + lon + "' data-name='" + name + "'><img src='http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png' style='vertical-align:middle;'/><span> " + name + "</span></li>";
					
					markerArr.push(marker);
					positionBounds.extend(markerPosition);	// LatLngBounds의 객체 확장
				}
				
				$("#searchResult").html(innerHtml);	//searchResult 결과값 노출
				map.panToBounds(positionBounds);	// 확장된 bounds의 중심으로 이동시키기
				map.zoomOut();

				//결과 리스트 클릭할 수 있게 만들기--------------------
				// 클릭 이벤트 핸들러를 추가할 <li> 요소 선택
				var listItem = $("#searchResult li");
				
				// <li> 요소에 클릭 이벤트 리스너 등록
				listItem.on("click", function() {
				  //클릭한 것의 data를 가져옴
				var lat = $(this).data("lat");
				var lon = $(this).data("lon");
				var name = $(this).data("name");
			
				// 예시로 경고창에 장소 정보 출력 (연습용)
				alert("선택한 장소: " + name + "\n위도: " + lat + "\n경도: " + lon);
			
				 // 클릭한 위치를 지도의 중심으로 설정
                map.setCenter(new Tmapv2.LatLng(lat, lon));
				// 지도 확대 레벨을 높임 (19가 최대인 듯)
				map.setZoom(17);
			
				
				//
				if (isStart==0) {
					
					//marker_c 추가예정
					
				$("#searchKeyword").val(name);
				showAreaRAIMarkers(lon-0.05, lat-0.05, lon+0.05, lat+0.05);   //해당 위치에서 대략 10km 반경내 위치 돌발정보 표시
			
				}
				//출발지인 경우
                else if (isStart==1) {

					console.log("1");

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

                    //검색란에 선택한 위치 세팅
                    $("#searchKeyword_start").val(name);
				
                }
				//도착지인 경우
                else {
                    if (marker_e) {
                        marker_e.setMap(null); // Remove the old marker_e
                    }

                    //도착지 마커로 저장
                    marker_e = new Tmapv2.Marker({
                        position: new Tmapv2.LatLng(lat, lon),
                        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
                        iconSize: new Tmapv2.Size(24, 38),
                        map: map
                    });

                    //검색란에 선택한 위치 세팅
                    $("#searchKeyword_dest").val(name);
                }

				});
				
			},
			error:function(request,status,error){
				console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				alert("에러다!!!!!!!!!");
			}
			
		});
	}

//길찾기 버튼 클릭했을때 나타나는 출발지 검색&도착지 검색&경로표시 버튼들의 클릭리스너 설정
function click_listeners() {
	console.log("searchKeyword");
	// //버튼 클릭시
		$("#btn_select_place").click(function(){
			//검색한 키워드 보냄
			var searchKeyword = $('#searchKeyword').val();
			searchPOI(searchKeyword, 0
				
				); //true일 때 출발지
			console.log(searchKeyword);
		});


	// //경로 검색-----------
	//    //출발지 검색 버튼 눌렀을 때
	//    $("#btn_select_start").click(function () {
	// 	resettingMap();
	// 	   // searchKeyword 값을 넘겨주기
	// 	   var searchKeyword = $('#searchKeyword_start').val();
	// 	   searchPOI(searchKeyword, 1); //true일 때 출발지
	//    });
   
	//    //도착지 검색 버튼 눌렀을 때
	//    $("#btn_select_dest").click(function () {
	// 	resettingMap();
	// 	//searchKeyword 값을 넘겨주기
	// 	   var searchKeyword = $('#searchKeyword_dest').val();
	// 	   searchPOI(searchKeyword, 2); //false일 때 도착지
	//    });
	   
	//    //장소 검색-----------
	//    //장소 검색 버튼
	//    $("#btn_select_point").click(function () {
   
	// 	   var searchKeyword = $('#searchKeyword_point').val();
	// 	   searchPOI(searchKeyword, true);
	//    });
   
	//    $("#btn_showPointRAI").click(function () {
	// 	   //해당 위치의 위도경도 가져오기
	// 	   var position_s = marker_s.getPosition();
	// 	   var lat = position_s.lat();
	// 	   var lng = position_s.lng();
   
	// 	   // 기존 마커, 팝업 제거
	// 	   if (markerArr.length > 0) {
	// 		   for (var i in markerArr) {
	// 				markerArr[i].setMap(null);
	// 		   }
	// 	   }
		   
	// 	   if(resultdrawArr.length != 0){   //경로표시 되어있으면
	// 		   resettingMap();
	// 	   }
   
	// 	   var marker_p = new Tmapv2.Marker({
	// 		   position: new Tmapv2.LatLng(lat, lng),
	// 		   icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
	// 		   iconSize: new Tmapv2.Size(24, 38),
	// 		   map: map
	// 	   });
   
	// 	   showAreaRAIMarkers(lng-0.05, lat-0.05, lng+0.05, lat+0.05);   //해당 위치에서 대략 10km 반경내 위치 돌발정보 표시
   
	//    });


	
	// //경로 검색 --------------------------------------------------------------
	// $("#btn_showway").click(function () {
	// 	////출발지, 검색지 값 받고
	// 	//출발지 위도경도 가져오기
	// 	var position_s = marker_s.getPosition();
	// 	var lat_s = position_s.lat();
	// 	var lng_s = position_s.lng();

	// 	//도착지 위도경도 가져오기
	// 	var position_e = marker_e.getPosition();
	// 	var lat_e = position_e.lat();
	// 	var lng_e = position_e.lng();

	// 	// 검색란의 마커, 팝업 제거
	// 	if (markerArr.length > 0) {
	// 		for (var i in markerArr) {
	// 			markerArr[i].setMap(null);
	// 		}
	// 	}

	// 	resettingMap();

	// 	routeTmap(lng_s,lat_s,lng_e,lat_e);

	// 	////경로검색, draw 함수 불러오기
	// })
}	








//경로검색--------------------------------------------------------------
var resultdrawArr = [];
function routeTmap(startX, startY, endX, endY) {
	var drawInfoArr = [];
	//var searchOption = $("9").val();
	
			var trafficInfochk = $("#year").val();
			var headers = {}; 
				headers["appKey"]="3KpXgMcaMY4s4BLd0y68867oI2fUOuos4t9kNemn";
	
			
			//JSON TYPE EDIT [S]
			$.ajax({
				type : "POST",
				headers : headers,
				url : "https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result&appKey=3KpXgMcaMY4s4BLd0y68867oI2fUOuos4t9kNemn",
				async : false,
				data : {
					"startX" : startX,
					"startY" : startY,
					"endX" : endX,
					"endY" : endY,
					"reqCoordType" : "WGS84GEO", //위도경도
					"resCoordType" : "EPSG3857", //또다른 위치표시방법
					"searchOption" : "10",
					"trafficInfo" : trafficInfochk
				},
				success : function(response) {
	
					var resultData = response.features; //response로 받아온다
	
					for ( var i in resultData) { //for문 [S]
						var geometry = resultData[i].geometry;
						var properties = resultData[i].properties;
	
						if (geometry.type == "LineString") {
							for ( var j in geometry.coordinates) {
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
							
							drawLine(drawInfoArr, "0");
							
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
								markerImage : markerImg,
								lng : convertPoint._lng,
								lat : convertPoint._lat,
								pointType : pType
							};
	
							// Marker 추가
							//addMarkers(routeInfoObj);
						}
					}//for문 [E]
				}
			,
			error : function(request, status, error) {//에러 표시
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
		path : arrPoint,
		strokeColor : "#55A9BB",
		strokeWeight :8,
		map : map,
		strokeOpacity : 1,
	});

	resultdrawArr.push(polyline_);
}

//초기화 기능
function resettingMap() {
	// marker_s.setMap(null);
    // marker_e.setMap(null);

	//기존경로 삭제
	if (resultdrawArr.length > 0) {
		for (var i = 0; i < resultdrawArr.length; i++) {
			resultdrawArr[i].setMap(null);
		}
	}

	drawInfoArr = [];
	resultdrawArr = [];
}
