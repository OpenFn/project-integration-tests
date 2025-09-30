import { expect, test } from "bun:test";
import { mapArgs } from "../../src/runner/helper";

test("mapArgs: single args", () => {
  const result = mapArgs({ foo: "bar" });

  expect(result).toBe("foo=bar");
});

test("mapArgs: handle spaces", () => {
  const result = mapArgs({ foo: "b a r" });

  expect(result).toBe('foo="b a r"');
});
