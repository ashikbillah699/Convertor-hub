import bcrypt from "bcryptjs";

if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
  console.error("Run this command in an interactive terminal so the password can be entered without echo.");
  process.exit(1);
}

const readPassword = () => new Promise((resolve, reject) => {
  let password = "";
  process.stdout.write("Enter the admin password (input hidden): ");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  const onData = (character) => {
    if (character === "\u0003") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      reject(new Error("Cancelled."));
    } else if (character === "\r" || character === "\n") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.off("data", onData);
      process.stdout.write("\n");
      resolve(password);
    } else if (character === "\u007f" || character === "\b") {
      password = password.slice(0, -1);
    } else if (character >= " ") {
      password += character;
    }
  };

  process.stdin.on("data", onData);
});

try {
  const password = await readPassword();
  if (password.length < 12) throw new Error("Choose a password with at least 12 characters.");
  console.log(`ADMIN_PASSWORD_HASH=${await bcrypt.hash(password, 12)}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
