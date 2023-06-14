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