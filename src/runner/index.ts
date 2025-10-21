import * as cli from "./cli";

import type Project from "@openfn/project";

type FilePath = string;

const { OPENFN_RUNNER } = process.env;

export type Runner = {
  welcome(): void;
  test(): void;
  merge(source: FilePath, target: FilePath, options?: any): Project;
};

// This takes inputs and an expected output and runs them through
// either CLI or Lightning
export default (): Runner => {
  const mode = OPENFN_RUNNER ?? "";

  if (mode === "cli") {
    return cli as Runner;
  }

  throw new Error(`Runner ${mode} not supported`);
};
