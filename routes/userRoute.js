const express = require('express');
const router = express.Router();

const path = require('path');
const multer = require('multer');

const pushNoticationController = require("../controllers/push_notification_controller");

const storage = multer.diskStorage({
     destination: function(req, file,cb){
      cb(null,path.join(__dirname,'../public/images'))
     },
     filename:function(req, file, cb){
        const name = Date.now()+'_'+path.extname(file.originalname);
        cb(null,name);
     }
});

const filefilter = (req, file, cb)=>{
   (file.mimetype == 'image/jpg' ||file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') ? cb(null,true) : cb(null,false);
}

const upload = multer({
     storage: storage,
     fileFilter:filefilter
     });

const { signUpValidation , loginValidation } = require('../helpers/validation');

const userController = require('../controllers/userController');

router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/addcustomer',upload.single("image"),userController.addcustomer);
router.post('/adminchat',userController.adminchat);
router.post('/notification',pushNoticationController.sendPushNotification);


router.post('/send-otp',userController.sendotp);
router.post('/verify-otp',userController.verifyotp);


router.post('/customerlogin',userController.customerlogin);


router.get('/getcustomer/:id',userController.getcustomer);
router.get('/getchat/:id',userController.chats);
router.get('/alllchat/:id',userController.chatall);
router.get('/transaction/:id',userController.transaction);
router.get('/profile/:id',userController.profile);
router.get('/customerprofile/:id',userController.customerprofile);


router.delete('/deletechat/:id',userController.deletechat);


router.put('/editchat/:id',userController.editchat);
router.put('/editprofile/:id',userController.editprofile);
router.put('/totalshow/:id',userController.totalshow);
router.put('/soundnotification/:id',userController.notification);
router.put('/changepassword/:id',userController.changepassword);
router.put('/chatoption/:id',userController.chatoption);

module.exports = router;