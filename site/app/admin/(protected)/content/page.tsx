import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { therapist as fallbackTherapist, values as fallbackValues } from "@/lib/data";

export const metadata: Metadata = { title: "Content" };
export const dynamic = "force-dynamic";

const GALLERY_FALLBACK = [
  { src: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=1200&q=80", label: "The reception room" },
  { src: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80", label: "The treatment room" },
  { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", label: "Bespoke oils" },
  { src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80", label: "Linen and light" },
  { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80", label: "Warmth and stone" },
  { src: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80", label: "A quiet hour" },
];

export default async function ContentPage() {
  const rows = await db.content.findMany({ orderBy: { key: "asc" } });
  const content = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  let studioValues = fallbackValues;
  let gallery = GALLERY_FALLBACK;
  try { if (content["about.values"]) studioValues = JSON.parse(content["about.values"]); } catch { /* keep fallback */ }
  try { if (content["about.gallery"]) gallery = JSON.parse(content["about.gallery"]); } catch { /* keep fallback */ }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Content</h1>
        <p className="text-[13px] text-[#A09687] mt-1">
          Studio details, about page, copy, and SEO — all in one place.
        </p>
      </div>
      <ContentEditor
        content={content}
        aboutIntro={content["about.intro"] ?? ""}
        therapistName={content["about.therapist.name"] ?? fallbackTherapist.name}
        therapistRole={content["about.therapist.role"] ?? fallbackTherapist.role}
        therapistBio={content["about.therapist.bio"] ?? fallbackTherapist.bio}
        therapistImage={content["about.therapist.image"] ?? fallbackTherapist.image}
        studioValues={studioValues}
        gallery={gallery}
      />
    </div>
  );
}
