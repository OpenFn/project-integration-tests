import Project from "@openfn/project";

import initTest, { testMerge as merge } from "../../src/test";
import loadRunner from "../../src/runner";

const test = initTest(import.meta.filename);

test("should merge two workflows", async (ctx) => {
  const main = `x-y
      y-z(adaptor=http)`;

  const staging = `x-y
      y-z(adaptor=dhis2) # <-- changed! `;

  const expected = `x-y
        y-z(adaptor=dhis2)`;

  await merge(ctx, main, staging, expected);
});

/**
 * This test uses real (if trivial) examples from the app
 * It's not a nice test, I just want a full end-to-end style example
 * I might create a separate suite of stories for these
 * not so readable but still quite useful
 */
test("should merge two complete workflows", async (ctx) => {
  const main_src = `
id: 670fcf53-b3a5-41a7-a1d3-b5950c489043
name: sandbox-testing
description: null
project_credentials: []
collections: []
inserted_at: 2025-09-08T11:16:38Z
updated_at: 2025-09-08T11:16:38Z
env: null
color: null
concurrency: null
parent_id: null
scheduled_deletion: null
history_retention_period: null
dataclip_retention_period: null
retention_policy: retain_all
allow_support_access: false
requires_mfa: false
version_history: []
workflows:
  - name: Simple ETL
    id: a9827a22-ccbd-4dae-832f-d44d84f97eee
    concurrency: null
    updated_at: 2025-09-08T11:17:53Z
    inserted_at: 2025-09-08T11:16:48Z
    deleted_at: null
    lock_version: 5
    jobs:
      - name: A
        body: // step a
        adaptor: "@openfn/language-http@7.2.1"
        id: c8454227-b661-4b89-83ac-f76e2029d727
        project_credential_id: null
      - name: B
        body: |
          B
        adaptor: "@openfn/language-kobotoolbox@4.2.3"
        id: 2ee2984d-5227-4715-811f-465b68ac3c28
        project_credential_id: null
      - name: C
        body: |
          C
        adaptor: "@openfn/language-fhir-4@0.1.10"
        id: e717068f-67b0-4a75-83da-bc5c6e4bc2b5
        project_credential_id: null
    triggers:
      - type: webhook
        enabled: true
        id: 303b0e69-c77b-417f-83fa-41495bc0447f
    edges:
      - id: 35780c84-d7f9-4f23-8975-3a33d4b848be
        target_job_id: c8454227-b661-4b89-83ac-f76e2029d727
        enabled: true
        source_trigger_id: 303b0e69-c77b-417f-83fa-41495bc0447f
        condition_type: always
      - id: 7e5136e3-17b8-4102-867d-b7266add1ef0
        target_job_id: 2ee2984d-5227-4715-811f-465b68ac3c28
        enabled: true
        source_job_id: c8454227-b661-4b89-83ac-f76e2029d727
      - id: 293da148-ee73-494a-89fb-a4c99a56f428
        target_job_id: e717068f-67b0-4a75-83da-bc5c6e4bc2b5
        enabled: true
        source_job_id: c8454227-b661-4b89-83ac-f76e2029d727
`;
  const main = Project.from("state", main_src, { format: "yaml" });
  await ctx.serialize("main", main);

  const staging_src = `
id: 123fcf53-b3a5-41a7-a1d3-b5950c489043
name: sandbox-testing-staging
description: null
project_credentials: []
collections: []
inserted_at: 2025-09-08T11:16:38Z
updated_at: 2025-09-08T11:16:38Z
env: null
color: null
concurrency: null
parent_id: null
scheduled_deletion: null
history_retention_period: null
dataclip_retention_period: null
retention_policy: retain_all
allow_support_access: false
requires_mfa: false
version_history: []
workflows:
  - name: Simple ETL
    id: a9827a22-ccbd-4dae-832f-d44d84f97fff
    concurrency: null
    updated_at: 2025-09-08T11:17:53Z
    inserted_at: 2025-09-08T11:16:48Z
    deleted_at: null
    lock_version: 5
    jobs:
      - name: A
        body: // step a STAGING
        adaptor: '@openfn/language-http@7.2.1'
        id: c9374227-b661-4b89-83ac-f76e2029d727
        project_credential_id: null
      - name: B
        body: |
          B STAGING
        adaptor: '@openfn/language-kobotoolbox@4.2.3'
        id: 2ff2984d-5227-4715-811f-465b68ac3c28
        project_credential_id: null
      - name: C
        body: |
          C STAGING
        adaptor: '@openfn/language-fhir-4@0.1.10'
        id: d887068f-67b0-4a75-83da-bc5c6e4bc2b5
        project_credential_id: null
    triggers:
      - type: webhook
        enabled: true
        id: 303b0e69-c77b-417f-83fa-41495bc0447f
    edges:
      - id: 45680c84-d7f9-4f23-8975-3a33d4b848be
        target_job_id: c9374227-b661-4b89-83ac-f76e2029d727
        enabled: true
        source_trigger_id: 303b0e69-c77b-417f-83fa-41495bc0447f
        condition_type: always
      - id: 0a3136e3-17b8-4102-867d-b7266add1ef0
        target_job_id: 2ff2984d-5227-4715-811f-465b68ac3c28
        enabled: true
        source_job_id: c9374227-b661-4b89-83ac-f76e2029d727
      - id: 666da148-ee73-494a-89fb-a4c99a56f428
        target_job_id: d887068f-67b0-4a75-83da-bc5c6e4bc2b5
        enabled: true
        source_job_id: c9374227-b661-4b89-83ac-f76e2029d727

`;
  const staging = Project.from("state", staging_src, { format: "yaml" });
  await ctx.serialize("staging", staging);

  const expected_src = `
id: 670fcf53-b3a5-41a7-a1d3-b5950c489043
name: sandbox-testing
description: null
project_credentials: []
collections: []
inserted_at: 2025-09-08T11:16:38Z
updated_at: 2025-09-08T11:16:38Z
env: null
color: null
concurrency: null
parent_id: null
scheduled_deletion: null
history_retention_period: null
dataclip_retention_period: null
retention_policy: retain_all
allow_support_access: false
requires_mfa: false
version_history: []
workflows:
  - name: Simple ETL
    id: a9827a22-ccbd-4dae-832f-d44d84f97eee
    concurrency: null
    updated_at: 2025-09-08T11:17:53Z
    inserted_at: 2025-09-08T11:16:48Z
    deleted_at: null
    lock_version: 5
    jobs:
      - name: A
        body: // step a STAGING
        adaptor: "@openfn/language-http@7.2.1"
        id: c8454227-b661-4b89-83ac-f76e2029d727
        project_credential_id: null
      - name: B
        body: |
          B STAGING
        adaptor: "@openfn/language-kobotoolbox@4.2.3"
        id: 2ee2984d-5227-4715-811f-465b68ac3c28
        project_credential_id: null
      - name: C
        body: |
          C STAGING
        adaptor: "@openfn/language-fhir-4@0.1.10"
        id: e717068f-67b0-4a75-83da-bc5c6e4bc2b5
        project_credential_id: null
    triggers:
      - type: webhook
        enabled: true
        id: 303b0e69-c77b-417f-83fa-41495bc0447f
    edges:
      - id: 35780c84-d7f9-4f23-8975-3a33d4b848be
        target_job_id: c8454227-b661-4b89-83ac-f76e2029d727
        enabled: true
        source_trigger_id: 303b0e69-c77b-417f-83fa-41495bc0447f
        condition_type: always
      - id: 7e5136e3-17b8-4102-867d-b7266add1ef0
        target_job_id: 2ee2984d-5227-4715-811f-465b68ac3c28
        enabled: true
        source_job_id: c8454227-b661-4b89-83ac-f76e2029d727
      - id: 293da148-ee73-494a-89fb-a4c99a56f428
        target_job_id: e717068f-67b0-4a75-83da-bc5c6e4bc2b5
        enabled: true
        source_job_id: c8454227-b661-4b89-83ac-f76e2029d727
`;

  const expected = Project.from("state", expected_src, { format: "yaml" });
  await ctx.serialize("expected", expected);

  const result = await runner.merge("staging", "main", {
    dir: ctx.root,
  });

  projectEquals(result, expected);
});
