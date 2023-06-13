function formatDate() {
   var today = new Date();
   var year = today.getFullYear();
   var month = today.getMonth() + 1;
   var day = today.getDate();

   // 월과 일이 한 자리 수인 경우 앞에 0을 추가하여 두 자리로 만듭니다.
   month = month < 10 ? '0' + month : month;
   day = day < 10 ? '0' + day : day;

   var formattedDate = year + month + day;
   return formattedDate;
}

var formattedToday = formatDate();
console.log(formattedToday);