function generateUsername(fullName) {
  if (!fullName) {
    throw new Error("Full name is required to generate username");
  }

  const base = fullName
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
}

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

module.exports = {
  generateUsername,
  generatePassword,
};
