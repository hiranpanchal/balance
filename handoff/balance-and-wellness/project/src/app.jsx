// App shell: route, state, Tweaks panel.
const { useState, useEffect } = React;

function App() {
  const [state, setState] = useState(() => window.BW.loadState());
  const [route, setRoute] = useState(() => (location.hash.replace(/^#\/?/, "") || "home"));
  const [tweaks, setTweaks] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("bw_tweaks") || "null");
    return stored || (window.__TWEAK_DEFAULTS__ || {});
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  // Persist state on change
  useEffect(() => { window.BW.saveState(state); }, [state]);
  useEffect(() => { localStorage.setItem("bw_tweaks", JSON.stringify(tweaks)); applyTweaks(tweaks); }, [tweaks]);

  // Router
  useEffect(() => {
    const onHash = () => setRoute(location.hash.replace(/^#\/?/, "") || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (r) => {
    location.hash = "#/" + r;
    window.scrollTo(0, 0);
  };

  // Edit-mode protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const isAdmin = route === "admin";
  const isBook = route === "book";

  const PageFrame = ({ children }) => (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {!isAdmin && !isBook && <Nav route={route} go={go} announcement={tweaks.announcement !== false} />}
      {children}
      {!isAdmin && !isBook && <Footer content={state.content} go={go} />}
    </div>
  );

  let page;
  if (route === "admin") page = <AdminApp state={state} setState={setState} go={go} />;
  else if (route === "book") page = (<>
    <Nav route={route} go={go} announcement={false} />
    <BookingFlow state={state} setState={setState} go={go} />
  </>);
  else page = <Home state={state} go={go} density={tweaks.density || "airy"} />;

  // Mobile breakpoint sim: wrap the entire view at 390px wide iframe-style
  if (mobile) {
    return (
      <div className="min-h-screen flex items-start justify-center py-10" style={{ background: "#1f1a18" }}>
        <div style={{ width: "390px", height: "820px", overflow: "auto", background: "var(--cream)", borderRadius: "36px", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", border: "8px solid #0a0a0a" }}>
          <PageFrame>{page}</PageFrame>
        </div>
        <ViewToggle mobile={mobile} setMobile={setMobile} dark />
        <TweaksPanel open={tweaksOpen} setOpen={setTweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
      </div>
    );
  }

  return (
    <>
      <PageFrame>{page}</PageFrame>
      <ViewToggle mobile={mobile} setMobile={setMobile} />
      <TweaksPanel open={tweaksOpen} setOpen={setTweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
    </>
  );
}

function ViewToggle({ mobile, setMobile, dark }) {
  return (
    <button onClick={() => setMobile(!mobile)}
      className="fixed bottom-5 left-5 z-50 px-4 py-2 text-[11px] tracking-[0.2em] uppercase"
      style={{ background: dark ? "var(--cream)" : "var(--teal-deep)", color: dark ? "var(--teal)" : "var(--cream)", borderRadius: "999px", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}>
      {mobile ? "Desktop view" : "Mobile view"}
    </button>
  );
}

function applyTweaks(t) {
  const r = document.documentElement;
  r.style.setProperty("--gold-intensity", String(t.goldIntensity ?? 1));
  r.style.setProperty("--gold", t.goldHex || "#B28B5D");
  r.style.setProperty("--teal", t.tealHex || "#3E4F56");
}

function TweaksPanel({ open, setOpen, tweaks, setTweaks }) {
  if (!open) return null;
  const save = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
  };
  return (
    <div className="fixed bottom-5 right-5 z-50 w-[320px] p-5" style={{ background: "var(--cream)", borderRadius: "8px", border: "1px solid rgba(62,79,86,0.15)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="font-display text-[18px]" style={{ color: "var(--teal)" }}>Tweaks</div>
        <button onClick={() => setOpen(false)} className="text-[11px] tracking-[0.22em] uppercase opacity-60" style={{ color: "var(--teal)" }}>Close</button>
      </div>
      <div className="space-y-5">
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase mb-2 flex items-center justify-between" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
            <span>Gold accent intensity</span><span>{Math.round((tweaks.goldIntensity ?? 1) * 100)}%</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" value={tweaks.goldIntensity ?? 1}
            onChange={e => save({ goldIntensity: parseFloat(e.target.value) })}
            className="w-full accent-[var(--gold)]" />
        </div>
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Gold hue</div>
          <div className="flex gap-2">
            {[["Warm gold","#B28B5D"],["Antique brass","#A67C3F"],["Pale bronze","#C9A073"],["Deep umber","#8F6B3D"]].map(([label, hex]) => (
              <button key={hex} onClick={() => save({ goldHex: hex })} className="flex-1 h-8" title={label}
                style={{ background: hex, borderRadius: "2px", outline: tweaks.goldHex === hex ? "2px solid var(--teal)" : "1px solid rgba(62,79,86,0.15)", outlineOffset: "-1px" }} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Teal hue</div>
          <div className="flex gap-2">
            {[["Deep teal","#3E4F56"],["Ink","#2B3740"],["Seafoam","#4F6670"],["Charcoal","#333333"]].map(([label, hex]) => (
              <button key={hex} onClick={() => save({ tealHex: hex })} className="flex-1 h-8" title={label}
                style={{ background: hex, borderRadius: "2px", outline: tweaks.tealHex === hex ? "2px solid var(--gold)" : "1px solid rgba(62,79,86,0.15)", outlineOffset: "-1px" }} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Density</div>
          <div className="flex gap-2">
            {["airy","compact"].map(d => (
              <button key={d} onClick={() => save({ density: d })}
                className="flex-1 py-2 text-[12px] tracking-[0.12em] uppercase"
                style={{ background: (tweaks.density || "airy") === d ? "var(--teal)" : "transparent", color: (tweaks.density || "airy") === d ? "var(--cream)" : "var(--teal)", border: "1px solid rgba(62,79,86,0.2)", borderRadius: "2px" }}>{d}</button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-3 text-[13px]" style={{ color: "var(--teal)" }}>
          <input type="checkbox" checked={tweaks.announcement !== false} onChange={e => save({ announcement: e.target.checked })} className="w-4 h-4 accent-[var(--teal)]" />
          Show announcement bar
        </label>
      </div>
    </div>
  );
}

Object.assign(window, { App });

// Mount
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
