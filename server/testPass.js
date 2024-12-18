const bcrypt = require('bcrypt');
const password = '123'; // Usa la password che hai registrato
const hashedPassword =
  '$2b$10$zkXrGartVjP7iPgmFf2pU.Bvqg9DwiPkH7gwQGCGEonhAiwgfMu.S'; // L'hash registrato

bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log('Password match:', result); // Dovrebbe essere true
});
