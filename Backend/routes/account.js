const router = require('express').Router();
const { check } = require('express-validator/check');
const { onRegister, onLogin } = require('../services/account');

// หน้าลงทะเบียน
router.post('/register', [
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty(),
    check('u_firstname').not().isEmpty(),
    check('u_lastname').not().isEmpty()
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
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty()
], async (req, res) =>{
try {
   req.validate();
   const userLogin =await onLogin(req.body);
   req.session.userLogin = userLogin ;
   res.json(userLogin);
} 
catch (ex) {
    res.error(ex)
}
});

//ตรวจสอบ user login
router.post('/getUserLogin',(req, res)=>{
   try {
    if (req.session.userLogin) {
        return res.json(req.session.userLogin);
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
        delete req.session.userLogin ;
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