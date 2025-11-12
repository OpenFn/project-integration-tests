import { test as bunTest } from "bun:test";
import initTest, {
  assertState,
  Context,
  testMerge as merge,
} from "../../../src/test";

const test = initTest(bunTest, import.meta.filename);

// test of mapping steps when a name changes

test("preserve id change", async (ctx: Context) => {
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

// todo change id and adaptor
// todo change id and expression
// todo change id and parent
// todo change multiple?
