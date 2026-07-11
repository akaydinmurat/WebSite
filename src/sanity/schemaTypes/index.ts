import { material } from "./documents/material";
import { packageType } from "./documents/package";
import { project } from "./documents/project";
import { projectCategory } from "./documents/projectCategory";
import { service } from "./documents/service";
import { siteSettings } from "./documents/siteSettings";
import { blockContent } from "./objects/blockContent";
import { imageWithAlt } from "./objects/imageWithAlt";
import { seo } from "./objects/seo";

export const schemaTypes = [
  project,
  projectCategory,
  service,
  packageType,
  material,
  siteSettings,
  seo,
  imageWithAlt,
  blockContent,
];
