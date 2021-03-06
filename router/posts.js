const express = require('express');

const Posts = require('../data/db.js');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.find(req.query)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the Posts',
        });
      });
  });
  
  router.get('/:id', (req, res) => {
    // console.log(req.params.id)
    Posts.findById(req.params.id)
      .then(post => {
        if (!post) {
            res.status(404).json({ message: 'post not found' });
        } else {
            res.status(200).json(post);
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the post',
        });
      });
  });

  router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
    .then(comment => {
      if (!comment) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' })
      } else {
        res.status(200).json(comment)
      }
    })
    .catch(error => {
      console.log('error on GET /api/posts/:id/comments', error)
      res.status(500).json({
        message: 'The comments information could not be retrieved.'
      })
    })
  })
  
  router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents){
        return res.status(400).json({ message: "Please provide title and contents for the post."})
    }
    // console.log(req.body)
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  });

  router.post('/:id/comments', (req, res) => {
    if (!req.body.text){
        return res.status(400).json({ message: "Please provide title and contents for the post."})
    }
    // console.log(req.body)

    //find comment by id
    Posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: 'post not found' });
            } else {
                 Posts.insertComment(req.body.text, req.params.id)
                .then(post => {
                    res.status(201).json(post);
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    });
                });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
            message: 'Error retrieving the post',
            });
      });
   
  });
  
  router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: 'The post has been nuked' });
        } else {
          res.status(404).json({ message: 'The post could not be found' });
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error removing the post',
        });
      });
  });
  
  router.put('/:id', (req, res) => {
    if (!req.body.title || !req.body.contents){
        return res.status(400).json({ message: "Please provide title and contents for the post."})
    }
    const changes = req.body;
    Posts.update(req.params.id, changes)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ message: 'The post could not be found' });
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error updating the post',
        });
      });
  });

  module.exports = router;