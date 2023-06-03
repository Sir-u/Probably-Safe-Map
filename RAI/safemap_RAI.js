
        /*
        현재 위치의 위도 경도값을 얻어와서 지도의 center로 설정할 예정

        navigator.geolocation.getCurrentPosition()은 비동기적으로 동작하므로 위치 정보를 얻는데 시간이 소요되며 
        위치정보를 얻기 전에 지도를 그리려고 하는 문제가 발생할 수 있으므로
        Promise나 async/await 구문을 사용하여 위치정보를 받아온 다음 지도를 그리게 해야함
        */

        function getUserLocation() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject("위치 정보가 지원되지 않습니다.");
                } else {
                    navigator.geolocation.getCurrentPosition(
                        position => resolve(position),
                        error => reject(error)
                    );
                }
            });
        }

        var map;

        async function drawMap() {
            try {
                const position = await getUserLocation();
                console.log(position);
                alert(`위도: ${position.coords.latitude}, 경도: ${position.coords.longitude}`);
                map = new Tmapv2.Map("map", {
                    center: new Tmapv2.LatLng(position.coords.latitude, position.coords.longitude),      //맵생성, 현재 위치의 위도와 경도를 center로 지정
                    width: "100%",
                    height: "95vh",
                    zoom: 12,
                });
            } catch (error) {
                console.error(error);
                // 위치 정보를 얻을 수 없을 때 #map 영역에 에러 메시지 표시
                //document.getElementById('map').innerHTML = `<p style="text-align: center; padding-top: 30px;">${error} 위치 정보를 얻을 수 없습니다. </p>`;

                // 위치 정보를 얻을 수 없을 때 부경대를 센터로 지정
                map = new Tmapv2.Map("map", {
                    center: new Tmapv2.LatLng(35.133238684709, 129.10144001966),         //부경대 위도경도
                    width: "100%",
                    height: "95vh",
                    zoom: 10,
                });
            }
        }

        drawMap();


        var markers = [];
        var infoWindows = [];
        var currentInfoWindow = null;
        var listItems = [];

        // cors 에러 오류 때문에 url 앞에 https://cors-anywhere.herokuapp.com/ 추가
        // https://cors-anywhere.herokuapp.com/corsdemo 에서 request temporary access to the demo server
        
        fetch('https://cors-anywhere.herokuapp.com/http://www.utic.go.kr:8080/guide/imsOpenData.do?key=lZrvhlh9xs710jGVRIgOQIkE5N1baQuJ0AqXatykEoFQ9A2o5mdrVL0QLwrTBJ')
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                var records = data.querySelectorAll('record');

                var record_count = records.length;       //레코드 개수(현재 정보 건수)가져오기
                var span = document.getElementById('rai_cnt');
                span.innerHTML = record_count;            //현재 돌발정보건수를 동적으로 삽입

                records.forEach(record => {
                    var lat = parseFloat(record.querySelector('locationDataY').textContent);          //위도
                    var lng = parseFloat(record.querySelector('locationDataX').textContent);          //경도
                    var incidentTitle = record.querySelector('incidentTitle').textContent;            //돌발정보(상세)
                    var roadName = record.querySelector('roadName').textContent;            //도로이름
                    var endDate = record.querySelector('endDate').textContent;            //종료시각

                    var marker = new Tmapv2.Marker({                //마커생성
                        position: new Tmapv2.LatLng(lat, lng),
                        map: map
                        
                    });


                    var infoWindow = new Tmapv2.InfoWindow({
                        position: new Tmapv2.LatLng(lat, lng), 
                        content: '<span class="badge text-bg-light" style="font-size:10pt;"><div style="padding: 3px; width:max-content">'+roadName+ ' <button type="button" class="btn-close" onclick="closeWindow()" style="font-size:8pt"></button></div></span>',
                        background: false,
                        border : '10px solid transparent', /*완전히 투명하게*/
                        type: 2, //Popup의 type 설정, Tmapv2.InfoWindowOptions.TYPE_FLAT = 2
                        map: map, //Popup이 표시될 맵 객체
                        visible: false,
                        align: 18, // Tmapv2.InfoWindowOptions.ALIGN_CENTERBOTTOM = 18
                        offset: new Tmapv2.Point(0, 40)
                    });

                    marker.addListener("click", function (evt) {    //마커에 클릭 리스너이벤트 달아줌
                        if (currentInfoWindow) {
                            currentInfoWindow.setVisible(false);         //현재 열려있는 info가 있다면 닫아준다
                        }
                        infoWindow.setMap(map);
                        infoWindow.setVisible(true);          //누른 마커의 info를 연다(visible)
                        currentInfoWindow = infoWindow;       //현재 누른 마커의 info를 현재 열려있는 info로 바꾼다
                    });


                    //PC웹상에선 동작하나 모바일에서 마커를 클릭했을때 팝업이 뜨지않는 문제가 있었음
                    //모바일상에서 Marker draggable: true일때, 마커 터치를 시작할때 이벤트 등록
                    marker.addListener("touchstart", function (evt) {
                        if (currentInfoWindow) {
                            currentInfoWindow.setVisible(false);
                        }
                        infoWindow.setMap(map);
                        infoWindow.setVisible(true);
                        currentInfoWindow = infoWindow;
                    });

                    markers.push(marker);    //마커리스트 추가
                    infoWindows.push(infoWindow);    //인포리스트 추가

                    //* 모달에 담길 아이템 생성 *//
                    var listItem = document.createElement('div');

                    /*
                        <div>
                            <p>을지로 입구역</p>
                            <span style="font-size: small;">오늘 여섯시까지</span><br>
                            <span style="font-size: small;">상세 내용</span>
                            <hr>
                        </div>

                    */
                    endDate = endDate.substring(6); // '2023년 ' 부분을 제거하여 남은 부분을 가져옴
                    listItem.innerHTML = '<p>'+roadName+'</p><span style="font-size: small;">'+endDate+'까지,</span><br><span style="font-size: small;">'+incidentTitle+'</span><hr>'
                    
                    listItems.push(listItem); //listItems에 담아두기
                    incidentList.appendChild(listItem);        //모달에 추가

                });

                //클러스터링
                // markerCluster = new Tmapv2.extension.MarkerCluster({
                //     markers: markers,
                //     map: map
                // });

                
            });

        // infowindow를 닫는 함수. info닫기버튼의 onclick이벤트로 사용
        function closeWindow() {
            if (currentInfoWindow) {          //현재 열려있는 info가 있다면
                currentInfoWindow.setVisible(false);      //닫아준다
                currentInfoWindow = null;
            }
        }

        // 모든 마커를 표시해제 하는 함수
        function removeMarkers() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            // markerCluster.destroy();	//클러스터 삭제
        }


        var markers2 = [];

        // 일부 영역의 마커들만 표시하도록
        function testMarkers(x1, y1, x2, y2) {              //x경도 y위도인 두지점

            markers2 = [];
            removeMarkers();  //맵에서 모든 마커를 지움
            incidentList.innerHTML = '';  //비우기
            var count = 0;

            if(x1 > x2){      //x2가 x1값보다 크도록 swap
                var tmp;
                tmp=x1;
                x1=x2;
                x2=tmp;
            }

            if(y1 > y2){      //y2가 y1값보다 크도록 swap
                var tmp;
                tmp=y1;
                y1=y2;
                y2=tmp;
            }

            console.log(x1,y1,x2,y2);

            for (var i = 0; i < markers.length; i++) {
                // markers의 각 마커마다 lat lng값을 가져온다
                var position = markers[i].getPosition();
                var lat = position.lat();
                var lng = position.lng();

                if(i==1){
                    console.log(lat,lng);
                }

                if ( (x1<lng) && (lng<x2) && (y1<lat) && (lat<y2) ) {      //해당 마커가 범위안에 있다면
                    markers[i].setMap(map);        //마커를 맵에 표시
                    // new Tmapv2.Marker({                //마커생성
                    //     position: new Tmapv2.LatLng(lat, lng),
                    //     map: map,
                    // });
                    incidentList.appendChild(listItems[i]);        //모달에 추가
                    count += 1; //건수 카운트
                }
            }

            var span = document.getElementById('rai_cnt');
            span.innerHTML = count;            //현재 돌발정보건수를 동적으로 삽입

        


        }        