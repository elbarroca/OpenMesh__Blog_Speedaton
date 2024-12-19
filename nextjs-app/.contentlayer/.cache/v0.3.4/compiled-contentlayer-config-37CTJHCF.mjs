// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import path from "path";
var Authors = defineDocumentType(() => ({
  name: "Authors",
  filePathPattern: "authors/**/*.mdx",
  contentType: "mdx",
  fields: {
    name: { type: "string", required: true },
    avatar: { type: "string" },
    occupation: { type: "string" },
    company: { type: "string" },
    email: { type: "string" },
    twitter: { type: "string" },
    linkedin: { type: "string" },
    github: { type: "string" },
    layout: { type: "string" }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => path.basename(doc._raw.sourceFilePath, path.extname(doc._raw.sourceFilePath))
    },
    path: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath
    },
    body: { type: "json", resolve: (doc) => doc.body }
  }
}));
var Entry = defineDocumentType(() => ({
  name: "Entry",
  filePathPattern: "entries/**/*.{md,mdx}",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    entryType: {
      type: "enum",
      options: ["note", "journal", "document"],
      required: true,
      default: "document"
    },
    draft: { type: "boolean" },
    summary: { type: "string" }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => path.basename(doc._raw.sourceFilePath, path.extname(doc._raw.sourceFilePath))
    },
    path: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Entry, Authors],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: []
  },
  disableImportAliasWarning: true,
  onSuccess: async (importData) => {
    console.log("Content updated successfully");
  }
});
export {
  Authors,
  Entry,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-37CTJHCF.mjs.map
