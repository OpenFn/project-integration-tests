// basic tests against the CLI helpers

import initTest from "../../src/test";

const test = initTest(import.meta.filename);

test.skip("should execute a workflow", (ctx) => {
  ctx.createFile(ctx.name + ".json", "hello world");
  // generate a project
  // write it to disk (where? how?)
  // run the CLI against it, saving to a file
  // test the result against the expected
});
