import fs from "fs";
import { basename } from "path";
import MarkdownIt from "markdown-it";

type Dict = { [index: string]: string };

export type Environment = {
  content: Dict;
};

export const build = async () => {
  let env = await init();
  let outputs = compileTemplates(env);
  await write(outputs);
};

const init = async (): Promise<Environment> => {
  const md = new MarkdownIt({ typographer: true });
  let env: Environment = { content: {} };
  const contentFiles = await new Promise<fs.Dirent[]>((res, rej) =>
    fs.readdir("content/pages", { withFileTypes: true }, (err, files) =>
      err ? rej(err) : res(files)
    )
  );

  for (let file of contentFiles) {
    if (!file.isDirectory()) {
      const fileBuffer = await new Promise<Buffer>((res, rej) =>
        fs.readFile(`content/pages/${file.name}`, (err, data) =>
          err ? rej(err) : res(data)
        )
      );
      const rendered = md.render(fileBuffer.toString());
      env.content[basename(file.name, ".md")] = rendered;
    }
  }

  return env;
};

const indexTemplate = ({ body }: Dict) =>
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
  ${body}
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
  mapDict(env.content, c => indexTemplate({ body: c }));

const write = async (compiledTemplates: Dict) => {
  for (let template in compiledTemplates) {
    await fs.writeFileSync(
      `dist/${template}.html`,
      compiledTemplates[template]
    );
  }
};
