import fs from "fs";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt({ typographer: true });

function promisingOne<A1, T>(
  fn: (arg: A1, cb: (err: Error, res: T) => void) => void,
  arg: A1
): Promise<T> {
  return new Promise((resolve, reject) =>
    fn(arg, (err: Error, res: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );
}
export async function build() {
  const contents = await promisingOne<fs.PathLike, string[]>(
    fs.readdir,
    "content"
  );
  console.log(contents);
  let renders: { [index: string]: string } = {};
  for (let file of contents) {
    const fileBuffer = await promisingOne(fs.readFile, `content/${file}`);
    const rendered = md.render(fileBuffer.toString());
    renders[file] = rendered;
  }

  // for (let render in renders) {
  // }
}
