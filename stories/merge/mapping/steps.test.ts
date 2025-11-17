import { test as bunTest } from "bun:test";
import initTest, {
  assertState,
  Context,
  testMerge as merge,
} from "../../../src/test";

const test = initTest(bunTest, import.meta.filename);

// Test mapping steps when a name changes

test("preserve uuid when only the name changes", async (ctx: Context) => {
  const main = `x-y`;
  const staging = `x-z`;
  const expected = `x-z`;

  const newUuids = {
    z: 1002, // map z to to the old y node
    // also ensure the edge is preserved
    "x-z": 1003,
  };

  await merge(ctx, main, staging, expected, {
    newUuids,
    passUUIDsToMerge: false, // don't let the merge algorithm see these mappings
  });

  // Ensure that the original node was named x and has id 1001
  await assertState(ctx, "main", "workflows[0].jobs[1].name", "y");
  await assertState(ctx, "main", "workflows[0].jobs[1].id", 1002);
  // ... and check the id of the edge
  await assertState(ctx, "main", "workflows[0].edges[0].id", 1003);

  // Ensure that after merging, node 1001 has changed name to z
  await assertState(ctx, "result", "workflows[0].jobs[1].name", "z");
  await assertState(ctx, "result", "workflows[0].jobs[1].id", 1002);
  // ... and the edge UUID shouldn't change either
  await assertState(ctx, "result", "workflows[0].edges[0].id", 1003);
});

test("preserve uuid when the name and adaptor changes", async (ctx: Context) => {
  const main = `x-y(adaptor=common)`;
  const staging = `x-z(adaptor=http)`;
  const expected = `x-z(adaptor=http)`;

  const newUuids = {
    z: 1002, // map z to to the old y node
    // also ensure the edge is preserved
    "x-z": 1003,
  };

  await merge(ctx, main, staging, expected, {
    newUuids,
    passUUIDsToMerge: false, // don't let the merge algorithm see these mappings
  });

  // Ensure that after merging, node 1001 has changed name and adaptor but preserved UUID
  await assertState(ctx, "result", "workflows[0].jobs[1].name", "z");
  await assertState(ctx, "result", "workflows[0].jobs[1].adaptor", "http");
  await assertState(ctx, "result", "workflows[0].jobs[1].id", 1002);
  // ... and the edge UUID shouldn't change either
  await assertState(ctx, "result", "workflows[0].edges[0].id", 1003);
});

test("preserve uuid when the name and expression changes", async (ctx: Context) => {
  const main = `x-y(expression=a)`;
  const staging = `x-z(expression=b)`;
  const expected = `x-z(expression=b)`;

  const newUuids = {
    z: 1002, // map z to to the old y node
    // also ensure the edge is preserved
    "x-z": 1003,
  };

  await merge(ctx, main, staging, expected, {
    newUuids,
    passUUIDsToMerge: false, // don't let the merge algorithm see these mappings
  });

  // Ensure that after merging, node 1001 has changed name and expression but preserved UUID
  await assertState(ctx, "result", "workflows[0].jobs[1].name", "z");
  await assertState(ctx, "result", "workflows[0].jobs[1].body", "b");
  await assertState(ctx, "result", "workflows[0].jobs[1].id", 1002);
  // ... and the edge UUID shouldn't change either
  await assertState(ctx, "result", "workflows[0].edges[0].id", 1003);
});

test("generate new uuid when the name and parent change on a leaf node and there is no other context", async (ctx: Context) => {
  const main = `a-b b-c`;
  const staging = `a-b a-x`;
  const expected = `a-b a-x`;

  const newUuids = {
    x: 5001,
    "a-x": 5002,
  };

  await merge(ctx, main, staging, expected, {
    newUuids,
  });

  // Ensure that after merging, node 1001 has changed name and expression but preserved UUID
  await assertState(ctx, "result", "workflows[0].jobs[2].name", "x");
  await assertState(ctx, "result", "workflows[0].jobs[2].id", 5001);
});

test("preserve uuid when the name and parent change on a leaf (different adaptors)", async (ctx: Context) => {
  const main = `a(adaptor=a)-x(adaptor=x) x-y(adaptor=y)`;
  const staging = `a(adaptor=a)-x(adaptor=x) a-y(adaptor=y)`;
  const expected = `a(adaptor=a)-x(adaptor=x) a-y(adaptor=y)`;

  const newUuids = {
    "a-y": 1100, // fix the UUID for the new edge (but this isn't what lightning will generate)
  };

  await merge(ctx, main, staging, expected, {
    newUuids,
    // Note that we need to pass the new edge id to lightning here
    // so that we can predict the value
  });

  // Ensure node UUIDs and names after merging
  await assertState(ctx, "result", "workflows[0].jobs[0].name", "a");
  await assertState(ctx, "result", "workflows[0].jobs[0].id", 1001);

  await assertState(ctx, "result", "workflows[0].jobs[1].name", "x");
  await assertState(ctx, "result", "workflows[0].jobs[1].id", 1002);

  await assertState(ctx, "result", "workflows[0].jobs[2].name", "y");
  await assertState(ctx, "result", "workflows[0].jobs[2].id", 1004);
});

test("preserve uuid when the name and parent change on an internal node (no context)", async (ctx: Context) => {
  const main = `a-x x-y y-z`;
  const staging = `a-x a-y y-z`;
  const expected = `a-x a-y y-z`;

  const newUuids = {
    "a-y": 1100, // fix the UUID for the new edge (but this isn't what lightning will generate)
  };

  await merge(ctx, main, staging, expected, {
    newUuids,
    // Note that we need to pass the new edge id to lightning here
    // so that we can predict the value
  });

  // Ensure node UUIDs and names after merging
  await assertState(ctx, "result", "workflows[0].jobs[0].name", "a");
  await assertState(ctx, "result", "workflows[0].jobs[0].id", 1001);

  await assertState(ctx, "result", "workflows[0].jobs[1].name", "x");
  await assertState(ctx, "result", "workflows[0].jobs[1].id", 1002);

  await assertState(ctx, "result", "workflows[0].jobs[2].name", "y");
  await assertState(ctx, "result", "workflows[0].jobs[2].id", 1004);
});

// This basically looks like a bug case to the user
// But we should really be able to track this node!
// 1 added + 1 removed probably means 1 changed
// uh maybe
test.skip("generate new uuid when the name, parent and children change on a leaf node and there is no other context", async (ctx: Context) => {
  const main = `a-b b-c`;
  const staging = `a-b b-x`;
  const expected = `a-b b-x`;

  const newUuids = {
    x: 5001, // We expect (wrongly?) a new UUID here!
    "b-x": 5001,
  };

  await merge(ctx, main, staging, expected, {
    newUuids,
    // passUUIDsToMerge: false, // don't let the merge algorithm see these mappings
  });

  // Ensure that after merging, node 1001 has changed name and expression but preserved UUID
  await assertState(ctx, "result", "workflows[0].jobs[2].name", "x");
  await assertState(ctx, "result", "workflows[0].jobs[2].id", 5002);
});
