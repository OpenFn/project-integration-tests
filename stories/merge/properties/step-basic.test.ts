import Project, { generateProject } from "@openfn/project";
import { afterEach } from "bun:test";

import initTest, { Context, gen } from "../../src/test";
import loadRunner from "../../src/runner";
import { deepEquals } from "bun";

const test = initTest(import.meta.filename);

// This will load a CLI or Lightning runner based on the run command
const runner = loadRunner();

let seed = 0;

afterEach(() => {
  seed = 0;
});

test.skip("should merge two workflows", async (ctx) => {});
