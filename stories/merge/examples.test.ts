import initTest from "../../src/test";

const test = initTest(import.meta.filename);

// serialize a project based on a workflow spec
// will be written to a file like "<name>.project.yaml"
// ie, "source.project.yaml"
function gen(ctx, name, wf: string) {
  const project = {}; // TODO
  ctx.serialize(name, project);
  return {};
}

// This is what I want to get working
test.skip("should merge two workflows", (ctx) => {
  const main = gen(
    ctx,
    "target",
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

  const result = await merge(); // this will use CLI or lightning, based on test config

  // custom assertion
  projectEquals(result, expected);
});
