const router = require('express').Router()
const {createJob,deleteJob,updateJob,getAllJobs,getJob} = require('../controllers/jobs')

router.route('/')
    .get(getAllJobs)
    .post(createJob)
router.route('/:id')
    .get(getJob)
    .patch(updateJob)
    .delete(deleteJob)


module.exports = router