// Shared UI primitives + Nav + Footer + Home page.
// Everything uses Tailwind utility classes and the CSS custom properties
// defined in index.html (--teal, --gold, --cream, etc).

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ---- primitives ----------------------------------------------------------

const GoldRule = ({ className = "", width = "w-12" }) => (
  <span
    className={`inline-block h-px ${width} ${className}`}
    style={{ background: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}
  />
);

const Eyebrow = ({ children, className = "" }) => (
  <span
    className={`block text-[11px] tracking-[0.22em] uppercase ${className}`}
    style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}
  >
    {children}
  </span>
);

const Button = ({ children, variant = "primary", onClick, href, className = "", type = "button", disabled, ...rest }) => {
  const base = "inline-flex items-center justify-center gap-2 text-[13px] tracking-[0.08em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: "rounded-full px-7 py-3 text-[var(--cream)] hover:bg-[var(--teal-deep)]",
    secondary: "rounded-full px-7 py-3 border border-[var(--teal)] text-[var(--teal)] hover:bg-[var(--cream-light)]",
    tertiary: "px-0 py-1 text-[var(--teal)] border-b border-transparent hover:border-[var(--gold)]",
  };
  const primaryBg = variant === "primary" ? { background: "var(--teal)" } : {};
  const Cmp = href ? "a" : "button";
  return (
    <Cmp
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
      style={primaryBg}
      {...rest}
    >
      {children}
    </Cmp>
  );
};

// Striped placeholder with hint label (used when no image uploaded)
const ImgPlaceholder = ({ label, className = "", ratio = "16 / 10", url = null, tone = "cream" }) => {
  if (url) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
        <img src={url} alt={label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(234,226,210,0.06)" }} />
      </div>
    );
  }
  const bg = tone === "dark" ? "var(--teal-deep)" : "var(--cream-light)";
  const line = tone === "dark" ? "rgba(234,226,210,0.08)" : "rgba(62,79,86,0.08)";
  return (
    <div
      className={`relative overflow-hidden flex items-end ${className}`}
      style={{
        aspectRatio: ratio,
        background: `repeating-linear-gradient(135deg, ${bg} 0 22px, ${line} 22px 23px)`,
      }}
    >
      <div className="p-4 font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--stone)" }}>
        [ {label} ]
      </div>
    </div>
  );
};

// ---- Nav -----------------------------------------------------------------

function Nav({ route, go, announcement = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "pricing", label: "Pricing" },
    { id: "journal", label: "Journal" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40" style={{ background: "var(--cream)" }}>
      {announcement && (
        <div className="text-center py-2 text-[11px] tracking-[0.22em] uppercase"
          style={{ background: "var(--cream-light)", color: "var(--teal)" }}>
          <span>Spring hours — now open Saturdays until 5pm</span>
        </div>
      )}
      <nav className={`flex items-center justify-between px-6 md:px-12 py-5 transition-all ${scrolled ? "border-b" : ""}`}
        style={{ borderColor: scrolled ? "rgba(178,139,93,calc(var(--gold-intensity,1) * 0.35))" : "transparent" }}>
        <a onClick={() => go("home")} className="cursor-pointer flex items-center" aria-label="Balance and Wellness, home">
          <span className="font-display text-[26px] leading-none" style={{ color: "var(--teal)" }}>Balance</span>
          <span className="font-script text-[20px] ml-2 mt-3" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>and Wellness</span>
        </a>
        <ul className="hidden md:flex items-center gap-9">
          {links.map(l => (
            <li key={l.id}>
              <a
                onClick={() => go(l.id)}
                className="cursor-pointer text-[13px] tracking-[0.12em] uppercase relative pb-1"
                style={{ color: "var(--teal)" }}
              >
                {l.label}
                {route === l.id && (
                  <span className="absolute left-0 right-0 -bottom-1 h-[2px]"
                    style={{ background: "var(--gold)", opacity: "var(--gold-intensity, 1)" }} />
                )}
              </a>
            </li>
          ))}
          <li>
            <Button variant="primary" onClick={() => go("book")}>Book</Button>
          </li>
          <li>
            <a onClick={() => go("admin")} className="cursor-pointer text-[11px] tracking-[0.22em] uppercase opacity-60 hover:opacity-100" style={{ color: "var(--teal)" }}>Admin</a>
          </li>
        </ul>
        <button className="md:hidden text-[var(--teal)]" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{ borderColor: "rgba(62,79,86,0.08)", background: "var(--cream)" }}>
          {links.map(l => (
            <a key={l.id} onClick={() => { go(l.id); setOpen(false); }} className="cursor-pointer text-[14px] tracking-[0.12em] uppercase" style={{ color: "var(--teal)" }}>{l.label}</a>
          ))}
          <Button variant="primary" onClick={() => { go("book"); setOpen(false); }}>Book</Button>
          <a onClick={() => { go("admin"); setOpen(false); }} className="cursor-pointer text-[12px] tracking-[0.22em] uppercase opacity-60" style={{ color: "var(--teal)" }}>Admin</a>
        </div>
      )}
    </header>
  );
}

