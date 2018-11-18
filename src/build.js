const fs = require("fs");
const md = require("markdown-it")({ typographer: true });

const promising = (fn, ...args) =>
  new Promise((resolve, reject) =>
    fn(...args, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );

const main = async () => {
  const contents = await promising(fs.readdir, "content");
  console.log(contents);
  let renders = {};
  for (file of contents) {
    const fileBuffer = await promising(fs.readFile, `content/${file}`);
    const rendered = md.render(fileBuffer.toString());
    renders[file] = rendered;
  }

  for (render in renders) {
  }
};

main();
