import initTest, { Context } from "../../src/test";
import * as runner from "../../src/runner/lightning";
import { deepEquals } from "bun";
import { expect } from "bun:test";

const test = initTest(import.meta.filename);

test("should run a mix command", async (ctx) => {
  const result = await runner.test();

  // expect the first migration to be present
  const first = "20220131123309  create_jobs";

  expect(result).toMatch(first);
});
