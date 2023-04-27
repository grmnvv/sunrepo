import { makeAutoObservable, runInAction } from "mobx";
import UserDto from "../DTO/userDto";
import AuthService from "../serives/AuthService";
import NetworkSpeedCheck from "../utils/UploadDownload";
export default class Store {
  isAuth = false;
  salt = "";
  error = "";
  user = {
    email: "",
    isActivated: false,
    id: "",
    login: "",
  };
  ip = {
    ip: "",
    city: "",
    lat: "",
    long: "",
  };
  connection = {
    dowloadSpeed: "",
    uploadSpeed: "",
    ping: "",
  };
  IpArray = new Array();
  ConnectionArray = new Array();

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setUser(user) {
    this.user = user;
  }

  setSalt(salt) {
    this.salt = salt;
  }

  setError(error) {
    this.error = error;
  }
  setIpArray(ip) {
    this.IpArray = ip;
  }
  setConnectionArray(connection) {
    this.ConnectionArray = connection;
  }
  async login(email, password) {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }
  async registration(email, password, login) {
    try {
      const response = await AuthService.registration(email, password, login);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }
  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({});
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }
  async refresh() {
    try {
      const response = await AuthService.refresh();
      this.setAuth(true);
      this.setUser(response.data.user);
      console.log(this.user)
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }

  async forgot(id, token, password) {
    try {
      await AuthService.forgot(id, token, password);
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }

  async sendCode(email, code) {
    try {
      this.setError("");
      const response = await AuthService.sendCode(email, code);
      this.setSalt(response.data.salt);
      console.log(response.data.salt);
    } catch (e) {
      this.setError(e.response?.data?.message);
      console.log(e.response?.data?.message);
    }
  }

  async changePassword(email, password) {
    try {
      await AuthService.changePassword(email, password, this.salt);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }


  async getInfoIp() {
    try {
      const response = await AuthService.getInfoIp();
      this.setIpArray(response.data);
      console.log(response.data)
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }

  async getInfoConnection() {
    try {
      const response = await AuthService.getInfoConnection();
      this.setConnectionArray(response.data);
      console.log(response.data)
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }

  async updateInfoIp(ip, city, lat, long) {
    try {
      const response = await AuthService.updateInfoIp(ip, city, lat, long);
      return response.data;
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }

  async updateInfoConnection(downloadSpeed, uploadSpeed, ping) {
    try {
      const response = await AuthService.updateInfoConnection(
        downloadSpeed,
        uploadSpeed,
        ping
      );
      return response.data;
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  }
  async getNetworkDownloadSpeed() {

    const speed = await NetworkSpeedCheck.checkDownloadSpeed(
    );

    console.log(`Download Speed: ${JSON.stringify(speed)}`);
    return(speed.mbps)
  }

  async getNetworkUploadSpeed() {
    const fileSizeInBytes = 2000000;
    const speed = await NetworkSpeedCheck.checkUploadSpeed(
      fileSizeInBytes
    );
    const ping = await NetworkSpeedCheck.checkPing(
    );
    console.log(`Upload Speed: ${JSON.stringify(speed)}`);
    console.log(`Ping: ${JSON.stringify(ping)}`);
    return({speed:speed.mbps, ping: ping})
  }
}
