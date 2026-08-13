import { defineArrayMember, defineField, defineType } from "sanity";

const seoFields = [defineField({ name: "seoTitle", title: "SEO title", type: "string" }), defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 })];
const pageFields = [defineField({ name: "eyebrow", type: "string" }), defineField({ name: "headline", type: "string" }), defineField({ name: "intro", type: "text", rows: 4 }), ...seoFields];

export const siteSettings = defineType({ name: "siteSettings", title: "Site settings", type: "document", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "contactEmail", type: "string" }), defineField({ name: "navigation", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "string" })] })] })] });

export const homePage = defineType({ name: "homePage", title: "Homepage", type: "document", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "hero", type: "object", fields: [defineField({ name: "primaryTop", type: "string" }), defineField({ name: "connectorTop", type: "string" }), defineField({ name: "primaryBottom", type: "string" }), defineField({ name: "connectorBottom", type: "string" }), defineField({ name: "desktopMedia", type: "image", options: { hotspot: true } }), defineField({ name: "mobileMedia", type: "image", options: { hotspot: true } }), defineField({ name: "motionPreset", type: "string", options: { list: ["hero-renaissance"] } })] }), defineField({ name: "positioning", type: "text" }), ...seoFields] });

function pageType(name: string, title: string) { return defineType({ name, title, type: "document", fields: [defineField({ name: "title", type: "string" }), ...pageFields] }); }
export const servicesPage = pageType("servicesPage", "Services page");
export const workIndex = pageType("workIndex", "Work index");
export const approachPage = pageType("approachPage", "Approach page");
export const companyPage = pageType("companyPage", "Company page");
export const contactPage = pageType("contactPage", "Contact page");

export const caseStudy = defineType({ name: "caseStudy", title: "Case study", type: "document", fields: [defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }), defineField({ name: "code", type: "string" }), defineField({ name: "industry", type: "string" }), defineField({ name: "category", type: "string" }), defineField({ name: "summary", type: "text" }), defineField({ name: "challenge", type: "array", of: [defineArrayMember({ type: "block" })] }), defineField({ name: "system", type: "array", of: [defineArrayMember({ type: "block" })] }), defineField({ name: "outcomes", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "value", type: "string" }), defineField({ name: "label", type: "string" }), defineField({ name: "context", type: "string" })] })] }), defineField({ name: "heroMedia", type: "image", options: { hotspot: true } }), ...seoFields] });
