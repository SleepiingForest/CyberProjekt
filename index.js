const express = require('express')
const app = express()
var path = require('path');
var publicDir = '/public';
app.use(express.static('public'));
app.use(publicDir, express.static('public'));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, publicDir, 'index.html'));
})

app.listen(3000, function () {
  console.log('Cyber app listening on port 3000!')
})


