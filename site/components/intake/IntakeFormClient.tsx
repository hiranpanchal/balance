"use client";

import { useState } from "react";

interface Props {
  token: string;
  clientName: string;
}

interface FormData {
  dateOfBirth: string;
  occupation: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  conditions: string[];
  medications: string;
  allergies: string;
  recentInjury: string;
  isPregnant: boolean;
  painAreas: string[];
  painNotes: string;
  previousMassage: boolean;
  massageFrequency: string;
  pressurePreference: string;
  areasToAvoid: string;
  goals: string;
  consentName: string;
  consentAgreed: boolean;
}

const CONDITIONS = [
  "Heart condition or cardiovascular issues",
  "High blood pressure",
  "Low blood pressure",
  "Diabetes",
  "Epilepsy or seizures",
  "Cancer (current or history of)",
  "Blood clots or DVT",
  "Varicose veins",
  "Skin conditions (eczema, psoriasis)",
  "Osteoporosis",
  "Fibromyalgia",
  "Arthritis or joint pain",
  "Anxiety or depression",
  "Chronic fatigue syndrome",
  "Respiratory conditions (asthma)",
  "Numbness or tingling in limbs",
  "Recent surgery or injury",
];

const PAIN_AREAS = [
  "Head & scalp", "Neck & throat", "Shoulders",
  "Upper back", "Lower back", "Chest & abdomen",
  "Arms & hands", "Hips & glutes", "Legs & feet",
];

const PRESSURES = [
  { value: "light", label: "Light", desc: "Gentle, soothing" },
  { value: "medium", label: "Medium", desc: "Balanced, moderate" },
  { value: "firm", label: "Firm", desc: "Deeper, targeted" },
  { value: "deep", label: "Deep", desc: "Intensive, therapeutic" },
];

const STEPS = ["Personal", "Health history", "Your session", "Consent"];

const inputCls = "w-full border border-[#3E4F56]/15 rounded-md px-4 py-3 text-[14px] text-[#3E4F56] bg-white focus:outline-none focus:border-[#B28B5D] focus:ring-1 focus:ring-[#B28B5D]/30 transition-colors placeholder:text-[#A09687]/60";
const labelCls = "block text-[11px] tracking-[0.12em] uppercase text-[#A09687] mb-2";
const textareaCls = `${inputCls} resize-none leading-[24px]`;

