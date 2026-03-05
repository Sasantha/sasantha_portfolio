import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/base-url";
import type { ProjectView } from "@/lib/types/project";

const siteUrl = "https://sasantha-portfolio.vercel.app";

async function getProjects() {
  const response = await fetch(`${getBaseUrl()}/api/public/projects`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [] as ProjectView[];
  }

  const data = (await response.json()) as { projects: ProjectView[] };
  return data.projects;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projects = await getProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
