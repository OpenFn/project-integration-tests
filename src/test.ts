import path from "node:path";
import { mkdir } from "node:fs/promises";
import { test as bunTest } from "bun:test";
import type Project from "@openfn/project";

export type TestContext = {};

export class Context {
  /** Root folder for this test */
  root: string;
  /** Safe/escaped name of this test */
  name: string;
  constructor(root: string, name: string) {
    this.root = root;
    this.name = name;
  }
  async createFile(filename: string, contents = "") {
    return Bun.write(path.join(this.root, filename), contents);
  }
  // serialize a project into a yaml file
  async serialize(name: string, project: Project) {
    const yaml = project.serialize("state"); // v1 state file (v2 state will be better)
    await this.createFile(`${name}.yaml`, yaml);
    return yaml;
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
  const p = path.join("tmp", folder, file, name);

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
  console.log(" >> ", path.join(context.root, filename));
  await Bun.write(path.join(context.root, filename), contents);
};
