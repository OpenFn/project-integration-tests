import loadRunner from "./runner";

const { OPENFN_RUNNER = "" } = process.env;

let abort;
if (!OPENFN_RUNNER) {
  console.error(
    "ERROR: OPENFN_RUNNER not set. Specify a runner to execute stories."
  );
  abort = true;
} else if (!/(^(cli|lightning)$)/.test(OPENFN_RUNNER)) {
  console.error(
    `ERROR: Invalid runner "${OPENFN_RUNNER}". Pass "cli" or "lightning"`
  );
  abort = true;
}

// validate the runner
try {
  const runner = loadRunner();
  runner.welcome();
} catch (e) {
  console.error("Failed to load runner: ", e.message);
  abort = true;
}

if (abort) {
  console.log("Aborting");
  process.exit(1);
}
