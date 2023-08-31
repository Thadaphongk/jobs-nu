const router = require('express').Router();
const { check } = require('express-validator/check');
const { onRegister, onLogin } = require('../services/owner');

// หน้าลงทะเบียน
router.post('/register', [
    check('o_username').not().isEmpty(),
    check('o_password').not().isEmpty(),
    check('o_firstname').not().isEmpty(),
    check('o_lastname').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        res.json(await onRegister(req.body));
    }
    catch (ex) {
        res.error(ex);
    }
});
//เข้าสู่ระบบ
router.post('/login',[
    check('o_username').not().isEmpty(),
    check('o_password').not().isEmpty()
], async (req, res) =>{
try {
   req.validate();
   const ownerLogin =await onLogin(req.body);
   req.session.userLogin = ownerLogin ;
   res.json(ownerLogin);
} 
catch (ex) {
    res.error(ex)
}
});

//ตรวจสอบ user owner
router.post('/getownerLogin',(req, res)=>{
   try {
    if (req.session.ownerLogin) {
        return res.json(req.session.ownerLogin);
    }
    throw new Error('unauthorize')
   } 
   catch (ex) {
    res.error(ex, 401);
   }
   
});

//ออกจากระบบ
router.post('/logout',(req, res)=>{
    try {
        delete req.session.ownerLogin ;
        res.json({message: 'logout'});
     }
    catch (ex) {
     res.error(ex);
    }
    
 });



// router.get('/userlogin',(req,res)=> {
//     res.json(req.session.userLogin);
// });
module.exports = router;