// ---- Footer --------------------------------------------------------------

function Footer({ content, go }) {
  return (
    <footer className="pt-20 pb-10 px-6 md:px-12" style={{ background: "var(--teal-deep)", color: "var(--cream)" }}>
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-baseline">
            <span className="font-display text-[28px]" style={{ color: "var(--cream)" }}>Balance</span>
            <span className="font-script text-[20px] ml-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>and Wellness</span>
          </div>
          <p className="mt-5 text-[13px] leading-[22px] opacity-70 max-w-[220px]">
            A boutique massage studio in the heart of Bristol.
          </p>
        </div>
        <div>
          <Eyebrow className="!text-[var(--gold)]">Studio</Eyebrow>
          <ul className="mt-4 space-y-2 text-[13px]">
            <li><a onClick={() => go("about")} className="cursor-pointer opacity-80 hover:opacity-100">About</a></li>
            <li><a onClick={() => go("services")} className="cursor-pointer opacity-80 hover:opacity-100">Treatments</a></li>
            <li><a onClick={() => go("pricing")} className="cursor-pointer opacity-80 hover:opacity-100">Pricing</a></li>
            <li><a onClick={() => go("journal")} className="cursor-pointer opacity-80 hover:opacity-100">Journal</a></li>
          </ul>
        </div>
        <div>
          <Eyebrow>Visit</Eyebrow>
          <ul className="mt-4 space-y-2 text-[13px] opacity-80">
            {content.visit.address.map(l => <li key={l}>{l}</li>)}
            <li className="pt-2">{content.visit.phone}</li>
            <li><a href={`mailto:${content.visit.email}`} className="hover:opacity-100">{content.visit.email}</a></li>
          </ul>
        </div>
        <div>
          <Eyebrow>Newsletter</Eyebrow>
          <p className="mt-4 text-[13px] leading-[22px] opacity-80">{content.newsletter.title}</p>
          <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed (mock)"); }} className="mt-4 flex items-center border-b pb-2" style={{ borderColor: "rgba(234,226,210,0.25)" }}>
            <input type="email" placeholder="your@email.com" className="bg-transparent flex-1 text-[13px] placeholder:opacity-50 focus:outline-none" style={{ color: "var(--cream)" }} />
            <button type="submit" className="text-[11px] tracking-[0.22em] uppercase" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Subscribe →</button>
          </form>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] tracking-[0.18em] uppercase opacity-50 gap-3"
        style={{ borderTop: "1px solid rgba(234,226,210,0.15)" }}>
        <span>© 2026 Balance and Wellness · Designed by Focus & Co</span>
        <div className="flex gap-6">
          <a onClick={() => go("privacy")} className="cursor-pointer">Privacy</a>
          <a onClick={() => go("terms")} className="cursor-pointer">Terms</a>
          <a className="cursor-pointer">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

// ---- Hero ---------------------------------------------------------------

function Hero({ content, images, go, density }) {
  const heroUrl = images.hero;
  const compact = density === "compact";
  return (
    <section className={`relative w-full ${compact ? "h-[72vh] min-h-[520px]" : "h-[88vh] min-h-[640px]"} flex items-center justify-center overflow-hidden`}>
      {/* Image layer */}
      <div className="absolute inset-0">
        {heroUrl ? (
          <img src={heroUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 30% 40%, rgba(210,184,148,0.55), transparent 60%),
                radial-gradient(ellipse at 70% 70%, rgba(62,79,86,0.85), transparent 70%),
                linear-gradient(180deg, #3a302a, #221a17 70%)
              `,
            }}
          />
        )}
        {/* warm overlay + cream gradient bottom */}
        <div className="absolute inset-0" style={{ background: "rgba(178,139,93,0.04)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to bottom, transparent, var(--cream))" }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-[780px]">
        <Eyebrow className="!text-[var(--cream-light)]">{content.hero.eyebrow}</Eyebrow>
        <div className="flex justify-center mt-4">
          <GoldRule width="w-10" />
        </div>
        <h1 className={`font-display mt-6 leading-[1.05] ${compact ? "text-[52px] md:text-[64px]" : "text-[56px] md:text-[78px]"}`}
          style={{ color: "var(--cream)" }}>
          {content.hero.display}
        </h1>
        <p className="mt-8 text-[17px] md:text-[19px] leading-[30px] max-w-[520px] mx-auto"
          style={{ color: "var(--cream)", opacity: 0.9 }}>
          {content.hero.sub}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Button variant="primary" onClick={() => go("book")}>{content.hero.primaryCta}</Button>
          <a onClick={() => go("services")} className="cursor-pointer text-[13px] tracking-[0.12em] uppercase border-b pb-1"
            style={{ color: "var(--cream)", borderColor: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
            {content.hero.secondaryCta}
          </a>
        </div>
      </div>

      {/* soft scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center" style={{ color: "var(--cream)", opacity: 0.7 }}>
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="mt-2 w-px h-10" style={{ background: "var(--cream)" }} />
      </div>
    </section>
  );
}

// ---- Home sections -------------------------------------------------------

function Approach({ content, density }) {
  const pad = density === "compact" ? "py-20" : "py-32";
  return (
    <section className={`${pad} px-6 md:px-12`} style={{ background: "var(--cream)" }}>
      <div className="max-w-[1180px] mx-auto">
        <div className="text-center">
          <Eyebrow>— {content.approach.title} —</Eyebrow>
          <h2 className="font-display text-[36px] md:text-[44px] leading-[1.15] mt-6 max-w-[620px] mx-auto"
            style={{ color: "var(--teal)" }}>
            Welcome to Balance and Wellness. We're passionate about complementary therapies.
          </h2>
          <p className="mt-6 text-[15px] leading-[28px] max-w-[540px] mx-auto" style={{ color: "var(--teal)", opacity: 0.75 }}>
            Three principles shape every session — from the moment you arrive to the final cup of tea on the way out.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 mt-20">
          {content.approach.items.map((it, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-6 w-10 h-10 flex items-center justify-center" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
                {/* Minimal lucide-style stroke icons */}
                {i === 0 && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                )}
                {i === 1 && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M4 18c4-6 12-6 16 0" />
                    <path d="M4 12c4-6 12-6 16 0" />
                    <path d="M4 6c4-6 12-6 16 0" />
                  </svg>
                )}
                {i === 2 && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 3v18" />
                    <path d="M5 8c2 3 5 3 7 3s5 0 7-3" />
                    <path d="M5 16c2-3 5-3 7-3s5 0 7 3" />
                  </svg>
                )}
              </div>
              <div className="font-display text-[22px]" style={{ color: "var(--teal)" }}>{it.eyebrow}</div>
              <div className="mt-3 flex justify-center"><GoldRule width="w-6" /></div>
              <p className="mt-5 text-[14px] leading-[24px] max-w-[280px] mx-auto" style={{ color: "var(--teal)", opacity: 0.8 }}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Treatments({ services, images, content, go, density }) {
  const pad = density === "compact" ? "py-20" : "py-32";
  return (
    <section className={`${pad} px-6 md:px-12`} style={{ background: "var(--cream-light)" }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center">
          <Eyebrow>{content.treatmentsIntro.eyebrow}</Eyebrow>
          <h2 className="font-display text-[40px] md:text-[52px] leading-[1.1] mt-6 max-w-[720px] mx-auto" style={{ color: "var(--teal)" }}>
            {content.treatmentsIntro.title}
          </h2>
          <p className="mt-6 text-[15px] leading-[28px] max-w-[520px] mx-auto" style={{ color: "var(--teal)", opacity: 0.75 }}>
            {content.treatmentsIntro.body}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 mt-20">
          {services.map(s => (
            <article key={s.id} className="group cursor-pointer" onClick={() => go(`service:${s.id}`)}>
              <ImgPlaceholder label={`${s.name} image`} url={images[s.image]} className="mb-7" ratio="4 / 5" />
              <Eyebrow>Treatment</Eyebrow>
              <h3 className="font-display text-[26px] mt-3" style={{ color: "var(--teal)" }}>{s.name}</h3>
              <p className="mt-3 text-[14px] leading-[24px]" style={{ color: "var(--teal)", opacity: 0.8 }}>{s.tagline}</p>
              <div className="mt-5 flex items-center justify-between text-[13px]" style={{ color: "var(--teal)" }}>
                <span className="opacity-70">from £{s.durations[0].price} / {s.durations[0].mins} min</span>
                <span className="tracking-[0.14em] uppercase border-b pb-0.5" style={{ borderColor: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Read more →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial({ content }) {
  return (
    <section className="py-32 px-6 md:px-12" style={{ background: "var(--cream)" }}>
      <div className="max-w-[820px] mx-auto text-center">
        <GoldRule width="w-10" />
        <p className="font-display italic text-[32px] md:text-[44px] leading-[1.25] mt-10" style={{ color: "var(--teal)" }}>
          "{content.testimonial.quote}"
        </p>
        <div className="mt-8 text-[11px] tracking-[0.28em]" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
          {content.testimonial.attribution}
        </div>
      </div>
    </section>
  );
}

function Visit({ content, images }) {
  return (
    <section className="py-24 px-6 md:px-12" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <ImgPlaceholder label="Studio interior" url={images.studio} ratio="4 / 3" />
        </div>
        <div>
          <Eyebrow>{content.visit.eyebrow}</Eyebrow>
          <h2 className="font-display text-[40px] md:text-[48px] leading-[1.1] mt-6" style={{ color: "var(--teal)" }}>
            {content.visit.title}
          </h2>
          <p className="mt-6 text-[15px] leading-[28px] max-w-[440px]" style={{ color: "var(--teal)", opacity: 0.8 }}>
            {content.visit.body}
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-4 text-[13px]" style={{ color: "var(--teal)" }}>
            <div>
              <Eyebrow>Address</Eyebrow>
              {content.visit.address.map(a => <div key={a} className="mt-1">{a}</div>)}
              <div className="mt-3 opacity-75">{content.visit.phone}</div>
            </div>
            <div>
              <Eyebrow>Hours</Eyebrow>
              {content.visit.hours.map(([d, h]) => (
                <div key={d} className="mt-1 flex justify-between gap-4">
                  <span>{d}</span><span className="opacity-70">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home({ state, go, density }) {
  return (
    <>
      <Hero content={state.content} images={state.images} go={go} density={density} />
      <Approach content={state.content} density={density} />
      <Treatments services={state.services} images={state.images} content={state.content} go={go} density={density} />
      <Testimonial content={state.content} />
      <Visit content={state.content} images={state.images} />
    </>
  );
}

Object.assign(window, { Nav, Footer, Hero, Home, GoldRule, Eyebrow, Button, ImgPlaceholder });
