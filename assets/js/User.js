export class User {
  constructor(firstName, lastName, email, password, role) {
    this.id = crypto.randomUUID();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
    // this.favorites = [];
    this.createdAt = Date.now();
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  //   addFavorite(carId) {
  //     this.favorites.push(carId);
  //   }

  //   removeFavorite(carId) {
  //     this.favorites = this.favorites.filter((id) => id !== carId);
  //   }

  isAdmin() {
    return this.role === "admin";
  }
}
