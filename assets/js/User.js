export class User {
  constructor(
    firstName,
    lastName,
    email,
    password,
    role,
    profilePhotoUrl = null,
  ) {
    this.id = crypto.randomUUID();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.profilePhotoUrl =
      profilePhotoUrl || "assets/images/icons/profile photo.png";
    this.createdAt = Date.now();
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin() {
    return this.role === "admin";
  }
}
