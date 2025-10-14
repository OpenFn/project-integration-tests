import * as cli from "./cli";

import type Project from "@openfn/project";

type FilePath = string;

export type Runner = {
  merge(source: FilePath, target: FilePath, options?: any): Project;
};

// This takes inputs and an expected output and runs them through
// either CLI or Lightning
export default (): Runner => {
  const mode = "cli"; // TODO look this up from the command used

  if (mode === "cli") {
    return cli as Runner;
  }

  throw new Error(`Runner ${mode} not found`);
};
