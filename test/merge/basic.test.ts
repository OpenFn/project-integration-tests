// A suite of basic merge tests
// shoudl it more like like:
// node.test.ts - tests against a single edit to a single node
// edge.test.ts - tests against a single edit to a single edge
// node-complex.test.ts
// examples.test.ts - tests designed to tell a good story to users
// conflict.test.ts - tests that introduce conflicts
// issues.test.ts - tests directly linked to GH issues


// Working out that breakdown is quite important
// want small files with managable number tests around a tight theme
// can think about farhan's solid, liquid and gas nodes.
// but also, id matching is particular problem within merge
// merge: step properties
// merge: edge properties
// merge: workflow properties (short!)
// merge: project properties (short!)
// merge: mapping nodes basic
// merge: mapping nodes advanced
// merge: mapping edges basic
// merge: mapping edges advanced

// this is where individual tests go

interface generate(spec) {

  // return a Project which matches the spec
  // generate a UUID based on a seed
  // Each test suite should create a generator instance with a new seed
}

// accept the test handler as an arugment
// now we can do stuff with the text name
// like generate a UUID and slug from the test name, ignoring stuff in brackets
interface test_merge(t, source, target) {
  // this will:
  // serialise a to disk
  // serialize b to disk
}

test('basic merge', (t) => {
  const description = 'rename node c to x';

  const path_main = generate(`
    a-b
    b-c
  `)

  const path_staging = generate(`
    a-b
    b-x # rename c to c!
  `)

  test_merge(t.name, path_staging, path_main)
})