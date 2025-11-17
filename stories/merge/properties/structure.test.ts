import { test as bunTest } from "bun:test";
import initTest, {
  assertState,
  Context,
  testMerge as merge,
} from "../../../src/test";

const test = initTest(bunTest, import.meta.filename);

// These are tests on "basic" structural merges
// Which means adding and removing nodes without changing any ids

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

  await merge(ctx, main, staging, expected, { newUuids });
});

test("merge a new child of the root", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-y x-z`;
  const expected = `x-y x-z`;
  const newUuids = {
    z: "new-node",
    "x-z": "new-edge",
  };

  await merge(ctx, main, staging, expected, { newUuids });
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

  await merge(ctx, main, staging, expected, { newUuids });
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

  await merge(ctx, main, staging, expected, { newUuids });
});

test("merge a new edge", async (ctx: Context) => {
  const main = `x-y y-z`;
  const staging = `x-y y-z x-z`;
  const expected = `x-y y-z x-z`;

  const newUuids = {
    "x-z": "new-edge",
  };

  await merge(ctx, main, staging, expected, { newUuids });

  await assertState(ctx, "result", "workflows[0].edges[1].source_job_id", 1001);
  await assertState(ctx, "result", "workflows[0].edges[1].target_job_id", 1004);
});

test("reparent a node", async (ctx: Context) => {
  const main = `x-y y-z`;
  const staging = `x-y x-z`;
  const expected = `x-y x-z`;

  const newUuids = {
    "x-z": "new-edge",
  };

  await merge(ctx, main, staging, expected, { newUuids });
});
