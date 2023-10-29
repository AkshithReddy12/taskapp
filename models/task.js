const mongoose=require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true
    },
    dueDate: {
      type:Date,
      required:true
    },
    author:{
      type:mongoose.Schema.Types.ObjectId,
      href:"User"
    },
    isOver:{
      type:Boolean,
      default:false
    }
  });

  const Task = mongoose.model('Task', taskSchema);
  module.exports =Task;