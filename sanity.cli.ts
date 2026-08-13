import { defineCliConfig } from "sanity/cli";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export default defineCliConfig({ api: { projectId: projectId || "replace-with-project-id", dataset }, project: { basePath: "/studio" }, deployment: { appId: "elagon-website" }, reactCompiler: { target: apiVersion } });
