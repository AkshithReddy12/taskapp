const express=require('express')
const router=express.Router()
const User=require('../models/user')
const Task=require('../models/task')
const {isLoggedIn}=require('../middleware')







router.get("/createTask",(req,res)=>{
    res.render("create")
})

router.post('/tasks',isLoggedIn, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const task = new Task({ title, description, dueDate });
    task.author=req.user._id
    await task.save();
    res.redirect("/tasks")
  } catch (error) {
    res.status(500).json({ error: 'Unable to create a task' });
  }
});

router.get('/tasks',isLoggedIn, async (req, res) => {
  try {
    const tasks = await Task.find({author:`${req.user._id}`}).sort({ dueDate: 1 });
    res.render("read",{tasks})
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch tasks' });
  }
});

router.get("/tasks/:id/edit",isLoggedIn,async(req,res)=>{
   try{ const { id } = req.params;
    const task = await Task.findById(id)
    if (!task) {
        return res.redirect('/tasks');
    }
    res.render('edit', { task });
} catch(error){
    res.status(500).json({message: error.message})
    
}
})
router.post("/tasks/:id",isLoggedIn,async(req,res)=>{
 try{
    const { id } = req.params;
    const task = await Task.findById(id);
    task.title=req.body.title
    task.description=req.body.description
    task.dueDate=req.body.dueDate
    await task.save();
    res.redirect("/tasks")
} catch(error){
    res.status(500).json({message: error.message})
    
}
})


router.post("/tasks/:id/isOver",isLoggedIn,async(req,res)=>{
    try{
       const { id } = req.params;
       const task = await Task.findById(id);
       task.isOver= !task.isOver
       await task.save();
       res.redirect("/tasks")
   } catch(error){
       res.status(500).json({message: error.message})    
}})

router.delete("/tasks/:id",isLoggedIn,async(req,res)=>{
  
  try{
      const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect("/tasks")
} catch(error){
    res.status(500).json({message: error.message})
    
}
})

module.exports=router;