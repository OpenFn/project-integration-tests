import { $ } from "bun";

type Args = Record<string, string | number | boolean>;

const maybeEscape = (str: string) => {
  if (str.match(" ")) {
    return `"${str}"`;
  }
  return str;
};

export const mapArgs = (args: Args): string =>
  Object.entries(args)
    .reduce((arr, [key, value]) => {
      arr.push(`${key}=${maybeEscape(value)}`);
      return arr;
    }, [])
    .join(" ");

// simple wrapper to execute commands in a JS-y way
export const cmd = (positionals: string, args: Args) => {
  return $`${positionals} ${mapArgs(args)}`;
};
