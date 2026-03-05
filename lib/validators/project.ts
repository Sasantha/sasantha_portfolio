import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null));

const stringArray = z.array(z.string().trim().min(1)).default([]);

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().optional(),
  summary: z.string().trim().min(1, "Summary is required"),
  description: z.string().trim().min(1, "Description is required"),
  stack: stringArray,
  tags: stringArray,
  highlights: stringArray,
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  featured: z.boolean().default(false),
  coverImageUrl: optionalUrl,
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type NormalizedProjectInput = Omit<ProjectInput, "slug"> & { slug: string };

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const normalizeStringArray = (values: string[]) =>
  values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);

export function normalizeProjectInput(data: unknown): NormalizedProjectInput {
  const parsed = projectInputSchema.parse(data);
  const slug = slugify(parsed.slug && parsed.slug.length > 0 ? parsed.slug : parsed.title);

  return {
    ...parsed,
    slug,
    stack: normalizeStringArray(parsed.stack),
    tags: normalizeStringArray(parsed.tags),
    highlights: normalizeStringArray(parsed.highlights),
  };
}
