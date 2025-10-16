import path from "node:path";
import Project from "@openfn/project";
import { $ } from "bun";

let command = "openfn";
let logOption = "none";

// Pass OPENFN_RUNNER_ARGS=cmd:openfnx to use openfnx
const opts = process.env.OPENFN_RUNNER_ARGS ?? "";
if (opts) {
  const options: any = opts
    .split(",")
    .map((o) => o.split(":"))
    .map(([key, value]: string[]) => ({ [key]: value }))
    .reduce((acc, next) => Object.assign(acc, next));

  if (options.cmd) {
    command = options.cmd;
  }
  if (options.log) {
    logOption = options.log;
  }
}

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
  `;
  await Bun.write(path.join(options.dir, "openfn.yaml"), openfnyml);

  // Checkout the target so we're ready to merge
  console.log(`${command} checkout ${source} ${log}`);
  await $`${command} checkout ${source} ${log}`.cwd(options.dir);

  // now merge
  await $`${command} merge ${target} ${log}`.cwd(options.dir);

  // Now return a project based on the filesystem
  // (remember that merge doesn't update the project file)
  return Project.from("fs", { root: options.dir });
};
