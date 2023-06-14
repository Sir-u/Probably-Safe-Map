var a = [];
a[1] = ["test1", 30, 44];
a[2] = ["test2", 60, 77];
a[3] = ["test3", 40, 42];
a[4] = ["test4", 70, 25];
a[5] = ["test5", 50, 24];

var extractedElements = [];

for (var i = 1; i < a.length; i++) {
   if (a[i][1] > 50) {
      extractedElements.push(a[i][0]);
   }
}

console.log(extractedElements);
