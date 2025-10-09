import Project from "@openfn/project";
import { expect } from "bun:test";

import initTest from "../../src/test";
import loadRunner from "../../src/runner";

const test = initTest(import.meta.filename);

// This will load a CLI or Lightning runner based on the run command
const runner = loadRunner();

// serialize a project based on a workflow spec
// will be written to a file like "<name>.project.yaml"
// ie, "source.project.yaml"
async function gen(ctx, name, wf: string) {
  const proj = new Project({
    name: "jam",
    workflows: [
      {
        name: "a",
        steps: [
          {
            id: "x",
            name: "x",
            expression: "x()",
            next: {
              y: {
                openfn: {
                  uuid: 5,
                },
              },
            },
            openfn: {
              uuid: 2,
            },
          },
          {
            id: "y",
            name: "y",
            expression: "y()",
            openfn: {
              uuid: 2,
            },
          },
        ],
        openfn: {
          uuid: 1,
        },
      },
    ],
  });
  proj.openfn = {
    uuid: 66,
  };
  await ctx.serialize(name, proj);
  return proj;
}

test("should merge two workflows", async (ctx) => {
  const main = await gen(
    ctx,
    "main",
    `
      x-y
      y-z(adaptor=http)
`
  );
  const staging = gen(
    ctx,
    "staging",
    `
        x-y
        y-z(adaptor=dhis2)
  `
  );
  const expected = gen(
    ctx,
    "expected",
    `
        x-y
        y-z(adaptor=dhis2)
      `
  );
  // this will use CLI or lightning, based on test config
  // This needs to return the merged statefile
  const result = await runner.merge("staging.yaml", "main.yaml", {
    dir: ctx.root,
  });

  console.log(result);

  // Now we need to read the pr

  //   // custom assertion
  //   projectEquals(result, expected);
});
