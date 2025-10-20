import path from "node:path";
import Project from "@openfn/project";
import { $ } from "bun";
import { loadArgs } from "./util";

const options = loadArgs();

const lightningPath = options.lng;

// Get an absolute file path relative to
const file = (ctx, name) => {};

export const welcome = () => {
  console.log("⚡️  Executing tests with the Lightning runner");
};

export const test = async () => {
  const result = await $`mix ecto.migrations`.cwd(lightningPath).quiet();

  return result.text();
};
