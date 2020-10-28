const express = require('express');
const User = require('./userDb')
const router = express.Router();
const Post = require('../posts/postDb')


router.post('/api/users',[validateUser], (req, res) => {
  User.insert(req.body)
  .then((data) => {
    res.status(201).json(data)
  }).catch((err) => {
    res.status(500).json('stop breaking it')
  })
});

router.post('/api/users/:id/posts',[validateUserId, validatePost], (req, res) => {
  const newPost = {
    user_id: req.params.id,
    text: req.body.text,
  };
  Post.insert(newPost)
  .then((data) => {
    res.status(201).json(data)
  }).catch((err) => {
    res.status(500).json({ message: 'Something went horribly wrong' })
  })
});

router.get('/api/users', (req, res, next) => {
  User.get() 
  .then((data) => {
    res.status(200).json(data)
  }).catch((err) => {
    next('you suck ass')
  })
});

router.get('/api/users/:id',validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/api/users/:id/posts',validateUserId, (req, res) => {
  User.getUserPosts(req.params.id)
  .then((data) => {
    res.status(200).json(data)
  }).catch((err) => {
    res.status(500).json('it borked')
  })
});

router.delete('/api/users/:id',validateUserId, (req, res) => {
  User.remove(req.params.id)
  .then((data) => {
    res.status(200).json('You successfully deleted this guy')
  }).catch((err) => {
    res.status(500).json('it messed up')
  })
});

router.put('/api/users/:id',[validateUserId, validateUser], (req, res) => {
  User.update(req.params.id, req.body)
  .then((data) => {
    res.status(200).json(data)
  }).catch((err) => {
    res.status(500).json('it messed up')
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params
  User.getById(id)
  .then((data) => {
    if(data){
      req.user = data
      next()
    } else {
      res.status(400).json({message: 'invalid user id'})
    }
  }).catch((err) => {
    next()
  })
}

function validateUser(req, res, next) {
  if(!req.body){
    res.status(400).json('missing user data')
  } else if(!req.body.name){
    res.status(400).json('missing required name field')
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body.text){
    res.status(400).json('Please fill out text field')
  } else {
    next()
  }
}
router.use((error, req, res, next) => {
  res.status(error.code).json({message: error.message})
})
module.exports = router;
