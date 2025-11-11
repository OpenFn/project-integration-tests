import path from "node:path";
import { mkdir } from "node:fs/promises";
import { test as bunTest, expect } from "bun:test";
import Project, { generateProject } from "@openfn/project";
import loadRunner from "./runner";

export type TestContext = {};

export class Context {
  /** Root folder for this test */
  root: string;
  /** Safe/escaped name of this test */
  name: string;
  uuidSeed = 0;
  constructor(root: string, name: string) {
    this.root = root;
    this.name = name;
  }
  async createFile(filename: string, contents = "") {
    return Bun.write(path.join(this.root, filename), contents);
  }
  async loadFile(fileName: string) {
    let file = await Bun.file(path.join(this.root, fileName)).text();
    if (fileName.endsWith(".json")) {
      file = JSON.parse(file);
    }
    return file;
  }
  // serialize a project into a yaml file
  async serialize(name: string, project: Project) {
    const state = project.serialize("state", { format: "json" }); // v1 state file (v2 state will be better)
    await this.createFile(`${name}.json`, JSON.stringify(state, null, 2));
    return state;
  }
}

function init(filename: string /* import.meta.filename */) {
  const wrapTest = (name: string, fn: (ctx: Context) => void) => {
    //  register with bun - this must be synchronous!
    return async () => {
      // TODO probably maybe clean the target dir before runnning?

      // So do all async setup inside the test
      const safename = getTestName(name);
      const root = await setupTestDir(folder, file, safename);

      // Now run the user test, passing in context
      return fn(new Context(root, safename));
    };
  };

  const folder = path.basename(path.dirname(filename));
  const file = path.basename(filename, ".test.ts");

  // Util to wrap tests in some infrastructure to generate a working folder
  // TODO how can I include a describe in the path?
  const test = async (name: string, fn: (ctx: Context) => void) => {
    return bunTest(name, wrapTest(name, fn));
  };

  test.skip = (name: string, fn: (ctx: Context) => void) =>
    bunTest.skip(name, fn);

  test.only = async (name: string, fn: (ctx: Context) => void) => {
    return bunTest.only(name, wrapTest(name, fn));
  };

  return test;
}

export default init;

/**
 * Helper function which:
 * magically sets up a folder like
 * tmp/stories/merge/steps-solid/should-merge-projects/
 * returns the path
 */
export const setupTestDir = async (
  folder: string,
  file: string,
  name: string
) => {
  const runner = process.env.OPENFN_RUNNER;
  const p = path.join("tmp", runner, folder, file, name);

  await mkdir(p, { recursive: true });

  return p;
};

// generate a safe test name/slug from the actual test name
export const getTestName = (name: string) =>
  name.toLowerCase().replace(/ /g, "_");

export const createFile = async (
  context: any,
  filename: string,
  contents = ""
) => {
  await Bun.write(path.join(context.root, filename), contents);
};

// serialize a project based on a workflow spec
// will be written to a file like "<name>.yaml"
// ie, "source.yaml"
export async function gen(
  ctx: Context,
  name: string,
  wf: string,
  seed: number,
  uuidMap?: Record<string, string>,
  projectName?: string,
  projectUuid?: string | number
) {
  const proj = generateProject(projectName || name, [wf], {
    openfnUuid: true,
    uuid: projectUuid,
    uuidSeed: seed,
    uuidMap: uuidMap ? [uuidMap] : [],
  });
  await ctx.serialize(name, proj);
  return proj;
}

export const projectEquals = (a: Project, b: Project) => {
  const a_json = a.serialize("json");
  const b_json = b.serialize("json");

  // remove config objects because they really don't matter
  delete a_json.config;
  delete b_json.config;

  delete a_json.meta;
  delete b_json.meta;

  expect(a_json).toEqual(b_json);
};

export const testMerge = async (
  ctx: Context,
  main: string,
  staging: string,
  expected: string,
  newUuids = {}
) => {
  const runner = loadRunner();

  const mainProject = await gen(ctx, "main", main, 1000);
  await gen(ctx, "staging", staging, 2000);

  // handle UUID mapping
  const mainUuids: any = mainProject.getUUIDMap();
  const expectedUUIDs = {
    ...mainUuids.workflow.children,
    workflow: mainUuids.workflow.self,
    ...newUuids,
  };

  await gen(
    ctx,
    "expected",
    expected,
    3000,
    expectedUUIDs,
    "main",
    mainProject.openfn?.uuid
  );
  // console.log("expected:", expectedProject.workflows[0].steps[0]?.openfn?.uuid);

  const result = await runner.merge("staging", "main", {
    dir: ctx.root,
  });
  await ctx.serialize("result", result);

  // Check that the serialized state files are the same
  // Ideally I'd do something like  Project.equals(expected)
  // But it's quite a complex operation and there are lots of defaults and
  // falsy unset values right now, so it's quite a hard comparison
  // Just reading the state files is basically a simpler test of the things that matter most
  const expected_state = await ctx.loadFile("expected.json");
  const result_state = await ctx.loadFile("result.json");
  expect(result_state).toEqual(expected_state);

  // TODO: rather than diffing the Projects,
  // should I just diff the state files that  get written to disk?
  // There are all sorts of defaults and nullish things which are immaterial and affect the diff
  // OTOH, the way a project loads and serializes should be consistent,
  // and a Project should have a good way of generating a diff
  //projectEquals(result, expectedProject);
};
