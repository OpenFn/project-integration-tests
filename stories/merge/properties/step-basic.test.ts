import initTest, { Context, testMerge as merge } from "../../../src/test";

const test = initTest(import.meta.filename);

// These are tests on "basic" merges, which I define
// as anything without an id change

test.only("merge adaptor change", async (ctx: Context) => {
  const main = `x(adaptor=a)-y`;
  const staging = `x(adaptor=b)-y`;
  const expected = `x(adaptor=b)-y`;

  await merge(ctx, main, staging, expected);
});

test("merge expression change", async (ctx: Context) => {
  const main = `x(expression=a)-y`;
  const staging = `x(expression=b)-y`;
  const expected = `x(expression=b)-y`;

  await merge(ctx, main, staging, expected);
});

test("merge credential change", async (ctx: Context) => {
  const main = `x(credential=a)-y`;
  const staging = `x(credential=b)-y`;
  const expected = `x(credential=b)-y`;

  await merge(ctx, main, staging, expected);
});

test("merge name change", async (ctx: Context) => {
  const main = `x(name=a)-y`;
  const staging = `x(name=b)-y`;
  const expected = `x(name=b)-y`;

  await merge(ctx, main, staging, expected);
});

// the random key doesn't serialize to app state in any case
// so I suppose yes this is an ignore - but the expected could be about anything
test("ignore random key change", async (ctx: Context) => {
  const main = `x(foo=a)-y`;
  const staging = `x(foo=b)-y`;

  // These all pass!! Which is a bit strange really
  // It's an artefact of serializing to app state json
  // the unknown key is never serialized to state and so not even considered for merge
  const expected1 = `x(foo=a)-y`;
  const expected2 = `x(foo=jam)-y`;
  const expected3 = `x-y`;

  await merge(ctx, main, staging, expected1);
  await merge(ctx, main, staging, expected2);
  await merge(ctx, main, staging, expected3);
});

test("merge a new child of the root", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-y x-z`;
  const expected = `x-y x-z`;
  const newUuids = {
    z: 66, // TODO this is NOT right!!
  };

  await merge(ctx, main, staging, expected, newUuids);
});
