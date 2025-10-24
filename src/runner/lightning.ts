import path from "node:path";
import Project from "@openfn/project";
import { $ } from "bun";
import { loadArgs } from "./util";

const options = loadArgs();

const lightningPath = options.lng;

if (!lightningPath) {
  console.error('"LIGHTNING PATH NOT SET');
  process.exit(1);
}

// Get an absolute file path relative to
const file = (ctx, name) => {};

export const welcome = () => {
  console.log("⚡️  Executing tests with the Lightning runner");
};

type Options = {
  dir: string; // root dir to run in
};

export const test = async () => {
  const result = await $`mix --version`.cwd(lightningPath);

  return result.text();
};

export const merge = async (
  source: string,
  target: string,
  options: Options
) => {
  const sourceAbs = path.resolve(options.dir, source);
  const targetAbs = path.resolve(options.dir, target);
  const result =
    await $`mix lightning.merge_projects ${sourceAbs} ${targetAbs}`.cwd(
      lightningPath
    );
  console.log({ result: result.text() });

  // this returns us a new state file

  return Project.from("state", result);
};
