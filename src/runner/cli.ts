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
  // Explicitly specify the target project because it's ambiguous (we've dumped so much stuff into the project dir!)
  await $`${command} merge ${source}.json --base main.json ${log} --force --output-path result.json`.cwd(
    options.dir
  );

  // Now return a Project based on the generated state file
  return Project.from("path", path.resolve(options.dir, "result.json"));
};
