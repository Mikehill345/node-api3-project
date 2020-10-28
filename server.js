const express = require('express');
const userRouter = require('./users/userRouter')
const server = express();

server.use(express.json())
server.use(userRouter)

const logger = (req, res, next) => {
  let time = new Date()
  res.append('Something', 'something')
  console.log(`${req.method} ${req.url}`, time)
  next()
}
server.use(logger)

server.get('/', (req, res) => {
  res.send(`<h2>Sanity Check</h2>`);
});

//custom middleware






module.exports = server;
