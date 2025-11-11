import path from "node:path";
import Project from "@openfn/project";
import { sortBy } from "lodash-es";
import { $ } from "bun";
import { loadArgs } from "./util";
import { readFile } from "node:fs/promises";

const options = loadArgs();

const lightningPath = options.lng!;

// Get an absolute file path relative to
const file = (ctx, name) => {};

export const welcome = () => {
  if (!lightningPath) {
    console.error('"LIGHTNING PATH NOT SET');
    process.exit(1);
  }

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
  const sourceAbs = path.resolve(options.dir, source + ".json");
  const targetAbs = path.resolve(options.dir, target + ".json");
  const outputAbs = path.resolve(options.dir, "result.json");

  await $`mix lightning.merge_projects ${sourceAbs} ${targetAbs} -o ${outputAbs}`
    .cwd(lightningPath)
    .quiet();

  const resultRaw = await readFile(outputAbs, "utf8");
  const result = JSON.parse(resultRaw);

  // TMP: remove positions from the lightning file
  // But I do need to go and add support for this
  for (const wf of result.workflows) {
    delete wf.positions;

    // TODO: the order of things matters
    // in deep equality
    // Probably Project needs to handle sorting for us
    // in this serialization
    wf.jobs = sortBy(wf.jobs, ["id"]);
    wf.edges = sortBy(wf.edges, ["id"]);
  }

  const meta = {};
  return Project.from("state", result, meta);
};
