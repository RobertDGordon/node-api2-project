const express = require('express');

const postsRouter = require('../router/posts.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
      <h2>Express Router API</h>
      <p>It's working...</p>
    `);
  });

server.use('/api/posts', postsRouter);

module.exports = server;