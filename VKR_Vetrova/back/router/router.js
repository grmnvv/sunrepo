import { Router } from "express";
import UserController from "../controllers/userController.js";
const router = new Router();

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/sendcode', UserController.sendcode)
router.post('/changePassword', UserController.changePassword)
router.post('/udpateInfoIp', UserController.updateInfoIp);
router.post('/uploadSpeed', UserController.uploadSpeed);
router.post('/udpateInfoConnection', UserController.updateInfoConnection);
router.post('/updateSettings', UserController.updateSettings)
router.get('/deleteAll', UserController.deleteAll)
router.get('/activate/:link', UserController.activate)
router.get('/getsettings', UserController.getSettings)
router.get('/downloadSpeed/:size', UserController.downloadSpeed);
router.get('/refresh', UserController.refresh);
router.get('/checklink', UserController.checklink);
router.get('/getInfoIp', UserController.getInfoIp);
router.get('/getInfoConnection', UserController.getInfoConnection);

 
export default router;