"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schemaTypes";

export default defineConfig({ name: "elagon", title: "Elagon Website", projectId: projectId || "replace-with-project-id", dataset, plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })], schema });
