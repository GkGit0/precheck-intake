import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Languages, Stethoscope } from "lucide-react";
import { locales, langCodes, type LangCode } from "../locales";

const emptyForm = {
  fullName: "", dob: "", nationality: "", phone: "", company: "",
  symptoms: [], symptomNotes: "",
  conditions: "", medications: "", allergies: "", surgeries: "",
  jobType: "", hoursPerWeek: "", physicalDemand: "", exposures: [],
};

export default function IntakeForm() {
  const [lang, setLang] = useState<LangCode>("en");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const t = locales[lang];

  const totalSteps = t.steps.length;

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleArrayItem = (key, value) => {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const restart = () => {
    setForm(emptyForm);
    setStep(0);
    setSubmitted(false);
  };

  const fieldClasses =
    "w-full rounded-lg border border-[#D8DDE3] bg-white px-4 py-3 text-[15px] text-[#1B2733] placeholder:text-[#9AA5B1] focus:outline-none focus:ring-2 focus:ring-[#0F6E5E] focus:border-transparent transition";

  const labelClasses = "block text-sm font-medium text-[#3A4550] mb-1.5";

  const Chip = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm border transition ${
        active
          ? "bg-[#0F6E5E] border-[#0F6E5E] text-white"
          : "bg-white border-[#D8DDE3] text-[#3A4550] hover:border-[#0F6E5E]"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-[640px] w-full bg-[#F4F6F5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-[0_1px_2px_rgba(16,24,32,0.06),0_8px_24px_rgba(16,24,32,0.08)] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-[#EDF0F1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0F6E5E] flex items-center justify-center shrink-0">
              <Stethoscope size={18} className="text-white" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#1B2733] leading-tight">{t.appName}</div>
              <div className="text-[13px] text-[#6B7684] leading-tight">{t.tagline}</div>
            </div>
          </div>
          <div className="flex rounded-full bg-[#F0F2F1] p-1">
            {langCodes.map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium transition ${
                  lang === code ? "bg-white shadow-sm text-[#0F6E5E]" : "text-[#6B7684]"
                }`}
              >
                {code === lang && <Languages size={13} />}
                {locales[code].langLabel}
              </button>
            ))}
          </div>
        </div>

        {!submitted ? (
          <>
            {/* Progress */}
            <div className="px-6 pt-5">
              <div className="flex items-center gap-1.5 mb-5">
                {t.steps.map((label, i) => (
                  <div key={label} className="flex-1">
                    <div
                      className={`h-1.5 rounded-full transition-colors ${
                        i <= step ? "bg-[#0F6E5E]" : "bg-[#E4E8E7]"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs font-medium tracking-wide uppercase text-[#0F6E5E] mb-1">
                {t.stepOf
                  .replace("{current}", String(step + 1))
                  .replace("{total}", String(totalSteps))}
              </div>
            </div>

            {/* Step content */}
            <div className="px-6 pb-2 min-h-[340px]">
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1B2733] mb-1">{t.stepBasics.title}</h2>
                  <p className="text-[13.5px] text-[#6B7684] mb-5">{t.stepBasics.sub}</p>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClasses}>{t.stepBasics.fullName}</label>
                      <input className={fieldClasses} placeholder={t.stepBasics.fullNamePh} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>{t.stepBasics.dob}</label>
                        <input type="date" className={fieldClasses} value={form.dob} onChange={(e) => update("dob", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClasses}>{t.stepBasics.nationality}</label>
                        <input className={fieldClasses} placeholder={t.stepBasics.nationalityPh} value={form.nationality} onChange={(e) => update("nationality", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClasses}>{t.stepBasics.phone}</label>
                      <input className={fieldClasses} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClasses}>{t.stepBasics.company}</label>
                      <input className={fieldClasses} placeholder={t.stepBasics.companyPh} value={form.company} onChange={(e) => update("company", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1B2733] mb-1">{t.stepSymptoms.title}</h2>
                  <p className="text-[13.5px] text-[#6B7684] mb-5">{t.stepSymptoms.sub}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {t.stepSymptoms.list.map((s) => (
                      <Chip key={s} active={form.symptoms.includes(s)} onClick={() => toggleArrayItem("symptoms", s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                  <div>
                    <label className={labelClasses}>{t.stepSymptoms.notes}</label>
                    <textarea rows={3} className={fieldClasses} placeholder={t.stepSymptoms.notesPh} value={form.symptomNotes} onChange={(e) => update("symptomNotes", e.target.value)} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#1B2733] mb-1">{t.stepHistory.title}</h2>
                  <p className="text-[13.5px] text-[#6B7684] mb-1">{t.stepHistory.sub}</p>
                  <div>
                    <label className={labelClasses}>{t.stepHistory.conditions}</label>
                    <input className={fieldClasses} placeholder={t.stepHistory.conditionsPh} value={form.conditions} onChange={(e) => update("conditions", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>{t.stepHistory.medications}</label>
                    <input className={fieldClasses} placeholder={t.stepHistory.medicationsPh} value={form.medications} onChange={(e) => update("medications", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>{t.stepHistory.allergies}</label>
                    <input className={fieldClasses} placeholder={t.stepHistory.allergiesPh} value={form.allergies} onChange={(e) => update("allergies", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>{t.stepHistory.surgeries}</label>
                    <input className={fieldClasses} placeholder={t.stepHistory.surgeriesPh} value={form.surgeries} onChange={(e) => update("surgeries", e.target.value)} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#1B2733] mb-1">{t.stepWork.title}</h2>
                  <p className="text-[13.5px] text-[#6B7684] mb-1">{t.stepWork.sub}</p>
                  <div>
                    <label className={labelClasses}>{t.stepWork.jobType}</label>
                    <input className={fieldClasses} placeholder={t.stepWork.jobTypePh} value={form.jobType} onChange={(e) => update("jobType", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>{t.stepWork.hoursPerWeek}</label>
                    <input type="number" className={fieldClasses} value={form.hoursPerWeek} onChange={(e) => update("hoursPerWeek", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>{t.stepWork.physicalDemand}</label>
                    <div className="flex gap-2">
                      {t.stepWork.demandLevels.map((level) => (
                        <Chip key={level} active={form.physicalDemand === level} onClick={() => update("physicalDemand", level)}>
                          {level}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>{t.stepWork.exposures}</label>
                    <div className="flex flex-wrap gap-2">
                      {t.stepWork.exposureList.map((ex) => (
                        <Chip key={ex} active={form.exposures.includes(ex)} onClick={() => toggleArrayItem("exposures", ex)}>
                          {ex}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1B2733] mb-1">{t.review.title}</h2>
                  <p className="text-[13.5px] text-[#6B7684] mb-4">{t.review.sub}</p>
                  <div className="rounded-xl border border-[#EDF0F1] divide-y divide-[#EDF0F1] max-h-[300px] overflow-y-auto">
                    {[
                      [t.stepBasics.fullName, form.fullName],
                      [t.stepBasics.dob, form.dob],
                      [t.stepBasics.nationality, form.nationality],
                      [t.stepBasics.phone, form.phone],
                      [t.stepBasics.company, form.company],
                      [t.stepSymptoms.title, form.symptoms.join(", ")],
                      [t.stepHistory.conditions, form.conditions],
                      [t.stepHistory.medications, form.medications],
                      [t.stepHistory.allergies, form.allergies],
                      [t.stepWork.jobType, form.jobType],
                      [t.stepWork.physicalDemand, form.physicalDemand],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                        <span className="text-[#6B7684]">{label}</span>
                        <span className="text-[#1B2733] font-medium text-right">{value || t.nav.noneEntered}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer nav */}
            <div className="px-6 py-5 flex items-center justify-between border-t border-[#EDF0F1] mt-2">
              <button
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-1 text-sm font-medium text-[#3A4550] disabled:opacity-0 disabled:pointer-events-none"
              >
                <ChevronLeft size={16} /> {t.nav.back}
              </button>
              {step < totalSteps - 1 ? (
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 bg-[#0F6E5E] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#0C5B4E] transition"
                >
                  {t.nav.next} <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setSubmitted(true)}
                  className="flex items-center gap-1.5 bg-[#0F6E5E] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#0C5B4E] transition"
                >
                  <Check size={16} /> {t.review.submit}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="px-8 py-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#E7F4EF] flex items-center justify-center mb-4">
              <Check size={26} className="text-[#0F6E5E]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1B2733] mb-1.5">{t.review.submitted}</h2>
            <p className="text-[13.5px] text-[#6B7684] max-w-xs mb-6">{t.review.submittedSub}</p>
            <button
              onClick={restart}
              className="text-sm font-medium text-[#0F6E5E] border border-[#0F6E5E] px-4 py-2 rounded-lg hover:bg-[#F0F9F6] transition"
            >
              {t.review.newForm}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}