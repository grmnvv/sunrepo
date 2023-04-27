import UserService from "../service/userService.js";

class UserController {

    async registration(req, res, next) {
        try {
            const {email, password, login} = req.body;
            console.log(password)
            const userData = await UserService.registration(email, password, login);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(userData);
        } catch (e) {
            next(e);
        }
        
      }

    async login(req, res, next) {
        try {
            const { email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
          const { refreshToken } = req.cookies;
          const token = await UserService.logout(refreshToken);
          res.clearCookie("refreshToken");
          return res.json(token);
        } catch (e) {
          next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async sendcode(req, res, next ) {
        try {
            console.log('fds')
            const { email, code } = req.body;
            const userData = await UserService.sendcode(email, code)
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }



    async changePassword(req, res, next){
        try {
            const {email, password, salt} = req.body;
            const userData = await UserService.changePassword(email, password, salt)
            return res.json(userData)
        } catch (e) {
            next(e);
        }
    }

    async checklink(req, res, next){
        try {
            const {token} = req.params;
            const userData = await UserService.resetPassword(id, token, password)
            return res.json(userData)
        } catch (e) {
            next(e);
        }
    }
    async getInfoIp(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const infoIP = await UserService.getInfoIp(refreshToken)
            return res.json(infoIP)
        } catch (e) {
            next(e)
        }
    }
    async getInfoConnection(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const infoConnection = await UserService.getInfoConnection(refreshToken)
            return res.json(infoConnection)
        } catch (e) {
            next(e)
        }
    }
    async updateInfoIp(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const {ip, city, lat, long} = req.body;
            const infoConnection = await UserService.updateInfoIp(refreshToken, ip, city, lat, long)
            return res.json(infoConnection)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    async updateInfoConnection(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const {downloadSpeed, uploadSpeed, ping} = req.body;
            const infoConnection = await UserService.updateInfoConnection(refreshToken, downloadSpeed, uploadSpeed, ping)
            return res.json(infoConnection)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    async uploadSpeed(req, res, next){
        try {
            const hey = req.body;
            console.log(hey)
            return res.json({'nothing':'hey'})
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    async downloadSpeed(req, res, next){
        const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        function generateTestData(sizeInKb) {
          const iterations = sizeInKb; //get byte count
          let result = '';
          for (let index = 0; index < iterations; index++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return result;
        }
        try {
            console.log('gfdsgsdfdgsf')
            const size = req.params.size;
            const testData = generateTestData(size);
            return res.json(testData)
        } catch (e) {
            next(e)
        }
    }
}

export default new UserController();