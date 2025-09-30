import { $ } from "bun";
import path from "node:path";
import { mkdir } from "node:fs/promises";

type Args = Record<string, string | number | boolean>;

export type TestContext = {
  /** Root folder for this test */
  root: string;
  /** Safe/escaped name of this test */
  name: string;
};

const maybeEscape = (str: string) => {
  if (str.match(" ")) {
    return `"${str}"`;
  }
  return str;
};

export const mapArgs = (args: Args): string =>
  Object.entries(args)
    .reduce((arr, [key, value]) => {
      arr.push(`${key}=${maybeEscape(value)}`);
      return arr;
    }, [])
    .join(" ");

// simple wrapper to execute commands in a JS-y way
export const cmd = (positionals: string, args: Args) => {
  return $`${positionals} ${mapArgs(args)}`;
};

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
