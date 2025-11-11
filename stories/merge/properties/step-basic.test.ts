import initTest, { Context, testMerge as merge } from "../../../src/test";

const test = initTest(import.meta.filename);

// These are tests on "basic" merges, which I define
// as anything without an id change

test("merge adaptor change", async (ctx: Context) => {
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

test("ignore project credential change", async (ctx: Context) => {
  const main = `x(project_credential_id=a)-y`;
  const staging = `x(project_credential_id=b)-y`;
  const expected = `x(project_credential_id=a)-y`;

  await merge(ctx, main, staging, expected);
});

// TODO this might change in the near future
test("ignore new project credential", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x(project_credential_id=b)-y`;
  const expected = `x-y`;

  await merge(ctx, main, staging, expected);
});

test("ignore keychain credential change", async (ctx: Context) => {
  const main = `x(keychain_credential_id=a)-y`;
  const staging = `x(keychain_credential_id=b)-y`;
  const expected = `x(keychain_credential_id=a)-y`;

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

// TODO should these go into a new suite called structure-basic?
// Like these are tests on changing the workflow structure,
// they don't affect node properties

test("merge a new child of a leaf", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-y y-z`;
  const expected = `x-y y-z`;

  // This both:
  // 1. sets any newly generated UUIDs to these values in the merge result
  // 2. sets the expected workflow to use these uuids
  const newUuids = {
    z: "new-node",
    "y-z": "new-edge",
  };

  await merge(ctx, main, staging, expected, newUuids);
});

test("merge a new child of the root", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-y x-z`;
  const expected = `x-y x-z`;
  const newUuids = {
    z: "new-node",
    "x-z": "new-edge",
  };

  await merge(ctx, main, staging, expected, newUuids);
});

// TODO is this valuable? Is this hard for any reason?
test("merge a third child", async (ctx: Context) => {
  const main = `x-y x-z`;
  const staging = `x-y x-z x-a`;
  const expected = `x-y x-z x-a`;
  const newUuids = {
    a: "new-node",
    "x-a": "new-edge",
  };

  await merge(ctx, main, staging, expected, newUuids);
});

test("merge two new child nodes", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-y y-a y-b`;
  const expected = `x-y y-a y-b`;
  const newUuids = {
    a: "a",
    "y-a": "y-a",
    b: "b",
    "y-b": "y-b",
  };

  await merge(ctx, main, staging, expected, newUuids);
});
