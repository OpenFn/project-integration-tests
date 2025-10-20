export const loadArgs = (): Record<string, string> => {
  // Pass OPENFN_RUNNER_ARGS=cmd:openfnx to use openfnx
  const opts = process.env.OPENFN_RUNNER_ARGS ?? "";
  if (opts) {
    return opts
      .split(",")
      .map((o) => o.split(":"))
      .map(([key, value]: string[]) => ({ [key]: value }))
      .reduce((acc, next) => Object.assign(acc, next));
  }
  return {};
};
