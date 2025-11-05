import initTest, { Context, testMerge as merge } from "../../../src/test";

const test = initTest(import.meta.filename);

// These are tests on "basic" merges on edges, which I define
// as anything without an id change

// TODO need support from the generator for this
test("merge new edge change", async (ctx: Context) => {
  const main = `x-y x-z`;
  const staging = `x-y x-z`;
  const expected = `x-y`;

  await merge(ctx, main, staging, expected);
});
