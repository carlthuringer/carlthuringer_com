import fs from "fs";
import { basename } from "path";
import MarkdownIt from "markdown-it";

type Dict = { [index: string]: string };

const promisingOne = <A1, T>(
  fn: (arg: A1, cb: (err: Error, res: T) => void) => void,
  arg: A1
): Promise<T> =>
  new Promise((resolve, reject) =>
    fn(arg, (err: Error, res: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );

type TemplateFn = (binds: Dict) => string;

export type Environment = {
  content: Dict;
  templates: {
    [index: string]: TemplateFn;
  };
};

export const build = async () => {
  let env = await init();
  let outputs = compileTemplates(env);
  await write(outputs);
};

const init = async (): Promise<Environment> => {
  const md = new MarkdownIt({ typographer: true });
  let env: Environment = { content: {}, templates: { index: indexTemplate } };
  const contentFiles = await promisingOne<fs.PathLike, string[]>(
    fs.readdir,
    "content"
  );

  for (let file of contentFiles) {
    const fileBuffer = await promisingOne(fs.readFile, `content/pages/${file}`);
    const rendered = md.render(fileBuffer.toString());
    env.content[basename(file, ".md")] = rendered;
  }

  return env;
};

const indexTemplate: TemplateFn = binds =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Carl Thuringer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="Description" content="Carl Thuringer's Blog.">
    <meta charset="utf-8">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon_180.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon_32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon_16.png">
  </head>
  <body>
  ${binds.body}
  </body>
  </html>
  `;

const mapDict = (xs: Dict, fn: (x: string) => string): Dict => {
  let r: Dict = {};
  for (let x in xs) {
    r[x] = fn(xs[x]);
  }
  return r;
};

const compileTemplates = (env: Environment) =>
  mapDict(env.content, c => env.templates.index({ body: c }));

const write = async (compiledTemplates: Dict) => {
  for (let template in compiledTemplates) {
    await fs.writeFileSync(
      `dist/${template}.html`,
      compiledTemplates[template]
    );
  }
};
