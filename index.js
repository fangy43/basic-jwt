const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')

dotenv.config();

//connect to DB
mongoose.connect( process.env.DB_CONNECT,{ useNewUrlParser: true },() => console.log('connected to db!'))

//midlewares
app.use(express.json())
//route middlewares
app.use('/api/user', authRoute)
app.use('/api/post', postRoute)

app.listen(3001, () => console.log('Server started'))
