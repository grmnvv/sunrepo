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

class UserService {

    async registration(email, password, login) {
      const candidate = await UserModel.findOne({ email });
      if (candidate) {
        throw ApiError.BadRequest(
          `Пользователь с почтовым адресом ${email} уже существует`
        );
      }
      const candidate2 = await UserModel.findOne({ login });

      if (candidate2) {
        throw ApiError.BadRequest(
          `Пользователь с логином ${login} уже существует`
        );
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const salt = uuidv4();
      const activationLink = uuidv4();
      console.log(activationLink)

      const user = await UserModel.create({email: email, password: hashPassword, login:login, isActivated: false, salt: salt})
      console.log(user)
      const userDto = new UserDto(user);

      const tokens = tokenService.generateTokens({...userDto})

      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      console.log('fds')
      console.log(user)
  
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
    async changePassword(email, password, salt){ //тут мы проверяем валидность и перезаписываем пароль
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
}

export default new UserService();