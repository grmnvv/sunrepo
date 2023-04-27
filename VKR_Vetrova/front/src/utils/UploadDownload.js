import axios from "axios";
import $api from "../http";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default class NetworkSpeedCheck {
  static async checkDownloadSpeed(fileSizeInBytes = 2000000) {
    let startTime;

    try {
      return await new Promise(async (resolve, reject) => {
        try {
          const response = await $api.get(`/downloadSpeed/${fileSizeInBytes}`, {
            onDownloadProgress: (progressEvent) => {
              if (!startTime) {
                startTime = new Date().getTime();
              }
            },
          });

          const endTime = new Date().getTime();
          const duration = (endTime - startTime) / 1000;
          const bitsLoaded = fileSizeInBytes * 8;
          const bps = (bitsLoaded / duration).toFixed(2);
          const kbps = (bps / 1000).toFixed(2);
          const mbps = (kbps / 1000).toFixed(2);
          resolve({ bps, kbps, mbps });
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async checkUploadSpeed(fileSizeInBytes = 2000000) {
    let startTime;
    const defaultData = this.generateTestData(fileSizeInBytes / 1000);
    const data = JSON.stringify({ defaultData });
    
    try {
      return await new Promise(async (resolve, reject) => {
        try {
          startTime = new Date().getTime();
          await $api.post("/uploadSpeed", data, {
            onUploadProgress: (progressEvent) => {
              if (!startTime) {
                startTime = new Date().getTime();
              }
            },
          });

          const endTime = new Date().getTime();
          const duration = (endTime - startTime) / 1000;
          const bitsLoaded = fileSizeInBytes * 8;
          const bps = (bitsLoaded / duration).toFixed(2);
          const kbps = (bps / 1000).toFixed(2);
          const mbps = (kbps / 1000).toFixed(2);
          resolve({ bps, kbps, mbps });
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  static async checkPing(fileSizeInBytes = 64) {
    let startTime;
    const defaultData = this.generateTestData(fileSizeInBytes / 1000);
    const data = JSON.stringify({ defaultData });
    try {
      return await new Promise(async (resolve, reject) => {
        try {
          startTime = new Date().getTime();
          await $api.post("/uploadSpeed", data, {
            onUploadProgress: (progressEvent) => {
              if (!startTime) {
                startTime = new Date().getTime();
              }
            },
          });

          const endTime = new Date().getTime();
          const duration = (endTime - startTime) ;

          resolve(duration);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  static validateDownloadSpeedParams(baseUrl, fileSizeInBytes) {
    if (typeof baseUrl !== "string") {
      throw new Error("baseUrl must be a string");
    }
    if (typeof fileSizeInBytes !== "number") {
      throw new Error("fileSizeInBytes must be a number");
    }
    return;
  }

  static generateTestData(sizeInKb) {
    const iterations = sizeInKb * 1000; //get byte count
    let result = "";
    for (let index = 0; index < iterations; index++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
