const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

var accounts = [
  {
    username: 'Faithful-Mind',
    email: 'lpyy15@gmail.com',
    url: 'lpyy',
  },
];

app.get('/accounts', (req, res) => {
  res.statusCode = 200;
  res.json(accounts);
});

app.post('/accounts', (req, res) => {
  accounts.push(req.body);
  console.log('after created: ', accounts);
  var id = accounts.length - 1;
  res.statusCode = 201;
  res.send({id: id});
});

app.put('/accounts/:id', (req, res) => {
  accounts[req.params.id] = req.body;
  console.log('updated ', accounts[req.params.id]);
  res.statusCode = 200;
  res.send(accounts[req.params.id]);
});

app.delete('/accounts/:id', (req, res) => {
  accounts.splice(req.params.id, 1);
  console.log('after deleted: ', accounts);
  res.sendStatus(204);
});

app.listen(3000);
