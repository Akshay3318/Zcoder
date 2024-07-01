const express = require('express');
const cors = require('cors');
const app = express();
const { connectToMongoDb }= require('./config/db')
const port = 8008;
const userRouter = require('./api/user')
const postRouter = require('./routes/solutionRoute')
const bookmarkRouter = require('./routes/bookmarksRoute');
const commentRouter = require('./routes/commentsRoute')
// for accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());
app.use(express.urlencoded({extended:true}));
app.use(cors());

connectToMongoDb('mongodb+srv://jajamabhijith2004:Devabhi2004@users.ralw0gb.mongodb.net/backend').then(()=>{
    console.log('mongo connecrted')
})


const User = require('./model/user');



app.get('/user/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  });
  
  app.put('/user/:id/techstacks', async (req, res) => {
    try {
      const { techStacks } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { techStacks }, { new: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating tech stacks', error });
    }
  });
  
  app.put('/user/:id/languages', async (req, res) => {
    try {
      const { languages } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { languages }, { new: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating languages', error });
    }
  });
  
  app.put('/user/:id/friends', async (req, res) => {
    try {
      const { friends } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { friends }, { new: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating friends', error });
    }
  });
  
  app.get('/search', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.query.username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error searching user', error });
    }
  });
  
  app.put('/user/:id/add-friend', async (req, res) => {
    try {
      const { friendUsername } = req.body;
      const user = await User.findById(req.params.id);
      if (user.friends.includes(friendUsername)) {
        return res.status(400).json({ message: 'Friend already added' });
      }
      user.friends.push(friendUsername);
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error adding friend', error });
    }
  });

app.use('/user', userRouter);
app.use('/user',postRouter);
app.use('/user',bookmarkRouter);
app.use('/user',commentRouter);

app.listen(port, ()=>{
    console.log(`server started at port ${port}`);
})