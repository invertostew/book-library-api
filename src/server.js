const app = require("./app");

const APP_PORT = process.env.APP_PORT || 4000;

app.listen(APP_PORT, () => {
  console.log(`App listening on http://localhost:${APP_PORT} 🚀`);
});
