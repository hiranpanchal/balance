interface IntakeForm {
  completedAt: string;
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
}

const PRESSURE_LABELS: Record<string, string> = {
  light: "Light — gentle, soothing",
  medium: "Medium — balanced, moderate",
  firm: "Firm — deeper, targeted",
  deep: "Deep — intensive, therapeutic",
};

function Section({ title }: { title: string }) {
  return (
    <p className="text-[10px] tracking-[0.18em] uppercase text-[#B28B5D] font-medium pt-6 pb-3 border-t border-[#F5F0E6] first:pt-0 first:border-0">
      {title}
    </p>
  );
}

function Row({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex gap-6 py-3 border-b border-[#F5F0E6] last:border-0">
      <dt className="w-36 shrink-0 text-[11px] tracking-[0.08em] uppercase text-[#A09687] pt-0.5 leading-[18px]">
        {label}
      </dt>
      <dd className="flex-1 text-[13px] text-[#3E4F56] leading-[22px]">
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1.5">
            {value.map((v) => (
              <span key={v} className="bg-[#F5F0E6] text-[#3E4F56] text-[12px] px-2.5 py-1 rounded-full">
                {v}
              </span>
            ))}
          </div>
        ) : (
          <span className="whitespace-pre-wrap">{value}</span>
        )}
      </dd>
    </div>
  );
}

export function IntakeDetails({ intake }: { intake: IntakeForm }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687]">Intake form</h2>
        <span className="text-[11px] text-[#A09687]">
          Completed{" "}
          {new Date(intake.completedAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </span>
      </div>

      <dl>
        <Section title="Personal" />
        <Row label="Date of birth" value={intake.dateOfBirth} />
        <Row label="Occupation" value={intake.occupation} />
        <Row label="Address" value={intake.address} />
        <Row
          label="Emergency contact"
          value={
            intake.emergencyName
              ? `${intake.emergencyName}${intake.emergencyPhone ? `  ·  ${intake.emergencyPhone}` : ""}`
              : null
          }
        />

        <Section title="Health history" />
        <Row label="Conditions" value={intake.conditions.length > 0 ? intake.conditions : null} />
        <Row label="Medications" value={intake.medications} />
        <Row label="Allergies" value={intake.allergies} />
        <Row label="Recent injury" value={intake.recentInjury} />
        {intake.isPregnant && <Row label="Pregnancy" value="Currently pregnant" />}
        {!intake.conditions.length && !intake.medications && !intake.allergies && !intake.recentInjury && !intake.isPregnant && (
          <p className="text-[13px] text-[#A09687] py-2">No conditions reported.</p>
        )}

        <Section title="Session preferences" />
        <Row label="Pain areas" value={intake.painAreas.length > 0 ? intake.painAreas : null} />
        <Row label="Pain notes" value={intake.painNotes} />
        <Row
          label="Prev. massage"
          value={
            intake.previousMassage
              ? `Yes${intake.massageFrequency ? ` · ${intake.massageFrequency}` : ""}`
              : "No"
          }
        />
        <Row label="Pressure" value={PRESSURE_LABELS[intake.pressurePreference] ?? intake.pressurePreference} />
        <Row label="Areas to avoid" value={intake.areasToAvoid} />
        <Row label="Goals" value={intake.goals} />

        <Section title="Consent" />
        <Row label="Signed by" value={intake.consentName} />
      </dl>
    </div>
  );
}
