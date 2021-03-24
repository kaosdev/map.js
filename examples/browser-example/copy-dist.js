const fs = require("fs-extra");

fs.copy("../../esm", "./esm", (err) => {
  if (err) {
    console.error(err);
  }
});

fs.copy("../../css", "./css", (err) => {
  if (err) {
    console.error(err);
  }
});
