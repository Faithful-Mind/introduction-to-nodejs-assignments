const fs = require('fs');

fs.readFile('customer-data.csv', (error, data) => {
  if (error) {
    return console.error(error);
  }
  var dataLines = data.toString('utf8').split('\r\n');
  var dataHeader = dataLines[0].split(',');

  var jsonArray = [];
  for (let index = 1; index < dataLines.length; index++) {
    var values = dataLines[index].split(',');
    jsonArray[index - 1] = {};

    values.forEach((value, j) => {
      jsonArray[index - 1][dataHeader[j]] = value
    });
  }
  console.log(jsonArray);
})
