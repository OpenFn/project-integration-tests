import path from "node:path";
import type Project from "@openfn/project";
import { $ } from "bun";

type Options = {
  dir: string; // root dir to run in
};

// run commands through the CLI
// uses bun shell
// need a dir to run in
export const merge = async (
  source: string,
  target: string,
  options: Options
) => {
  // TODO: take as an argument or option the command name
  const cmd = "openfnx";
  // I'm using openfnx for now to run locally
  // source and target actually need to be paths

  // init a project file to keep the CLI happy
  // (TODO: we shouldn't need to do this, or at least just run init)
  const openfnyml = `projectsRoot: .`;
  await Bun.write(path.join(options.dir, "openfn.yaml"), openfnyml);

  // Checkout the target so we're ready to merge
  await $`${cmd} checkout ${source}`.cwd(options.dir);

  // now merge
  const x = await $`${cmd} merge ${target}`.cwd(options.dir);

  console.log(x.text());

  // Now return the merged file
  return Bun.file(path.resolve(options.dir, target)).text();
};
