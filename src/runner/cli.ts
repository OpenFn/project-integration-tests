import path from "node:path";
import Project from "@openfn/project";
import { $ } from "bun";
import { loadArgs } from "./util";

const options = loadArgs();

let command = options.cmd ?? "openfn";
let logOption = options.log ?? "none";

const log = `--log=${logOption}`;

type Options = {
  dir: string; // root dir to run in
};

export const welcome = () => {
  console.log("⌨️  Executing tests with the CLI runner");
  console.log(`Using command "${command}" to execute`);
};

// run commands through the CLI
// uses bun shell
// need a dir to run in
export const merge = async (
  source: string,
  target: string,
  options: Options
) => {
  // init a project file to keep the CLI happy
  // (TODO: we shouldn't need to do this, or at least just run init)
  const openfnyml = `
dirs:
  projects: .
formats:
  project: json
  `;
  await Bun.write(path.join(options.dir, "openfn.yaml"), openfnyml);

  // Checkout the target so we're ready to merge
  await $`${command} checkout ${target}.json ${log}`.cwd(options.dir);

  // now merge
  // workflows have no history so we need to force
  // Do a weird thing and write the result to a different file
  await $`${command} merge ${source}.json ${log} --force --output result.json`.cwd(
    options.dir
  );

  // Now return a project based on the filesystem
  // (remember that merge doesn't update the project file)
  // But wait, should it?
  return Project.from("path", "result.json");

  // TODO: Two issues now!
  // Why is this writing as yaml?
  // Why is this writing to output.json?
};
