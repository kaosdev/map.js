const fs = require("fs-extra");

fs.copy("../../dist", "./dist", (err) => {
  if (err) {
    console.error(err);
  }
});
