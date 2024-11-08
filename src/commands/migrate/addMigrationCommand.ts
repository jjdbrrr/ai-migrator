import {Command} from "commander";
import {migrateFiles} from "./migrateFiles";

export function addMigrationCommand(program: Command) {
  // Migrate command
  program
    .command("migrate")
    .description("Migrate files and upload keys to Tolgee")
    .option(
      "-p, --pattern <pattern>",
      "File pattern to search for (e.g., src/**/*.tsx)",
      "src/**/*.tsx",
    )
    .option(
      "-a, --appendixPath <appendixPath>",
      "Path to file with custom prompt appendix",
    )
    .action(async (options) => {
      const { pattern, appendixPath } = options;
      try {
        // Run the migration process
        await migrateFiles(pattern, appendixPath);
      } catch (error) {
        console.error("[cli][migrate command] Error during migration:", error);
      }
    });
}
