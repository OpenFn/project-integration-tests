import initTest, {
  assertState,
  Context,
  testMerge as merge,
} from "../../../src/test";

const test = initTest(import.meta.filename);

// These are tests on "basic" merges, which I define
// as anything without an id change

test("merge adaptor change", async (ctx: Context) => {
  const main = `x(adaptor=a)-y`;
  const staging = `x(adaptor=b)-y`;
  const expected = `x(adaptor=b)-y`;

  await merge(ctx, main, staging, expected);

  await assertState(ctx, "result", "workflows[0].jobs[0].adaptor", "b");
});

test("merge expression change", async (ctx: Context) => {
  const main = `x(expression=a)-y`;
  const staging = `x(expression=b)-y`;
  const expected = `x(expression=b)-y`;

  await merge(ctx, main, staging, expected);

  await assertState(ctx, "result", "workflows[0].jobs[0].body", "b");
});

test("ignore project credential change", async (ctx: Context) => {
  const main = `x(project_credential_id=a)-y`;
  const staging = `x(project_credential_id=b)-y`;
  const expected = `x(project_credential_id=a)-y`;

  await merge(ctx, main, staging, expected);

  await assertState(
    ctx,
    "result",
    "workflows[0].jobs[0].project_credential_id",
    "a"
  );
});

// This might change in the near future - it would make sense to merge
// credentials for new nodes
test("ignore new project credential", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x(project_credential_id=b)-y`;
  const expected = `x-y`;

  await merge(ctx, main, staging, expected);

  await assertState(
    ctx,
    "result",
    "workflows[0].jobs[0].project_credential_id",
    null
  );
});

test("ignore keychain credential change", async (ctx: Context) => {
  const main = `x(keychain_credential_id=a)-y`;
  const staging = `x(keychain_credential_id=b)-y`;
  const expected = `x(keychain_credential_id=a)-y`;

  await merge(ctx, main, staging, expected);

  await assertState(
    ctx,
    "result",
    "workflows[0].jobs[0].keychain_credential_id",
    "a"
  );
});

test("merge name change", async (ctx: Context) => {
  const main = `x(name=a)-y`;
  const staging = `x(name=b)-y`;
  const expected = `x(name=b)-y`;

  await merge(ctx, main, staging, expected);

  await assertState(ctx, "result", "workflows[0].jobs[0].name", "b");
});

// Random keys won't serialize to state, so they'll be accidentally
// ignored in these tests. Not a good test.
test("ignore random key change", async (ctx: Context) => {
  const main = `x(foo=a)-y`;
  const staging = `x(foo=b)-y`;

  const expected1 = `x-y`;

  await merge(ctx, main, staging, expected1);
});
