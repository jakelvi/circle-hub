import chalk from "chalk";

class Logger {
  static success(...message: any[]) {
    console.log(chalk.italic.green(...message));
  }

  static error(...message: any[]) {
    console.error(chalk.red(...message));
  }
  static info(...message: any[]) {
    console.info(chalk.yellow(...message));
  }

  static debug(...message: any[]) {
    console.debug(chalk.blue(...message));
  }

  static log(...message: any[]) {
    if (process.env.NODE_ENV === "prod") return;
    console.log(...message);
  }

  static verbose(...message: any[]) {
    if (process.env.NODE_ENV === "prod") return;
    console.log(chalk.magenta(...message));
  }
}

export { Logger };
