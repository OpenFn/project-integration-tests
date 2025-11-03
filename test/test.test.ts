// TODO move the functions under test here out to util or something
import { expect, test } from "bun:test";
import { projectEquals } from "../src/test";

test("mapArgs: single args", () => {
  const a = {
    id: "strong-pans-argue",
    history: [],
    workflows: [
      {
        id: "workflow",
        name: "Workflow",
        options: {},
        steps: [
          {
            id: "x",
            name: "x",
            adaptor: "b",
            next: { y: { disabled: false, openfn: { uuid: null } } },
            openfn: { uuid: "75496b5c-265e-4d59-8610-c6c3921d8e0b" },
          },
          {
            id: "y",
            name: "y",
            openfn: { uuid: "6e33242f-1087-4243-806c-78d3d48395de" },
          },
        ],
        openfn: { uuid: null },
        history: [],
      },
    ],
    openfn: { uuid: "678190e7-b179-4e73-b644-eff37f4393fc" },
    config: {
      dirs: { projects: ".projects", workflows: "workflows" },
      formats: { openfn: "yaml", project: "yaml", workflow: "yaml" },
    },
  };
  const b = {};
  const result = mapArgs({ foo: "bar" });

  expect(result).toBe("foo=bar");
});
