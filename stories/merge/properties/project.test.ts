import initTest, { Context, testMerge as merge } from "../../../src/test";

const test = initTest(import.meta.filename);

// tests of merging top level project properties
// ie, credential access, name change

// oh this doesn't work, it'll create a new workflow!
test("merge name change", async (ctx: Context) => {
  const main = `@name abc t-x`;
  const staging = `@name xyz t-x`;
  const expected = `@name xyz t-x`;

  await merge(ctx, main, staging, expected);
});
