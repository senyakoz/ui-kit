import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { buildRegistry } from "../registry/build";

const root = process.cwd();
writeFileSync(join(root, "registry.json"), `${JSON.stringify(buildRegistry(root), null, 2)}\n`);
