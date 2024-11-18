import { exec } from "node:child_process";

exec(
  `zrok share reserved "${process.env.ZROK_NAME}${process.argv[2]}" --headless`
);
