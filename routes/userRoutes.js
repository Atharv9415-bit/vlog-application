const { Router } = require("express");
const router = Router();
const user = require("../models/userModel");

router.get("/signIn", async (req, res) => {
    return res.render("signIn");
});

router.get("/signUp", async (req, res) => {
    return res.render("signUp");
});
router.get("/logout",async(req,res)=>{
    res.clearCookie("token").redirect("/");
})


router.post("/signup", async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        await user.create({
            fullName,
            email,
            password,
        });
        res.redirect("/");
    } catch (err) {
        next(err); 
    }
});
router.post("/signIn",async(req,res)=>{
  const {email,password}=req.body;
try {
  const token= await user.matchPasswordAndGenerateToken(email,password);
  return res.cookie("token",token).redirect("/");
  
} catch (error) {
  return res.render("signIn",{
      error:"Incorrect email or password",
  })
  
}

})




module.exports = router;
