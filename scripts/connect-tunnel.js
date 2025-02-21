import { exec } from "node:child_process";

if (!process.env.ZROK_NAME) {
  console.log("ZROK_NAME is not set");
  process.exit(1);
}

await new Promise((resolve) => {
  const p = exec(
    `zrok share reserved \${ZROK_NAME}${process.argv[2]}" --headless`,
    resolve
  );
  p.stdout?.pipe(process.stdout);
  p.stderr?.pipe(process.stderr);
  if (p.stdin) process.stdin.pipe(p.stdin);
  process.on("SIGINT", () => p.kill());
  process.on("SIGTERM", () => p.kill());
});
