import Project, { generateProject } from "@openfn/project";
import { afterEach } from "bun:test";

import initTest, { Context } from "../../src/test";
import loadRunner from "../../src/runner";
import { deepEquals } from "bun";

const test = initTest(import.meta.filename);

// This will load a CLI or Lightning runner based on the run command
const runner = loadRunner();

let seed = 0;

// serialize a project based on a workflow spec
// will be written to a file like "<name>.yaml"
// ie, "source.yaml"
async function gen(ctx: Context, name: string, wf: string, uuidMap?: any) {
  const proj = generateProject(name, [wf], {
    openfnUuid: true,
    uuidSeed: ++seed,
    uuidMap: uuidMap ? [uuidMap] : [],
  });
  await ctx.serialize(name, proj);
  return proj;
}

afterEach(() => {
  seed = 0;
});

/**
 * This function will ensure that project a is the same as project b
 * This is simply a deep equals on the json representation (which includes uuids)
 */
const projectEquals = (a: Project, b: Project) => {
  const a_json = a.serialize("json");
  const b_json = b.serialize("json");
  return deepEquals(a_json, b_json);
};

test("should merge two workflows", async (ctx) => {
  const main = await gen(
    ctx,
    "main",
    `
      x-y
      y-z(adaptor=http)
`
  );
  await gen(
    ctx,
    "staging",
    `
        x-y
        y-z(adaptor=dhis2)
  `
  );

  // TODO need to pass a UUID map for each node here
  const expectedUUIDs = main.getUUIDMap();
  const expected = await gen(
    ctx,
    "expected",
    `
        x-y
        y-z(adaptor=dhis2)
      `,
    expectedUUIDs
  );
  // this will use CLI or lightning, based on test config
  // This needs to return the merged statefile
  const result = await runner.merge("staging.yaml", "main.yaml", {
    dir: ctx.root,
  });

  projectEquals(result, expected);
});
