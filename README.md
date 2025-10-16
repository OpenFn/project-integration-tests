# project-merge-test

## Purpose

To test Sandbox/project merging and versioning logic

Uses the CLI and Lightning mix tasks to run similar operations in different runtimes.

## Structure

Tricky

Some stuff is source needed to run tests

Some is source to generate yaml files for tests

Some of it is actual tests

That generation stuff is pretty key

Really the test is the spec, that generator bit. Do we really need to see them on disk? Could we generate, test and report without persistnce? Well we probably do want to see

Maybe tests/ is for internal tests on the code, like regular unit tests

And maybe stories/ is where we add richer stories

yes, I like this. So:

stories is where the integration tests live
src is for all supporting code
test is for internal unit tests

If you want to understand merge behaviour, go to stories
If you want to write code to maintain this repo, go to src/test

## Getting Started

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

To run the test stories with openfnx:

```bash
OPENFN_RUNNER_ARGS=cmd:openfnx bun stories:cli
```
