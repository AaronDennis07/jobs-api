require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const jobsRouter = require('./routes/jobs')
const authRouter = require('./routes/auth')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const authentication = require('./middleware/authentication');
const User = require('./models/User');
const Job = require('./models/Job');

app.use(express.json());
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.get('/reset',async(req,res)=>{
  await User.deleteMany()
  await Job.deleteMany()
  res.send('success')
})

app.use('/api/v1/jobs',authentication,jobsRouter)
app.use('/api/v1/auth',authRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
