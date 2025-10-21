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

export const test = async () => {
  const result = await $`mix --version`.cwd(lightningPath);

  return result.text();
};
