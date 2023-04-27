import $api from "../http";

export default class AuthService {
  static async login(email, password) {
    return $api.post("/login", { email, password });
  }
  static async registration(email, password, login) {
    return $api.post("/registration", { email, password, login });
  }
  static async logout() {
    return $api.post("/logout");
  }
  static async sendCode(email, code) {
    return $api.post("/sendcode", { email, code });
  }
  static async refresh(){
    return $api.get('/refresh')
}
  static async changePassword(email, password, salt) {
    return $api.post("/changePassword", { email, password, salt });
  }
  static async getInfoIp() {
    return $api.get("/getInfoIp");
  }

  static async getInfoConnection() {
    return $api.get("/getInfoConnection");
  }

  static async updateInfoIp(ip, city, lat, long) {
    return $api.post("/udpateInfoIp", { ip, city, lat, long });
  }

  static async updateInfoConnection(downloadSpeed, uploadSpeed, ping) {
    return $api.post("/udpateInfoConnection", {
      downloadSpeed,
      uploadSpeed,
      ping,
    });
  }
}
