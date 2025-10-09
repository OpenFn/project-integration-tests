import Project from "@openfn/project";
import { expect } from "bun:test";

import initTest from "../../src/test";

const test = initTest(import.meta.filename);

// serialize a project based on a workflow spec
// will be written to a file like "<name>.project.yaml"
// ie, "source.project.yaml"
function gen(ctx, name, wf: string) {
  const proj = new Project({
    workflows: [
      {
        name: "a",
        steps: [
          {
            id: "x",
            next: {
              y: {},
            },
          },
          {
            id: "y",
          },
        ],
      },
    ],
  });
  ctx.serialize(name, proj);
  return proj;
}

test("a", async (ctx) => {
  expect(1).toEqual(1);
});

test("b", async (ctx) => {
  expect(1).toEqual(1);
});

test.skip("c", async (ctx) => {
  expect(1).toEqual(1);
});
// This is what I want to get working
// test.only("should merge two workflows", async (ctx) => {
//   expect(1).toEqual(1);
//   const main = gen(
//     ctx,
//     "target",
//     `
//       x-y
//       y-z(adaptor=http)
// `
//   );
//   const staging = gen(
//     ctx,
//     "staging",
//     `
//       x-y
//       y-z(adaptor=dhis2)
// `
//   );
//   const expected = gen(
//     ctx,
//     "expected",
//     `
//       x-y
//       y-z(adaptor=dhis2)
//     `
//   );
//   const result = await merge(); // this will use CLI or lightning, based on test config
//   // custom assertion
//   projectEquals(result, expected);
// });
