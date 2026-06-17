function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-`9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function validatePassword(password) {
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>_]{8,}$/;
  return passwordPattern.test(password);
}

function validateName(name) {
  const namePattern = /^[A-Za-z]{2,50}$/;
  return namePattern.test(name);
}

function validatePasswordMatch(password, retypePassword) {
  return password === retypePassword;
}

function checkExistingUser(email, users) {
  return users.some((user) => user.email === email);
}

export {
  validateName,
  validatePassword,
  validateEmail,
  validatePasswordMatch,
  checkExistingUser,
};
