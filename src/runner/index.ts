import * as cli from "./cli";

import type Project from "@openfn/project";

export type Runner = {
  merge(source: Project, target: Project, options?: any): Project;
};

// This takes inputs and an expected output and runs them through
// either CLI or Lightning
export default (): Runner | null => {
  const mode = "cli"; // TODO look this up from the command used

  if (mode === "cli") {
    return cli as Runner;
  }

  return null;
};
