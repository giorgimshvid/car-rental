function validateEmail(email) {
  const emailPattern =
    /^[A-Za-z0-9]+([._%+-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
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

async function validateImageURL(imageURL) {
  
     return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageURL;
  });
 
 
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
  validateImageURL,
};
