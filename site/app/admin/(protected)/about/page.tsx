import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AboutEditor } from "@/components/admin/AboutEditor";
import { therapist as fallbackTherapist, values as fallbackValues } from "@/lib/data";

export const metadata: Metadata = { title: "About" };
export const dynamic = "force-dynamic";

const GALLERY_FALLBACK = [
  { src: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=1200&q=80", label: "The reception room" },
  { src: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80", label: "The treatment room" },
  { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", label: "Bespoke oils" },
  { src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80", label: "Linen and light" },
  { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80", label: "Warmth and stone" },
  { src: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80", label: "A quiet hour" },
];

export default async function AboutAdminPage() {
  const rows = await db.content.findMany({
    where: { key: { startsWith: "about." } },
  });
  const c = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  let values = fallbackValues;
  let gallery = GALLERY_FALLBACK;
  try { if (c["about.values"]) values = JSON.parse(c["about.values"]); } catch { /* keep fallback */ }
  try { if (c["about.gallery"]) gallery = JSON.parse(c["about.gallery"]); } catch { /* keep fallback */ }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">About page</h1>
        <p className="text-[13px] text-[#A09687] mt-1">
          Edit the intro, therapist profile, studio values, and gallery.
        </p>
      </div>
      <AboutEditor
        intro={c["about.intro"] ?? ""}
        therapistName={c["about.therapist.name"] ?? fallbackTherapist.name}
        therapistRole={c["about.therapist.role"] ?? fallbackTherapist.role}
        therapistBio={c["about.therapist.bio"] ?? fallbackTherapist.bio}
        therapistImage={c["about.therapist.image"] ?? fallbackTherapist.image}
        values={values}
        gallery={gallery}
      />
    </div>
  );
}
