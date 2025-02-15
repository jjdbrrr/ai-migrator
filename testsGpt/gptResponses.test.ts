import { FileProcessor } from "../src/FileProcessor";
import * as path from "node:path";
import { buildNativePreset } from "../src/presets/buildNativePreset";
import dotenv from "dotenv";

jest.mock("fs-extra", () => ({
  promises: {
    readFile: jest.requireActual("fs-extra").promises.readFile,
    writeFile: jest.fn()
  },
}));

describe("Chat GPT", () => {
  const fileProcessor = createFileProcessor();

  it(
    "correctly uses T component",
    async () => {
      const result = await fileProcessor.processFile(
        path.resolve(__dirname + "/exampleFiles/simple.tsx.txt"),
      );
      expect(result.keys).toHaveLength(1);
      expect(result.keys[0].name).toBe("welcome-message");
      expect(result.keys[0].description.length).toBeGreaterThan(10);
      expect(result.keys[0].default).toBe("Welcome!");
      expect(result.newFileContents).toBe(
        "import { T } from '@tolgee/react';\n" +
          "\n" +
          "export const WelcomeMessage = () => {\n" +
          '  return <div><T keyName="welcome-message" /></div>;\n' +
          "};\n",
      );
    },
    60 * 1000,
  );

  it(
    "correctly uses useTranslate hook",
    async () => {
      const result = await fileProcessor.processFile(
        path.resolve(__dirname + "/exampleFiles/useTranslate.tsx.txt"),
      );
      expect(result.keys).toHaveLength(1);
      expect(result.keys[0].name).toContain("password");
      expect(result.keys[0].name).toContain("placeholder");
      expect(result.keys[0].description.length).toBeGreaterThan(10);
      expect(result.keys[0].default).toBe("New password");
      expect(result.newFileContents).toContain("const { t } = useTranslate();");
      expect(result.newFileContents).toContain("t('new-password-");
    },
    60 * 1000,
  );
});

function createFileProcessor() {
  dotenv.config();

  const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

  return FileProcessor(buildNativePreset("react"), {
    openAiApiKey,
    azureApiKey,
    azureEndpoint,
    azureDeployment: deployment,
  });
}
