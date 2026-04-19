"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCopy, Check, Send } from "lucide-react";

interface IntakeForm {
  id: string;
  token: string;
  completedAt: string | null;
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
  createdAt: string;
}

interface Props {
  clientId: string;
  intake: IntakeForm | null;
}

const PRESSURE_LABELS: Record<string, string> = {
  light: "Light — gentle, soothing",
  medium: "Medium — balanced, moderate",
  firm: "Firm — deeper, targeted",
  deep: "Deep — intensive, therapeutic",
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-[#F5F0E6] last:border-0 grid grid-cols-[140px_1fr] gap-4">
      <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] pt-0.5">{label}</dt>
      <dd className="text-[13px] text-[#3E4F56] leading-[22px] whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export function IntakeSection({ clientId, intake: initialIntake }: Props) {
  const router = useRouter();
  const [intake, setIntake] = useState(initialIntake);
  const [link, setLink] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function sendIntake() {
    setSending(true);
    const res = await fetch(`/api/admin/clients/${clientId}/intake`, { method: "POST" });
    const data = await res.json();
    setIntake(data.intake);
    setLink(data.url);
    setSending(false);
    router.refresh();
  }

  function copyLink() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isCompleted = !!intake?.completedAt;
  const isSent = !!intake && !isCompleted;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687]">Intake form</h2>
        {isCompleted && (
          <span className="text-[11px] tracking-[0.08em] uppercase bg-[#3E4F56]/8 text-[#3E4F56] px-2 py-1 rounded">
            Completed
          </span>
        )}
        {isSent && !link && (
          <span className="text-[11px] tracking-[0.08em] uppercase bg-[#B28B5D]/10 text-[#B28B5D] px-2 py-1 rounded">
            Sent
          </span>
        )}
      </div>

      {/* Completed — show data */}
      {isCompleted && intake && (
        <div>
          <p className="text-[12px] text-[#A09687] mb-4">
            Submitted {new Date(intake.completedAt!).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            <button onClick={() => setExpanded((v) => !v)} className="text-[#B28B5D] hover:underline">
              {expanded ? "Hide details" : "View details"}
            </button>
          </p>

          {expanded && (
            <dl className="mt-4 divide-y divide-[#F5F0E6]">
              {/* Personal */}
              <div className="pb-3 mb-3">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#B28B5D] mb-2">Personal</p>
                <Row label="Date of birth" value={intake.dateOfBirth} />
                <Row label="Occupation" value={intake.occupation} />
                <Row label="Address" value={intake.address} />
                <Row label="Emergency contact" value={intake.emergencyName ? `${intake.emergencyName} · ${intake.emergencyPhone}` : null} />
              </div>

              {/* Health */}
              <div className="py-3 mb-3">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#B28B5D] mb-2">Health history</p>
                {(intake.conditions as string[]).length > 0 && (
                  <div className="py-3 border-b border-[#F5F0E6] grid grid-cols-[140px_1fr] gap-4">
                    <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] pt-0.5">Conditions</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {(intake.conditions as string[]).map((c) => (
                        <span key={c} className="text-[11px] bg-[#F5F0E6] text-[#3E4F56] px-2 py-0.5 rounded">{c}</span>
                      ))}
                    </dd>
                  </div>
                )}
                <Row label="Medications" value={intake.medications} />
                <Row label="Allergies" value={intake.allergies} />
                <Row label="Recent injury" value={intake.recentInjury} />
                {intake.isPregnant && <Row label="Pregnancy" value="Currently pregnant" />}
              </div>

              {/* Session */}
              <div className="py-3 mb-3">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#B28B5D] mb-2">Session preferences</p>
                {(intake.painAreas as string[]).length > 0 && (
                  <div className="py-3 border-b border-[#F5F0E6] grid grid-cols-[140px_1fr] gap-4">
                    <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] pt-0.5">Pain areas</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {(intake.painAreas as string[]).map((a) => (
                        <span key={a} className="text-[11px] bg-[#F5F0E6] text-[#3E4F56] px-2 py-0.5 rounded">{a}</span>
                      ))}
                    </dd>
                  </div>
                )}
                <Row label="Pain notes" value={intake.painNotes} />
                <Row label="Prev. massage" value={intake.previousMassage ? `Yes${intake.massageFrequency ? ` · ${intake.massageFrequency}` : ""}` : "No"} />
                <Row label="Pressure" value={PRESSURE_LABELS[intake.pressurePreference] ?? intake.pressurePreference} />
                <Row label="Areas to avoid" value={intake.areasToAvoid} />
                <Row label="Goals" value={intake.goals} />
              </div>

              {/* Consent */}
              <div className="pt-3">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#B28B5D] mb-2">Consent</p>
                <Row label="Signed by" value={intake.consentName} />
              </div>
            </dl>
          )}

          {/* Resend option */}
          <div className="mt-4 pt-4 border-t border-[#F5F0E6]">
            <button
              onClick={sendIntake}
              disabled={sending}
              className="text-[12px] text-[#A09687] hover:text-[#3E4F56] transition-colors"
            >
              {sending ? "Sending…" : "Resend link"}
            </button>
          </div>
        </div>
      )}

      {/* Sent but not completed */}
      {isSent && !link && (
        <div>
          <p className="text-[13px] text-[#A09687] mb-4">Link sent — waiting for the client to complete the form.</p>
          <button
            onClick={sendIntake}
            disabled={sending}
            className="flex items-center gap-2 text-[12px] text-[#A09687] hover:text-[#3E4F56] transition-colors"
          >
            <Send size={12} strokeWidth={1.5} />
            {sending ? "Sending…" : "Resend link"}
          </button>
        </div>
      )}

      {/* Not yet sent */}
      {!intake && !link && (
        <div>
          <p className="text-[13px] text-[#A09687] mb-4 leading-[22px]">
            Send the client a link to complete their health intake form before their first appointment.
          </p>
          <button
            onClick={sendIntake}
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Send size={13} strokeWidth={1.5} />
            {sending ? "Sending…" : "Send intake form"}
          </button>
        </div>
      )}

      {/* Link just generated — show copyable URL */}
      {link && (
        <div className="mt-4 space-y-3">
          <p className="text-[12px] text-[#A09687]">
            {process.env.NODE_ENV !== "production" ? "Email not sent in dev — copy the link:" : "Email sent. You can also copy the link:"}
          </p>
          <div className="flex items-center gap-2 bg-[#F5F0E6] rounded-md px-3 py-2.5">
            <span className="text-[11px] text-[#3E4F56] truncate flex-1 font-mono">{link}</span>
            <button onClick={copyLink} className="shrink-0 text-[#A09687] hover:text-[#3E4F56]">
              {copied ? <Check size={14} strokeWidth={1.5} className="text-green-600" /> : <ClipboardCopy size={14} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
