// basic tests against the CLI helpers

import { expect, test as bunTest } from "bun:test";
import path from "node:path";
import {
  createFile,
  getTestName,
  setupTestDir,
  type TestContext,
} from "../../src/runner/helper";

const folder = path.basename(path.dirname(import.meta.filename));
const file = path.basename(import.meta.filename, ".test.ts");

// Util to wrap tests in some infrastructure to generate a working folder
// TODO how can I include a describe in the path?
const test = async (name: string, fn: (ctx: TestContext) => void) => {
  //  register with bun - this must be synchronous!
  return bunTest(name, async () => {
    // So do all async setup inside the test
    const safename = getTestName(name);
    const root = await setupTestDir(folder, file, safename);
    const context = {
      root,
      name: safename,
    };

    // Now run the user test, passing in context
    fn(context);
  });
};

test("should execute a workflow", (ctx) => {
  console.log(ctx);

  // TODO or ctx.create file is better
  createFile(ctx, ctx.name + ".json", "hello world");
  // generate a project
  // write it to disk (where? how?)
  // run the CLI against it, saving to a file
  // test the result against the expected
});
