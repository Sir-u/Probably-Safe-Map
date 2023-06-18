var today = new Date();

function formatDate() {
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


//pty값 : 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4), 빗방울(5), 빗방울/눈날림(6), 눈날림(7)

async function weatherResponse() {
    var xhr = new XMLHttpRequest();
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'zLzLsz6TwuV3XckkNxeibskoB4TQWO%2B4E0Ob3QC4SLnFpBdhF%2BhH9BEm0%2FdPZPrCYKbtcj12ixLGeX24tWYSig%3D%3D'; /*Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /**/
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /**/
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(formattedToday); /**/
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(currentTime); /**/
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); /**/
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('124'); /**/

    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            //alert('Status: ' + this.status + 'nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + 'nBody: ' + this.responseText);
            var response = JSON.parse(xhr.responseText);
            var pty = response.response.body.items.item[0].obsrValue;
            var rn1 = response.response.body.items.item[2].obsrValue;

            console.log("features");
            console.log(pty);
            console.log(rn1);
        }
    };

    xhr.send('');
}



//var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=zLzLsz6TwuV3XckkNxeibskoB4TQWO%2B4E0Ob3QC4SLnFpBdhF%2BhH9BEm0%2FdPZPrCYKbtcj12ixLGeX24tWYSig%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20230613&base_time=0100&nx=55&ny=124'); /**/