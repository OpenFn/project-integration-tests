import initTest, { Context, testMerge as merge } from "../../../src/test";

const test = initTest(import.meta.filename);

// These are tests on "basic" merges on edges, which I define
// as anything without an id change

// TODO this passes right now  - but as commented in kit code
// I think enabled state is an option and shouldn't sync!
test("merge disabling an edge", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-(disabled=true)-y`;
  const expected = `x-(disabled=true)-y`;

  await merge(ctx, main, staging, expected);
});

test("merge enabling an edge", async (ctx: Context) => {
  const main = `x-(disabled=true)-y`;
  const staging = `x-(disabled=false)-y`;
  const expected = `x-(disabled=false)-y`;

  await merge(ctx, main, staging, expected);
});

// Turns out I can't test any of the edge condition stuff thanks to https://github.com/OpenFn/kit/issues/1123
test.skip("merge adding an edge condition", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-(condition="!state.errors")-y`;
  const expected = `x-(condition="!state.errors")-y`;

  await merge(ctx, main, staging, expected);
});

test.skip("merge changing an edge condition", async (ctx: Context) => {
  const main = `x-(condition="!state.errors")-y`;
  const staging = `x-(condition="false")-y`;
  const expected = `x-(condition="false")-y`;

  await merge(ctx, main, staging, expected);
});

// This is also not tracked at the moment
test.skip("merge adding an edge label", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-(label=a)-y`;
  const expected = `x-(label=a)-y`;

  await merge(ctx, main, staging, expected);
});

test.skip("merge changing an edge label", async (ctx: Context) => {
  const main = `x-(label=a)-y`;
  const staging = `x-(label=b)-y`;
  const expected = `x-(label=b)-y`;

  await merge(ctx, main, staging, expected);
});

test.skip("merge removing  edge label", async (ctx: Context) => {
  const main = `x-(label=a)-y`;
  const staging = `x-y`;
  const expected = `x-y`;

  await merge(ctx, main, staging, expected);
});
