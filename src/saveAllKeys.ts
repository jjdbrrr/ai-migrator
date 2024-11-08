import fsExtra from "fs-extra";
import {Key} from "./responseProviders/responseFormat";
import { getFilePaths } from "./FilePaths";

export type AllKeysFile = { [filePath: string]: Key[] }

// Function to save or append keys
export const saveKeys = async (filePath: string, keys: Key[]) => {
  const { allKeysFilePath } = getFilePaths();

  try {
    let allKeys: AllKeysFile = {};
    const fileExists = await fsExtra.pathExists(allKeysFilePath);

    if (fileExists) {
      try {
        allKeys = await fsExtra.readJson(allKeysFilePath);
      } catch (error) {
        console.warn(
          "[saveKeys] Warning: allKeys.json is empty or malformed. Initializing as empty object.",
        );
        allKeys = {};
      }
    } else {
      await fsExtra.writeJson(allKeysFilePath, allKeys, { spaces: 2 });
    }

    // Check if the specified filePath already exists in allKeys.json
    if (!allKeys[filePath]) {
      // If file path does not exist, add the new keys for this file
      allKeys[filePath] = keys;
    } else {
      // If file path exists, filter out keys that are already present
      const existingKeys = allKeys[filePath].map((keyObj) => keyObj.name);
      const keysToAdd = keys.filter((key) => !existingKeys.includes(key.name));

      // Only update if there are new keys to add
      if (keysToAdd.length > 0) {
        allKeys[filePath] = [...allKeys[filePath], ...keysToAdd];
      }
    }

    // Write updated allKeys object back to allKeys.json
    await fsExtra.writeJson(allKeysFilePath, allKeys, { spaces: 2 });
  } catch (error) {
    console.error("[saveAllKeys] Error saving keys:", error);
  }
};
