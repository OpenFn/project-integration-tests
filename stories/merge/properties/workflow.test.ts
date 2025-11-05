import initTest, { Context, testMerge as merge } from "../../../src/test";

const test = initTest(import.meta.filename);

// tests on changes to workflow properties, like name
// There aren't many props of interest really
/**
 *   - name: workflow 1
    id: 72ca3eb0-042c-47a0-a2a1-a545ed4a8406
    inserted_at: 2025-04-23T11:19:32Z
    updated_at: 2025-05-14T16:32:33Z
    lock_version: 9
    deleted_at: null
    concurrency: null
 */

// oh this doesn't work, it'll create a new workflow!
test("merge name change", async (ctx: Context) => {
  const main = `@name abc t-x`;
  const staging = `@name xyz t-x`;
  const expected = `@name xyz t-x`;

  await merge(ctx, main, staging, expected);
});
