import { removeFromSessionStorage, saveDataToSessionStorage } from "./storage.js";

export class AuthService {
  static logout() {
    removeFromSessionStorage("user");
  }

  static login(user) {
    saveDataToSessionStorage("user", user);
  }
}
