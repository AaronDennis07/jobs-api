const {StatusCodes} = require('http-status-codes')
const Job = require('../models/Job')

const createJob = async(req,res)=>{
    const {userId} = req.user
    console.log(req.user)
    const job = await Job.create({...req.body,createdBy:userId})

    res.status(StatusCodes.CREATED).json({
        job
    })
}


const getJob = async(req,res)=>{
    const {user:{userId},params:{id}} = req
    const job = await Job.find({_id:id,createdBy:userId})

    res.status(StatusCodes.OK).json({
        job
    })
}

const getAllJobs = async(req,res)=>{
    const {userId} = req.user
    const jobs = await Job.find({createdBy:userId})

    res.status(StatusCodes.OK).json({
        jobs
    })
}

const updateJob = async(req,res)=>{
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
      } = req
    
      if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
      }
      const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
      )
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async(req,res)=>{
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
      } = req

    const job = await Job.deleteOne({_id:jobId,createdBy:userId})
    res.status(StatusCodes.CREATED).json({
        msg:'succcess'
    })
}

module.exports={
    createJob,deleteJob,updateJob,getAllJobs,getJob
}