import type { SchemaTypeDefinition } from "sanity";
import { approachPage, caseStudy, companyPage, contactPage, homePage, servicesPage, siteSettings, workIndex } from "./pages";

export const schema: { types: SchemaTypeDefinition[] } = { types: [siteSettings, homePage, servicesPage, workIndex, caseStudy, approachPage, companyPage, contactPage] };
