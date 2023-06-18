
function formatDate() {
   var today = new Date();
   var year = today.getFullYear();
   var month = today.getMonth() + 1;
   var day = today.getDate();
   //day = day - 1;

   // 월과 일이 한 자리 수인 경우 앞에 0을 추가하여 두 자리로 만듭니다.
   month = month < 10 ? '0' + month : month;
   day = day < 10 ? '0' + day : day;

   var formattedDate = year + month + day;
   return formattedDate;
}

function getCurrentTime() {
   var today = new Date();
   var minutes = today.getMinutes();
   if (minutes >= 30) {
      var hours = today.getHours().toString().padStart(2, '0');
      return hours + '00';
   } else {
      today.setHours(today.getHours() - 1);
      var hours = today.getHours().toString().padStart(2, '0');
      return hours + '00';
   }
}

var formattedToday = formatDate();
var currentTime = getCurrentTime();

var xhr = new XMLHttpRequest();
var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'; /*URL*/
var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'zLzLsz6TwuV3XckkNxeibskoB4TQWO%2B4E0Ob3QC4SLnFpBdhF%2BhH9BEm0%2FdPZPrCYKbtcj12ixLGeX24tWYSig%3D%3D'; /*Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
   queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /**/
   queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /**/
   queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(20230618); /**/
   // queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(formattedToday); /**/
   queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(2300); /**/
   // queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(currentTime); /**/
   queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); /**/
   queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('124'); /**/

xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
   if (this.readyState == 4) {
      var response = JSON.parse(xhr.responseText);
      var pty = response.response.body.items.item[0].obsrValue; // pty값 : 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4), 빗방울(5), 빗방울/눈날림(6), 눈날림(7)
      var reh = response.response.body.items.item[1].obsrValue; // 습도
      var rn1 = response.response.body.items.item[2].obsrValue; // 1시간 당 강우량 => 35이상일떄 침수 피해 위험
      var t1h = response.response.body.items.item[3].obsrValue; // 기온

      var weatherImage = document.getElementById('weather-image');
      var temperatureText = document.getElementById('temperature-text');
      var humidityText = document.getElementById('humidity-text');
      var rainfallText = document.getElementById('rainfall-text');

      if (pty == 0) {
         // 날씨가 맑을 때
         weatherImage.src = 'https://github.com/Sir-u/Probably-Safe-Map/blob/main/safe_map/weather/sun.png';
         weatherImage.alt = '맑은 날씨';
         temperatureText.textContent = t1h + '°C';
         humidityText.textContent = reh + '%';
      } else if (pty == 1 || pty == 2 || pty == 5 || pty == 6) {
         // 비가 올 때
         weatherImage.src = 'https://github.com/Sir-u/Probably-Safe-Map/blob/main/safe_map/weather/rain.png';
         weatherImage.alt = '비가 오는 날씨';
         temperatureText.textContent = t1h + '°C';
         humidityText.textContent = reh + '%';
         rainfallText.textContent = rn1 + 'mm';
      } else if (pty == 4) {
         // 소나기가 올 때
         weatherImage.src = 'https://github.com/Sir-u/Probably-Safe-Map/blob/main/safe_map/weather/blustery.png';
         weatherImage.alt = '소나기가 오는 날씨';
         temperatureText.textContent = t1h + '°C';
         humidityText.textContent = reh + '%';
         rainfallText.textContent = rn1 + 'mm';
      } else if (pty == 3 || pty == 7) {
         // 눈이 오는 날씨
         weatherImage.src = 'https://github.com/Sir-u/Probably-Safe-Map/blob/main/safe_map/weather/snowing.png';
         weatherImage.alt = '눈이 오는 날씨';
         temperatureText.textContent = t1h + '°C';
         humidityText.textContent = reh + '%';
         rainfallText.textContent = rn1 + 'mm';
      }
   }
};

xhr.send();
