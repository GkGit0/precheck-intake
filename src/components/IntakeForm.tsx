import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Languages, Stethoscope } from "lucide-react";

const STRINGS = {
  en: {
    appName: "PreCheck",
    tagline: "Pre-checkup health form",
    langLabel: "EN",
    steps: ["Basics", "Symptoms", "History", "Work", "Review"],
    stepBasics: {
      title: "Let's start with the basics",
      sub: "This information helps the clinic prepare for your visit.",
      fullName: "Full name",
      fullNamePh: "As shown on your residence card",
      dob: "Date of birth",
      nationality: "Nationality",
      nationalityPh: "e.g. Vietnam, Indonesia",
      phone: "Phone number",
      company: "Employer / accepting organization",
      companyPh: "Company name",
    },
    stepSymptoms: {
      title: "How are you feeling right now?",
      sub: "Select anything you're currently experiencing. It's okay to select none.",
      none: "No symptoms right now",
      list: ["Fever", "Cough", "Fatigue", "Headache", "Stomach pain", "Trouble sleeping", "Skin issues", "Joint or back pain"],
      notes: "Anything else you want the doctor to know?",
      notesPh: "Write in your own words, in any language",
    },
    stepHistory: {
      title: "Medical history",
      sub: "This stays confidential and is only shared with your care team.",
      conditions: "Do you have any ongoing medical conditions?",
      conditionsPh: "e.g. diabetes, high blood pressure, asthma",
      medications: "Are you currently taking any medications?",
      medicationsPh: "List medication names if known",
      allergies: "Do you have any allergies?",
      allergiesPh: "Medication, food, or other allergies",
      surgeries: "Have you had any surgeries in the past?",
      surgeriesPh: "Type and approximate year, if any",
    },
    stepWork: {
      title: "About your work",
      sub: "Used to check for job-related health risks.",
      jobType: "Type of work",
      jobTypePh: "e.g. food processing, construction, caregiving",
      hoursPerWeek: "Approximate hours per week",
      physicalDemand: "How physically demanding is your job?",
      demandLevels: ["Light", "Moderate", "Heavy"],
      exposures: "Are you regularly exposed to any of these at work?",
      exposureList: ["Loud noise", "Heavy lifting", "Chemicals", "Extreme heat/cold", "Standing all day"],
    },
    review: {
      title: "Review your answers",
      sub: "Please check everything looks right before submitting.",
      editHint: "Go back to edit any section",
      submit: "Submit form",
      submitted: "Form submitted",
      submittedSub: "Thank you. Your care coordinator will review this before your appointment.",
      newForm: "Start a new form",
    },
    nav: { back: "Back", next: "Next", noneEntered: "Not provided" },
  },
  zh: {
    appName: "PreCheck",
    tagline: "健康检查前问诊表",
    langLabel: "中文",
    steps: ["基本信息", "身体症状", "病史", "工作情况", "确认"],
    stepBasics: {
      title: "先填写基本信息",
      sub: "这些信息将帮助诊所为您的就诊做好准备。",
      fullName: "姓名",
      fullNamePh: "请与在留卡上的姓名一致",
      dob: "出生日期",
      nationality: "国籍",
      nationalityPh: "例如：越南、印度尼西亚",
      phone: "电话号码",
      company: "雇主 / 接收单位",
      companyPh: "公司名称",
    },
    stepSymptoms: {
      title: "您现在感觉怎么样？",
      sub: "请勾选您目前的症状，没有的话可以不选。",
      none: "目前没有症状",
      list: ["发烧", "咳嗽", "疲劳", "头痛", "胃痛", "睡眠不好", "皮肤问题", "关节或背部疼痛"],
      notes: "还有什么想告诉医生的吗？",
      notesPh: "可以用任何语言自由填写",
    },
    stepHistory: {
      title: "既往病史",
      sub: "此信息将严格保密，仅提供给您的医疗团队。",
      conditions: "您是否有持续性的疾病？",
      conditionsPh: "例如：糖尿病、高血压、哮喘",
      medications: "您目前是否在服用药物？",
      medicationsPh: "如知道，请列出药物名称",
      allergies: "您是否有过敏史？",
      allergiesPh: "药物、食物或其他过敏",
      surgeries: "您过去是否做过手术？",
      surgeriesPh: "手术类型及大致年份（如有）",
    },
    stepWork: {
      title: "关于您的工作",
      sub: "用于检查与工作相关的健康风险。",
      jobType: "工作类型",
      jobTypePh: "例如：食品加工、建筑、护理",
      hoursPerWeek: "每周大致工作时长",
      physicalDemand: "您的工作体力消耗程度如何？",
      demandLevels: ["轻松", "中等", "繁重"],
      exposures: "您在工作中是否经常接触以下情况？",
      exposureList: ["噪音", "重物搬运", "化学品", "极端高温/低温", "长时间站立"],
    },
    review: {
      title: "确认您的答案",
      sub: "提交前请检查所有内容是否正确。",
      editHint: "返回可修改任意部分",
      submit: "提交表格",
      submitted: "表格已提交",
      submittedSub: "谢谢。您的健康协调员将在预约前审核此信息。",
      newForm: "填写新表格",
    },
    nav: { back: "上一步", next: "下一步", noneEntered: "未填写" },
  },
};

const emptyForm = {
  fullName: "", dob: "", nationality: "", phone: "", company: "",
  symptoms: [], symptomNotes: "",
  conditions: "", medications: "", allergies: "", surgeries: "",
  jobType: "", hoursPerWeek: "", physicalDemand: "", exposures: [],
};

export default function IntakeForm() {
  const [lang, setLang] = useState("en");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const t = STRINGS[lang];

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
            {["en", "zh"].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium transition ${
                  lang === code ? "bg-white shadow-sm text-[#0F6E5E]" : "text-[#6B7684]"
                }`}
              >
                {code === lang && <Languages size={13} />}
                {STRINGS[code].langLabel}
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
                {lang === "en" ? `Step ${step + 1} of ${totalSteps}` : `第 ${step + 1} / ${totalSteps} 步`}
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