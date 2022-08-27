const router = require('express').Router();
const uploadCtrl = require('../controllers/uploadCtrl');
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/userinfor', auth, userCtrl.getUserInfor);
router.post('/uploaddata', auth, userCtrl.postfile);
router.get('/getAllUpload', auth, userCtrl.getAllUpload);
router.post('/uploadfile', auth, uploadCtrl.uploadfile);
router.get('/getdatabyid/:fileid', auth, userCtrl.getDatabyId);

// router.post('/sendMsg', auth, userCtrl.sendMsg);
module.exports = router;
