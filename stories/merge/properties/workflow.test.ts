import { test as bunTest } from "bun:test";
import initTest, { Context, testMerge as merge } from "../../../src/test";

const test = initTest(bunTest, import.meta.filename);

// This doesn't work = unless there's a mapping it'll create a new workflow
test.skip("merge name change", async (ctx: Context) => {
  const main = `@name abc t-x`;
  const staging = `@name xyz t-x`;
  const expected = `@name xyz t-x`;

  await merge(ctx, main, staging, expected);
});

test("ignore lock_version name change", async (ctx: Context) => {
  const main = `@openfn.lock_version 1
t-x`;
  const staging = `@openfn.lock_version 2
t-x`;
  const expected = main;

  await merge(ctx, main, staging, expected);
});

// TODO investigate later
test.skip("ignore timestamp change (inserted_at, updated_at)", async (ctx: Context) => {
  const main = `@openfn.inserted_at "2025-04-23T11:19:32Z"
  @openfn.updated_at "2025-04-23T11:19:32Z"
t-x`;
  const staging = `@openfn.inserted_at "2026-04-23T11:19:32Z"
  @openfn.updated_at "2026-04-23T11:19:32Z"
t-x`;
  const expected = main;

  await merge(ctx, main, staging, expected);
});

// TODO: ignore concurrency (as option or as openfn meta?)
