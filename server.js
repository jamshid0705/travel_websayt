const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env)
const PORT = process.env.PORT || 3000;
// 4 start server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
