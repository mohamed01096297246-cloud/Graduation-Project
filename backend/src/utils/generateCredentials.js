const generateUsername = (fullName) => {
  return fullName.replace(/\s/g, "").toLowerCase() + Math.floor(Math.random() * 1000);
};

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

module.exports = {
  generateUsername,
  generatePassword,
};
