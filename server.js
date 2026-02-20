const express = require('express');
const app = express();

app.use(express.json());

app.get('/app', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});