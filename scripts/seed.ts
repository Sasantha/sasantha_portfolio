import "dotenv/config";
import { getSupabaseAdmin } from "../lib/supabase-admin";

const TABLE_CANDIDATES = ["Project", "projects"] as const;

async function resolveTable() {
  const supabase = getSupabaseAdmin();

  for (const table of TABLE_CANDIDATES) {
    const { error } = await supabase.from(table).select("id", { head: true, count: "exact" });
    if (!error) return table;
    if (error.code !== "42P01") throw error;
  }

  throw new Error("Projects table not found. Expected `Project` or `projects`.");
}

async function main() {
  const supabase = getSupabaseAdmin();
  const table = await resolveTable();

  const { count, error: countError } = await supabase
    .from(table)
    .select("id", { head: true, count: "exact" });
  if (countError) throw countError;

  if ((count ?? 0) > 0) {
    console.log("Project table already has data. Skipping seed.");
    return;
  }

  const seedRows = [
    {
      slug: "mark-shell-corporate-website",
      title: "Mark-Shell Pvt Ltd Corporate Website",
      summary:
        "High-performance corporate website and product catalog for a premium B2B sustainable cutlery supplier.",
      description:
        "Designed and developed a green-themed corporate website for Mark-Shell with structured B2B product pages and direct WhatsApp inquiry workflows for procurement teams.",
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      tags: ["Corporate Website", "B2B", "Lead Generation"],
      highlights: [
        "Built category to product to quote user flow for business buyers.",
        "Implemented WhatsApp inquiry CTA for rapid lead capture.",
        "Optimized pages for speed and mobile responsiveness.",
      ],
      liveUrl: "https://markshell.lk",
      repoUrl: "https://github.com/Sasantha/Mark-Shell",
      featured: true,
      coverImageUrl: null,
    },
    {
      slug: "laboura-marketplace",
      title: "Laboura Marketplace",
      summary:
        "Marketplace concept connecting customers with skilled workers through structured service listings.",
      description:
        "Designed service request and worker onboarding flows for a subscription-based labor marketplace platform with maintainable MVC architecture.",
      stack: ["C#", ".NET", "MVC", "SQL Server"],
      tags: ["Marketplace", "Services", "B2B/B2C"],
      highlights: [
        "Modeled subscriptions, services, and customer request entities.",
        "Designed scalable onboarding and request assignment flow.",
        "Structured codebase for maintainability with MVC patterns.",
      ],
      liveUrl: "https://laboaura.page.gd",
      repoUrl: "https://github.com/Sasantha/Laboura_Connect",
      featured: true,
      coverImageUrl: null,
    },
    {
      slug: "gadget-hub-system",
      title: "Gadget Hub System",
      summary: "Full-stack gadget inventory and operations system with C# APIs and a React frontend.",
      description:
        "Implemented backend APIs and a modern frontend to manage gadgets, categories, and inventory operations with clean backend/frontend separation.",
      stack: ["C#", "ASP.NET Core Web API", "React", "SQL Server", "Entity Framework"],
      tags: ["Full-Stack", "API", "Inventory"],
      highlights: [
        "Built REST APIs for inventory and category management.",
        "Integrated React UI with backend endpoints for CRUD workflows.",
        "Used Entity Framework for clean, maintainable data access.",
      ],
      liveUrl: null,
      repoUrl: "https://github.com/Sasantha",
      featured: true,
      coverImageUrl: null,
    },
  ];

  const { error: insertError } = await supabase.from(table).insert(seedRows);
  if (insertError) throw insertError;

  console.log("Seed data inserted.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
