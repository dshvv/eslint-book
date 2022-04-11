const fs = require("fs");

const numReg = /第(\S*)章/;

fs.readdir("./docs", (err, files) => {
  if (err) {
    console.log(err);
  } else {
    const sidebar = files.filter(
      (item) => item.indexOf(".md") > -1 && item !== "index.md"
    );
    sidebar.sort((a, b) => {
      const aVal = parseInt(a.match(numReg)[1]);
      const bVal = parseInt(b.match(numReg)[1]);
      if (aVal < bVal) {  return -1; }
      if (aVal > bVal) {  return 1; }
      if (aVal === bVal) { return 0; }
    });
    sidebar.unshift("index.md");
    const content = `module.exports =${JSON.stringify(sidebar)}`;
    fs.writeFile("./utils/sidebar.js", content, { encoding: "utf8" }, (err) => {
      console.log(err);
    });
  }
});