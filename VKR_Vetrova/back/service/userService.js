import bcrypt, { compareSync } from "bcrypt";
import { UserModel } from "../models/userModel.js";
import { tokenModel } from "../models/tokenModel.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';
import UserDto from "../dtos/userDto.js";
import tokenService from "./tokenService.js";
import ApiError from "../middleware/apiError.js";
import emailService from "./emailService.js";
import jwt from 'jsonwebtoken';
import { IpInfoModel } from "../models/ipModel.js";
import { ConnectionInfoModel } from "../models/connectionModel.js";
import { SettingsModel } from "../models/settingsModel.js";

class UserService {

    async registration(email, password, ) {
      const candidate = await UserModel.findOne({ email });
      if (candidate) {
        throw ApiError.BadRequest(
          `Пользователь с почтовым адресом ${email} уже существует`
        );
      }

      const hashPassword = await bcrypt.hash(password, 3);
      const salt = uuidv4();
      const activationLink = uuidv4();
      console.log(activationLink)

      const user = await UserModel.create({email: email, password: hashPassword, isActivated: false, salt: salt})
      console.log(user)
      const userDto = new UserDto(user);

      const tokens = tokenService.generateTokens({...userDto})

      await tokenService.saveToken(userDto.id, tokens.refreshToken);


      const newSettings = await SettingsModel.create({
        user: userDto.id,
        download: '2000000',
        upload: '2000000',
        ping: '64',
        mb: 'mbps',
        ipSettings: [
          {
            key: 'postal',
            display: 'Индекс',
            isChecked: false,
          },
          {
            key: 'org',
            display: 'Провайдер',
            isChecked: false,
          },
          {
            key: 'utc_offset',
            display: 'UTC',
            isChecked: false,
          },
          {
            key: 'version',
            display: 'Версия соединения',
            isChecked: false,
          },
        ],
        browserSettings: [
          {
            key: 'appCodeName',
            display: 'Имя кода браузера',
            isChecked: false,
          },
          {
            key: 'appName',
            display: 'Имя браузера',
            isChecked: false,
          },
          {
            key: 'appVersion',
            display: 'Версия браузера',
            isChecked: false,
          },
          {
            key: 'cookieEnabled',
            display: 'Куки в браузере',
            isChecked: false,
          },
          {
            key: 'platform',
            display: 'Платформа браузера',
            isChecked: false,
          },
          {
            key: 'product',
            display: 'Имя движка браузера',
            isChecked: false,
          },
          {
            key: 'userAgent',
            display: 'User-Agent заголовок браузера',
            isChecked: false,
          },
        ],
      });
      

  
      
      return {
        ...tokens,
        user: userDto,
      };
    }
    async login(email, password){
      const user = await UserModel.findOne({ login : email }) || await UserModel.findOne({ email }) 
      if (!user) {
          throw ApiError.BadRequest(`Пользователя с таким login/email не существует`);
      }
      const salt = uuidv4();
      user.salt = salt
      await user.save()
      const isPassEqual = await bcrypt.compare(password, user.password);
      if (!isPassEqual) {
          throw ApiError.BadRequest("Неверный пароль");
      }
      const userDto = new UserDto(user);
      const token = tokenService.generateTokens({ ...userDto });


      await tokenService.saveToken(userDto.id, token.refreshToken);
      return {
          ...token,
          user: userDto,
      };
    }

    async activate(activationLink) {
      const user = await UserModel.findOne({ activationLink });
      if (!user) {
        throw ApiError.BadRequest("Некорректная ссылка активации");
      }
      user.isActivated = true;
      await user.save();
    }

    async logout(refreshToken) {
      const token = await tokenService.removeToken(refreshToken);
      return token;
    }

    async refresh(refreshToken) {
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError();
      }

      const user = await UserModel.findById(userData.id);
      const userDto = new UserDto(user);
      const token = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, token.refreshToken);
      return {
        ...token,
        user: userDto,
      }
    }

    async sendcode(email, code){ //тут мы генерируем ссылку

      const user = await UserModel.findOne({ login : email }) || await UserModel.findOne({ email }) 
      const salt = uuidv4();
      user.salt = salt
      await user.save()
      console.log(salt)
      if (!user) {
        throw ApiError.BadRequest(`Пользователя с таким login/email не существует`);;
      }
      await emailService.SendForgot(user.email, code)
      return {
        'salt':salt
      }
    }
    async changePassword(email, password, salt){ 
      const user = await UserModel.findOne({ login : email }) || await UserModel.findOne({ email }) 
      console.log(user.salt)
      console.log(salt)
      if (user.salt === salt){
        const hashPassword = await bcrypt.hash(password, 3);
        const salt = uuidv4();
        user.password = hashPassword;
        user.salt = salt
        await user.save();
        return {
          'status':'ok'
        }
      } else {
        throw ApiError.BadRequest(`Ошибка доступа`);
      }
    }
    async getInfoIp(refreshToken){
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const userData = tokenService.validateRefreshToken(refreshToken);
      const ipinfo = IpInfoModel.find({user: userData.id})
      return ipinfo
    }
    async getInfoConnection(refreshToken){
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const userData = tokenService.validateRefreshToken(refreshToken);
      const connectionInfo = ConnectionInfoModel.find({user: userData.id})
      return connectionInfo
    }
    async updateInfoIp(refreshToken, ip, city, lat, long){
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const userData = tokenService.validateRefreshToken(refreshToken);
      const ipinfo = IpInfoModel.create({user: userData.id, ipAddress: ip, city: city, latitude: lat, longitude: long})
      return ipinfo
    }
    async updateInfoConnection(refreshToken, downloadSpeed, uploadSpeed, ping){
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const userData = tokenService.validateRefreshToken(refreshToken);

      const connectionInfo = ConnectionInfoModel.create({user: userData.id, downloadSpeed: downloadSpeed, uploadSpeed: uploadSpeed, ping: ping})
      return connectionInfo
    }
    async updateSettings(refreshToken, downloadSpeed, uploadSpeed, ping, mb, ipSettings, browserSettings) {
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const user = tokenService.validateRefreshToken(refreshToken);
    
      const update = await SettingsModel.findOneAndUpdate(
        { user: user.id },
        {
          download: downloadSpeed === '' ? '2000000' : downloadSpeed,
          upload: uploadSpeed === '' ? '2000000' : uploadSpeed,
          ping: ping === '' ? '64' : ping,
          mb: mb,
          ipSettings: ipSettings.map(setting => ({
            key: setting.key,
            display: setting.display,
            isChecked: setting.isChecked,
          })),
          browserSettings: browserSettings.map(setting => ({
            key: setting.key,
            display: setting.display,
            isChecked: setting.isChecked,
          })),
        }
      );
      console.log(update)
      return update;
    }
    
    
  
    
    
    async getSettings(refreshToken){
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const user = tokenService.validateRefreshToken(refreshToken)
      const settings = await SettingsModel.findOne({user: user.id})
      return settings

    }
}

export default new UserService();