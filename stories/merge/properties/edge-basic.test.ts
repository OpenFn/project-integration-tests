import initTest, { Context, testMerge as merge } from "../../../src/test";

const test = initTest(import.meta.filename);

// These are tests on "basic" merges on edges, which I define
// as anything without an id change

// TODO need support from the generator for this
test.skip("merge disabling an edge", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-(enabled=false)-y`;
  const expected = `x-(enabled=false)-y`;

  await merge(ctx, main, staging, expected);
});

test.skip("merge enabling an edge", async (ctx: Context) => {
  const main = `x-(enabled=false)-y`;
  const staging = `x-(enabled=true)-y`;
  const expected = `x-(enabled=true)-y`;

  await merge(ctx, main, staging, expected);
});

test.skip("merge adding an edge condition", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-(condition=!state.errors)-y`;
  const expected = `x-(condition=!state.errors)-y`;

  await merge(ctx, main, staging, expected);
});

test.skip("merge changing an edge condition", async (ctx: Context) => {
  const main = `x-(condition=!state.errors)-y`;
  const staging = `x-(condition=false)-y`;
  const expected = `x-(condition=false)-y`;

  await merge(ctx, main, staging, expected);
});

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
