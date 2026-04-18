import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SkipLink } from "@/components/site/SkipLink";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
    </>
  );
}
