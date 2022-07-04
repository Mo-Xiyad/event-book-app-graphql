import { Transform } from 'jscodeshift';
import { parse as pathParse, join as pathJoin } from 'node:path';
import * as fs from 'node:fs';

const rootPath = pathJoin(__dirname, '../');

const getFileDir = filepath => {
  const { dir } = pathParse(filepath);
  return dir;
};

const transform: Transform = (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const importExpressions = root
    .find(j.ImportDeclaration)
    .replaceWith(nodePath => {
      const { node } = nodePath;

      const fileDir = getFileDir(fileInfo.path);
      // console.log(node.source.value);
      const importPath = node.source.value as string;

      // Do not change imports ending with .js
      if (importPath.endsWith('.js')) {
        return node;
      }

      // Do not change imports that are not relative (eg, modules etc)
      if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
        return node;
      }

      // if it's importing eql, lets just add index.js and done
      if (importPath.endsWith('eql')) {
        node.source.value = `${node.source.value}/index.js`;
        return node;
      }

      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const filePath = pathJoin(rootPath, fileDir, importPath);

        try {
          const isDir = fs.lstatSync(filePath).isDirectory();
          if (isDir) {
            node.source.value = `${node.source.value}/index.js`;
          } else {
            node.source.value = `${node.source.value}.js`;
          }
        } catch {
          // file is not a directory, so we can add js
          node.source.value = `${node.source.value}.js`;
        }
        return node;
      }

      return node;
    });

  return root.toSource();
};

export default transform;

/* 
you can try running it with
npx jscodeshift -t transforms/import-js.ts lib/sync/syncRentableItemsWithItemSource.js --dry --print

for example, then you will see the transformed code printed ( to check that its correct)
do that on some files that have complex changes, and see that its working like it should

then you can run it on all the files and see what happens :smile:

but you should start testing it on some files to see that the logic is correct

transforms/import-js.ts (edited) 

npx jscodeshift -t transforms/import-js.ts ./(FILE OR DIR PATH) --dry --print
 */