export function IntakeFormClient({ token, clientName }: Props) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormData>({
    dateOfBirth: "", occupation: "", address: "",
    emergencyName: "", emergencyPhone: "",
    conditions: [], medications: "", allergies: "", recentInjury: "", isPregnant: false,
    painAreas: [], painNotes: "", previousMassage: false, massageFrequency: "",
    pressurePreference: "medium", areasToAvoid: "", goals: "",
    consentName: "", consentAgreed: false,
  });

  function set(field: keyof FormData, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleArr(field: "conditions" | "painAreas", val: string) {
    setForm((f) => {
      const arr = f[field] as string[];
      return { ...f, [field]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  }

  async function submit() {
    setSubmitting(true);
    const { consentAgreed, ...data } = form;
    await fetch(`/api/intake/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#EAE2D2] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-10 max-w-[480px] w-full text-center">
          <img src="/logo-light.svg" alt="Balance and Wellness" className="h-8 w-auto mx-auto mb-8" />
          <h1 className="font-serif text-[26px] text-[#3E4F56] font-normal mb-3">
            Thank you, {clientName}
          </h1>
          <p className="text-[14px] text-[#A09687] leading-[26px]">
            Your intake form has been received. We look forward to welcoming you to the studio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE2D2] py-12 px-4">
      <div className="max-w-[580px] mx-auto">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo-light.svg" alt="Balance and Wellness" className="h-8 w-auto mx-auto" />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 transition-colors ${
                  done ? "bg-[#B28B5D] text-white" : active ? "bg-[#3E4F56] text-white" : "bg-white/60 text-[#A09687]"
                }`}>
                  {done ? "✓" : n}
                </div>
                <span className={`text-[11px] tracking-[0.1em] uppercase hidden sm:block ${active ? "text-[#3E4F56]" : "text-[#A09687]"}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && <div className="flex-1 h-px bg-[#3E4F56]/15 ml-1" />}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm p-8">

          {/* ── Step 1: Personal ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-serif text-[22px] text-[#3E4F56] font-normal">Personal details</h2>
                <p className="text-[13px] text-[#A09687] mt-1">Hi {clientName} — a few details to get started.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Date of birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Occupation</label>
                  <input type="text" placeholder="e.g. Teacher" value={form.occupation} onChange={(e) => set("occupation", e.target.value)} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Home address</label>
                <textarea rows={2} placeholder="Street, city, postcode" value={form.address} onChange={(e) => set("address", e.target.value)} className={textareaCls} />
              </div>

              <div className="pt-2 border-t border-[#F5F0E6]">
                <p className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-4">Emergency contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input type="text" value={form.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="tel" value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Health history ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-[22px] text-[#3E4F56] font-normal">Health history</h2>
                <p className="text-[13px] text-[#A09687] mt-1">Please tick anything that applies to you.</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {CONDITIONS.map((c) => (
                  <label key={c} className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                      form.conditions.includes(c) ? "bg-[#3E4F56] border-[#3E4F56]" : "border-[#3E4F56]/25 group-hover:border-[#3E4F56]/50"
                    }`} onClick={() => toggleArr("conditions", c)}>
                      {form.conditions.includes(c) && <span className="text-white text-[10px] leading-none">✓</span>}
                    </div>
                    <span className="text-[13px] text-[#3E4F56] leading-[20px]" onClick={() => toggleArr("conditions", c)}>{c}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2 border-t border-[#F5F0E6] space-y-4">
                <div>
                  <label className={labelCls}>Current medications</label>
                  <textarea rows={3} placeholder="List any medications you are currently taking…" value={form.medications} onChange={(e) => set("medications", e.target.value)} className={textareaCls} />
                </div>
                <div>
                  <label className={labelCls}>Known allergies <span className="normal-case tracking-normal">(including nuts or oils)</span></label>
                  <textarea rows={2} placeholder="e.g. nut oils, lavender, latex…" value={form.allergies} onChange={(e) => set("allergies", e.target.value)} className={textareaCls} />
                </div>
                <div>
                  <label className={labelCls}>Recent injuries or surgeries</label>
                  <textarea rows={2} placeholder="Describe any recent injuries, surgeries, or ongoing pain…" value={form.recentInjury} onChange={(e) => set("recentInjury", e.target.value)} className={textareaCls} />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                    form.isPregnant ? "bg-[#3E4F56] border-[#3E4F56]" : "border-[#3E4F56]/25"
                  }`} onClick={() => set("isPregnant", !form.isPregnant)}>
                    {form.isPregnant && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className="text-[13px] text-[#3E4F56]" onClick={() => set("isPregnant", !form.isPregnant)}>
                    I am currently pregnant
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ── Step 3: Session preferences ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-[22px] text-[#3E4F56] font-normal">Your session</h2>
                <p className="text-[13px] text-[#A09687] mt-1">Help us tailor the session to you.</p>
              </div>

              <div>
                <label className={labelCls}>Areas of concern <span className="normal-case tracking-normal">(select all that apply)</span></label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {PAIN_AREAS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleArr("painAreas", a)}
                      className={`py-2 px-3 rounded-md text-[12px] text-left border transition-colors ${
                        form.painAreas.includes(a)
                          ? "bg-[#3E4F56] text-white border-[#3E4F56]"
                          : "bg-white text-[#3E4F56] border-[#3E4F56]/20 hover:border-[#3E4F56]/40"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Describe any pain or tension</label>
                <textarea rows={3} placeholder="Where does it hurt? Is it sharp, dull, constant? How long have you had it?" value={form.painNotes} onChange={(e) => set("painNotes", e.target.value)} className={textareaCls} />
              </div>

              <div className="pt-2 border-t border-[#F5F0E6] space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                    form.previousMassage ? "bg-[#3E4F56] border-[#3E4F56]" : "border-[#3E4F56]/25"
                  }`} onClick={() => set("previousMassage", !form.previousMassage)}>
                    {form.previousMassage && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className="text-[13px] text-[#3E4F56]" onClick={() => set("previousMassage", !form.previousMassage)}>
                    I have had a professional massage before
                  </span>
                </label>

                {form.previousMassage && (
                  <div>
                    <label className={labelCls}>How often do you usually receive massage?</label>
                    <input type="text" placeholder="e.g. monthly, a few times a year…" value={form.massageFrequency} onChange={(e) => set("massageFrequency", e.target.value)} className={inputCls} />
                  </div>
                )}

                <div>
                  <label className={labelCls}>Pressure preference</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {PRESSURES.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => set("pressurePreference", p.value)}
                        className={`py-3 px-4 rounded-md border text-left transition-colors ${
                          form.pressurePreference === p.value
                            ? "bg-[#3E4F56] text-white border-[#3E4F56]"
                            : "bg-white text-[#3E4F56] border-[#3E4F56]/20 hover:border-[#3E4F56]/40"
                        }`}
                      >
                        <div className="text-[13px] font-medium">{p.label}</div>
                        <div className={`text-[11px] mt-0.5 ${form.pressurePreference === p.value ? "text-white/70" : "text-[#A09687]"}`}>{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Any areas you would like us to avoid?</label>
                  <textarea rows={2} placeholder="e.g. abdomen, feet, face…" value={form.areasToAvoid} onChange={(e) => set("areasToAvoid", e.target.value)} className={textareaCls} />
                </div>

                <div>
                  <label className={labelCls}>What are your goals for today?</label>
                  <textarea rows={3} placeholder="e.g. reduce lower back tension, de-stress, improve sleep…" value={form.goals} onChange={(e) => set("goals", e.target.value)} className={textareaCls} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Consent ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-[22px] text-[#3E4F56] font-normal">Declaration &amp; consent</h2>
              </div>

              <div className="bg-[#F5F0E6] rounded-lg p-5 text-[13px] text-[#3E4F56] leading-[22px] space-y-3">
                <p>I confirm that the information I have provided is accurate and complete to the best of my knowledge.</p>
                <p>I understand that massage therapy is not a substitute for medical diagnosis or treatment, and I will inform my therapist of any changes to my health before each session.</p>
                <p>I consent to receiving massage treatment and understand that I may withdraw consent at any time.</p>
              </div>

              <div>
                <label className={labelCls}>Full name <span className="normal-case tracking-normal text-[#A09687]">(typed signature)</span></label>
                <input
                  type="text"
                  placeholder="Type your full name to sign"
                  value={form.consentName}
                  onChange={(e) => set("consentName", e.target.value)}
                  className={inputCls}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                    form.consentAgreed ? "bg-[#3E4F56] border-[#3E4F56]" : "border-[#3E4F56]/25"
                  }`}
                  onClick={() => set("consentAgreed", !form.consentAgreed)}
                >
                  {form.consentAgreed && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className="text-[13px] text-[#3E4F56] leading-[20px]" onClick={() => set("consentAgreed", !form.consentAgreed)}>
                  I have read and agree to the declaration above
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F5F0E6]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-[13px] text-[#A09687] hover:text-[#3E4F56] transition-colors"
              >
                ← Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-8 py-3 bg-[#3E4F56] text-white text-[12px] tracking-[0.12em] uppercase rounded-md hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={!form.consentName || !form.consentAgreed || submitting}
                onClick={submit}
                className="px-8 py-3 bg-[#B28B5D] text-white text-[12px] tracking-[0.12em] uppercase rounded-md hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                {submitting ? "Submitting…" : "Submit form"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-[#A09687] mt-6">
          Balance &amp; Wellness · 14 Linen Lane, Bristol BS1 4AA
        </p>
      </div>
    </div>
  );
}
