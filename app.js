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
const YAML = require('yamljs')
const swagger = require('swagger-ui-express')
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const swaggerDocs = YAML.load('./swagger.yaml')
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});
app.use('/api-docs',swagger.serve,swagger.setup(swaggerDocs))
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
