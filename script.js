// سيتم تفعيل وضع JS بعد التأكد من نجاح تهيئة الواجهة داخل DOMContentLoaded

// تعيين السنة الحالية في التذييل
function setCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// تبديل الوضع الليلي/النهاري
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// البحث في الصفحة والانتقال إلى القسم المناسب
function searchSite() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  const sections = document.querySelectorAll('main .section');
  let found = false;
  sections.forEach(section => {
    section.classList.remove('highlight');
    if (term && section.textContent.toLowerCase().includes(term)) {
      if (!found) {
        section.scrollIntoView({ behavior: 'smooth' });
        found = true;
      }
      section.classList.add('highlight');
    }
  });
}

// تحويل نص إلى صوت باستخدام Web Speech API
function speakText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.textContent;
  const utterance = new SpeechSynthesisUtterance(text);
  // تعيين اللغة العربية كلغة للنطق
  utterance.lang = 'ar-SA';
  window.speechSynthesis.speak(utterance);
}

// ترجمة النص إلى الإنجليزية باستخدام خدمة ترجمة مجانية (MyMemory)
async function translateText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.textContent;
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|en`);
    const data = await response.json();
    const translation = data.responseData.translatedText;
    alert('Translation:\n' + translation);
  } catch (error) {
    alert('حدث خطأ أثناء الترجمة.');
  }
}

// تلخيص النص (حل بسيط استنادًا إلى عدد الكلمات)
function summarizeText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.textContent;
  const words = text.split(/\s+/);
  const summary = words.slice(0, 30).join(' ') + (words.length > 30 ? ' ...' : '');
  alert('ملخص:\n' + summary);
}

// إرسال البريد الإلكتروني عبر mailto
function sendEmail(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const subject = encodeURIComponent('Portfolio Contact from ' + name);
  const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
  window.location.href = `mailto:abdurhmnasiri31@gmail.com?subject=${subject}&body=${body}`;
  return false;
}

/* =====================
 * بيانات القضايا وميزات لوحة الحوادث
 * كل كائن يمثل ملف قضية يتضمن أعراضًا، خطوات إعادة الإنتاج، السبب الجذري، الحل، التأثير، وإجراءات الوقاية.
 * الحالة (status) تقسم القضايا إلى أعمدة مختلفة.
 */
const casesData = [
  // ========== Pulse Support (Application Support / Incidents) ==========
  {
    id: 'case01',
    track: 'pulse_support',
    title: 'انقطاع مسار الحجز (Booking Flow Outage)',
    title_en: 'Booking Flow Outage',
    status: 'Investigating',
    summary: 'تعطل إنشاء الحجوزات مع أخطاء 500/Timeout ضمن رحلة المستخدم.',
    summary_en: 'Booking creation fails with 500/timeout errors across the user journey.',
    symptoms: 'فشل إنشاء الحجز لدى المستخدمين وظهور أخطاء 500 أو انتهاء مهلة عند التأكيد.',
    symptoms_en: 'Users cannot create bookings; 500 errors or timeouts appear during confirmation.',
    repro: 'Create booking → confirm → observe failure at payment/confirmation; check server logs for timeouts.',
    repro_en: 'Create booking → confirm → failure at payment/confirmation; inspect server logs for timeouts.',
    cause: 'تعارض بعد تحديث قاعدة البيانات أدى لكسر استعلامات الحجز أو زيادة زمن الاستعلام.',
    cause_en: 'Post-DB update conflict broke booking queries or increased query latency.',
    fix: 'Rollback للتحديث + تعطيل feature flag مؤقتًا + إعادة بناء index/تحسين الاستعلامات.',
    fix_en: 'Rollback update + temporarily disable feature flag + rebuild index/optimize queries.',
    impact: 'تعطل الحجوزات (تأثير عالي على المستخدمين والإيرادات/العمليات).',
    impact_en: 'Bookings blocked (high user and revenue/operations impact).',
    prevention: 'اختبارات تكامل قبل النشر + canary release + مراقبة DB latency/locks.',
    prevention_en: 'Pre-release integration tests + canary releases + DB latency/lock monitoring.'
  },
  {
    id: 'case02',
    track: 'pulse_support',
    title: 'حلقة تسجيل الدخول (Login Redirect Loop)',
    title_en: 'Login Redirect Loop',
    status: 'Resolved',
    summary: 'تسجيل الدخول ينجح ثم يعيد المستخدم لشاشة الدخول بسبب جلسة/Token.',
    summary_en: 'Login succeeds then redirects back to login due to session/token mismatch.',
    symptoms: 'المستخدم يسجل الدخول ثم يعود مباشرة لصفحة تسجيل الدخول (loop).',
    symptoms_en: 'User logs in successfully but gets redirected back to login (loop).',
    repro: 'Sign in → home loads briefly → redirected to login; compare cookie/token expiration values.',
    repro_en: 'Sign in → home loads briefly → redirected to login; compare cookie/token expiration values.',
    cause: 'عدم توافق سياسة إصدار/تحديث token بعد تغيير في آلية الجلسات أو cache قديم.',
    cause_en: 'Token refresh policy mismatch after session mechanism change or stale cache.',
    fix: 'تحديث refresh-token flow + إبطال sessions القديمة + hotfix لتزامن expiration.',
    fix_en: 'Update refresh-token flow + invalidate old sessions + hotfix expiration sync.',
    impact: 'حجب الوصول للتطبيق لشريحة من المستخدمين (مؤثر على الخدمة).',
    impact_en: 'Users blocked from accessing the app (service disruption).',
    prevention: 'Regression tests لرحلة auth + مراقبة معدلات فشل الدخول + canary على auth changes.',
    prevention_en: 'Auth journey regression tests + monitor login failures + canary auth changes.'
  },
  {
    id: 'case03',
    track: 'pulse_support',
    title: 'فشل مزامنة نظام البصمة (Attendance Sync Failure)',
    title_en: 'Attendance Sync Failure (Biometric)',
    status: 'Investigating',
    summary: 'الجهاز يسجل لكن النظام لا يعكس الحضور بسبب تكامل متوقف أو Queue.',
    summary_en: 'Device captures logs but system doesn’t reflect attendance due to integration/queue issues.',
    symptoms: 'تسجيل البصمة يتم على الجهاز لكن السجل لا يظهر في النظام.',
    symptoms_en: 'Biometric scan succeeds on device, but entry doesn’t appear in the system.',
    repro: 'Scan user → verify device log exists → check integration service logs/queue lag for missing messages.',
    repro_en: 'Scan user → confirm device log → check integration logs/queue lag for missing messages.',
    cause: 'توقف خدمة التكامل أو credential غير صالح أو backlog في queue.',
    cause_en: 'Integration service down, invalid credentials, or queue backlog.',
    fix: 'Restart integration service + rotate credentials + reprocess queue messages.',
    fix_en: 'Restart integration service + rotate credentials + reprocess queued messages.',
    impact: 'بيانات حضور غير دقيقة تؤثر على HR والعمليات.',
    impact_en: 'Inaccurate attendance impacting HR and operations.',
    prevention: 'Health checks + alerts للـqueue lag + runbook واضح + monitor integration SLA.',
    prevention_en: 'Health checks + queue lag alerts + clear runbook + monitor integration SLA.'
  },

  // ========== SLA Command (Incident Management / Triage) ==========
  {
    id: 'case04',
    track: 'sla_command',
    title: 'تصنيف أولوية غير صحيح (Severity Misclassification)',
    title_en: 'Severity Misclassification',
    status: 'Prevented',
    summary: 'حوادث عالية التأثير تُصنَّف Low بسبب غياب معايير Severity واضحة.',
    summary_en: 'High-impact incidents were labeled as low due to unclear severity criteria.',
    symptoms: 'تأخر الاستجابة لحادثة مؤثرة لأن التذكرة تم تصنيفها أولوية منخفضة.',
    symptoms_en: 'Response was delayed because an impactful incident was tagged as low priority.',
    repro: 'Create incident ticket with business impact → observe inconsistent priority selection among agents.',
    repro_en: 'Create incident ticket with business impact → see inconsistent priority selection across agents.',
    cause: 'عدم وجود مصفوفة Severity/SLA موحدة + غياب حقول إلزامية للـimpact.',
    cause_en: 'No unified severity/SLA matrix and missing required impact fields.',
    fix: 'بناء Severity Matrix + حقول impact إلزامية + auto-suggest severity داخل نموذج التذكرة.',
    fix_en: 'Implement severity matrix + required impact fields + auto-suggest severity in ticket form.',
    impact: 'تدهور تجربة المستخدم وزيادة downtime بسبب تأخر التصعيد.',
    impact_en: 'User experience degraded and downtime increased due to delayed escalation.',
    prevention: 'تدريب الفريق + مراجعة أسبوعية للحوادث + dashboard لمعدل الالتزام بـSLA.',
    prevention_en: 'Team training + weekly incident reviews + SLA compliance dashboard.'
  },
  {
    id: 'case05',
    track: 'sla_command',
    title: 'غياب تحديثات المستخدم (No Status Updates)',
    title_en: 'Lack of Status Updates',
    status: 'Resolved',
    summary: 'المستخدم يفتح تذاكر متابعة لأن التذكرة تبقى Investigating دون تحديثات.',
    summary_en: 'Users open follow-up tickets when issues stay investigating without updates.',
    symptoms: 'زيادة رسائل المتابعة وشكاوى “لا يوجد تحديث”.',
    symptoms_en: 'Increase in pings and complaints: “no updates provided”.',
    repro: 'Ticket stays investigating >24h → user submits multiple follow-ups.',
    repro_en: 'Ticket stays investigating >24h → user submits multiple follow-ups.',
    cause: 'لا توجد سياسة تحديثات دورية أو قوالب تواصل.',
    cause_en: 'No communication cadence or standardized templates.',
    fix: 'Auto-update cadence كل X ساعات + ETA + قوالب جاهزة للرسائل.',
    fix_en: 'Automated update cadence every X hours + ETA + standard message templates.',
    impact: 'ارتفاع الحمل على الدعم وتراجع الرضا.',
    impact_en: 'Higher support load and reduced satisfaction.',
    prevention: 'Update-SLA metrics + ownership واضح + runbook للتواصل أثناء الحوادث.',
    prevention_en: 'Update-SLA metrics + clear ownership + incident comms runbook.'
  },
  {
    id: 'case06',
    track: 'enablement_studio',
    title: 'ارتفاع تذاكر الإرشاد بعد إطلاق ميزة',
    title_en: 'Post-Release How-to Ticket Spike',
    status: 'Resolved',
    summary: 'زيادة “كيف أستخدم” بعد إصدار جديد بسبب غياب onboarding واضح.',
    summary_en: 'A surge of “how-to” tickets after release due to missing onboarding.',
    symptoms: 'ارتفاع تذاكر “كيف أستخدم” خلال 48 ساعة بعد إطلاق ميزة.',
    symptoms_en: 'A spike in “how do I” tickets within 48 hours after a feature launch.',
    repro: 'Release new feature → monitor ticket categories → observe repeated user confusion points.',
    repro_en: 'Release new feature → monitor ticket categories → observe repeated confusion points.',
    cause: 'غياب Quick Start/FAQ داخل التطبيق وrelease notes غير موجهة للمستخدم.',
    cause_en: 'No quick-start/FAQ in-app and release notes not user-oriented.',
    fix: 'Quick Start + فيديو قصير + FAQ داخل التطبيق + خطوات مصورة في KB.',
    fix_en: 'Quick start + short walkthrough video + in-app FAQ + illustrated KB steps.',
    impact: 'ضغط على الدعم وانخفاض الرضا وتأخر الحل للحالات الأهم.',
    impact_en: 'Support overload, lower satisfaction, and slower handling of critical issues.',
    prevention: 'Enablement plan لكل إصدار + قياس adoption + تحديث الإرشادات بناءً على analytics.',
    prevention_en: 'Enablement plan per release + adoption metrics + iterate guidance using analytics.'
  },

  // ========== Automation Forge (Internal Tools / Self-service) ==========
  {
    id: 'case07',
    track: 'automation_forge',
    title: 'توجيه تلقائي للتذاكر (Auto-Routing)',
    title_en: 'Auto-Routing for Tickets',
    status: 'Resolved',
    summary: 'تحويل التوجيه اليدوي إلى قواعد تصنيف لتقليل زمن الاستجابة.',
    summary_en: 'Replaced manual routing with classification rules to reduce response time.',
    symptoms: 'تذاكر تُسند يدويًا وتتأخر بسبب تضارب المسؤوليات.',
    symptoms_en: 'Tickets are routed manually and delayed due to ownership confusion.',
    repro: 'Submit same category tickets → observe inconsistent assignees and priority selection.',
    repro_en: 'Submit same category tickets → see inconsistent assignees and priority selection.',
    cause: 'لا توجد قواعد تصنيف/توجيه + حقول ناقصة داخل النموذج.',
    cause_en: 'No routing rules and missing required form fields.',
    fix: 'Rule-based routing + required fields + standardized tags.',
    fix_en: 'Rule-based routing + required fields + standardized tags.',
    impact: 'تقليل زمن الاستجابة وتحسن توزيع العمل.',
    impact_en: 'Improved response time and workload distribution.',
    prevention: 'مراجعة شهرية للقواعد + dashboard لمعدل mis-route.',
    prevention_en: 'Monthly rule reviews + mis-route rate dashboard.'
  },
  {
    id: 'case08',
    track: 'automation_forge',
    title: 'اقتراح مقالات Self‑Service داخل النموذج',
    title_en: 'Self-Service Suggestions in Ticket Form',
    status: 'Prevented',
    summary: 'خفض التذاكر المتكررة بإظهار KB مقترحة أثناء إنشاء التذكرة.',
    summary_en: 'Reduced repeat tickets by suggesting KB articles during ticket creation.',
    symptoms: 'تكرار أسئلة “How-to” وزيادة تذاكر منخفضة التعقيد.',
    symptoms_en: 'Repeated “how-to” questions and low-complexity tickets.',
    repro: 'Open ticket form for common issue → no article suggestions appear.',
    repro_en: 'Open ticket form for common issue → no suggestions appear.',
    cause: 'KB غير مرتبطة بالنموذج ولا يوجد search trigger.',
    cause_en: 'KB not linked to the form; no search trigger.',
    fix: 'Auto-search based on category/keywords + top 3 suggested articles.',
    fix_en: 'Auto-search by category/keywords + show top 3 suggested articles.',
    impact: 'تقليل الحمل على الدعم وتحسن سرعة حل المستخدم ذاتيًا.',
    impact_en: 'Lower support load and faster self-resolution.',
    prevention: 'مراجعة أسبوعية لأكثر الاستفسارات + تحسين keywords وربطها بالمقالات.',
    prevention_en: 'Weekly review of top queries + improve keywords and article mapping.'
  },
  {
    id: 'case09',
    track: 'automation_forge',
    title: 'تحديثات حالة تلقائية للمستخدم (Auto Status Updates)',
    title_en: 'Automated Status Updates',
    status: 'Resolved',
    summary: 'تقليل تذاكر المتابعة بإشعارات دورية أثناء التحقيق.',
    summary_en: 'Reduced follow-ups via scheduled updates during investigation.',
    symptoms: 'مستخدمون يفتحون تذاكر متابعة بسبب عدم وجود تحديثات.',
    symptoms_en: 'Users open follow-up tickets due to missing updates.',
    repro: 'Ticket stays Investigating > X hours → user pings repeatedly.',
    repro_en: 'Ticket stays Investigating > X hours → user pings repeatedly.',
    cause: 'غياب cadence للتواصل أثناء التحقيق.',
    cause_en: 'Missing comms cadence during investigation.',
    fix: 'Scheduled updates with ETA + “What we’re doing now” template.',
    fix_en: 'Scheduled updates with ETA + “What we’re doing now” template.',
    impact: 'خفض الإزعاج وزيادة الثقة وتقليل back-and-forth.',
    impact_en: 'Less noise, higher trust, fewer back-and-forth messages.',
    prevention: 'Update-SLA + ownership + مراجعة شهرية لنصوص القوالب.',
    prevention_en: 'Update-SLA + ownership + monthly template review.'
  },

  // ========== Knowledge Vault (KB / Documentation) ==========
  {
    id: 'case10',
    track: 'knowledge_vault',
    title: 'إعادة بناء هيكلة KB (Information Architecture)',
    title_en: 'KB Information Architecture Rebuild',
    status: 'Resolved',
    summary: 'تحسين العثور على المقالات عبر Taxonomy وقوالب وعناوين معيارية.',
    summary_en: 'Improved article findability via taxonomy, templates, and consistent titles.',
    symptoms: 'صعوبة العثور على المقالة الصحيحة وارتفاع زمن الحل.',
    symptoms_en: 'Hard to find correct articles; increased time-to-resolution.',
    repro: 'Search common topic → irrelevant/duplicate results; measure clicks to find answer.',
    repro_en: 'Search common topic → irrelevant/duplicate results; measure clicks to find answer.',
    cause: 'تصنيفات ضعيفة + غياب قوالب + عناوين غير موحدة.',
    cause_en: 'Poor taxonomy, no templates, inconsistent titles.',
    fix: 'Taxonomy + template DoD + canonical naming conventions.',
    fix_en: 'Taxonomy + template DoD + canonical naming conventions.',
    impact: 'تقليل التذاكر المتكررة وتحسن self-service.',
    impact_en: 'Fewer repeat tickets and improved self-service.',
    prevention: 'حوكمة KB + مراجعة ربع سنوية + owner لكل مجال.',
    prevention_en: 'KB governance + quarterly reviews + domain owners.'
  },
  {
    id: 'case11',
    track: 'implementation_dock',
    title: 'خلل صلاحيات الدور (Role/Access Misconfiguration)',
    title_en: 'Role/Access Misconfiguration',
    status: 'Incoming',
    summary: 'مستخدمون لا يرون ميزات بسبب إعداد دور غير صحيح بعد التفعيل.',
    summary_en: 'Users can’t access features due to role misconfiguration after activation.',
    symptoms: 'مستخدم جديد لا يرى قائمة/ميزة لازمة لدوره.',
    symptoms_en: 'New user cannot see required menu/feature for their role.',
    repro: 'Provision user → login → compare permissions vs role matrix → observe missing scopes.',
    repro_en: 'Provision user → login → compare permissions vs role matrix → observe missing scopes.',
    cause: 'مصفوفة صلاحيات غير موحدة أو إعداد دور خاطئ في النظام.',
    cause_en: 'Unstandardized access matrix or wrong role configuration.',
    fix: 'Role matrix + onboarding templates + audit role config + corrective update.',
    fix_en: 'Role matrix + onboarding templates + audit config + corrective update.',
    impact: 'تعطّل فرق عن أداء عملها وزيادة تذاكر “الميزة غير موجودة”.',
    impact_en: 'Teams blocked; increased “feature missing” tickets.',
    prevention: 'Pre-go-live access tests + change log للأدوار + مراجعة دورية.',
    prevention_en: 'Pre-go-live access tests + role change log + periodic reviews.'
  },
  {
    id: 'case12',
    track: 'quality_sentinel',
    title: 'عطل انحدار بعد تغيير بسيط (Regression)',
    title_en: 'Regression After Minor Change',
    status: 'Prevented',
    summary: 'ميزة كانت تعمل تعطلت بعد release بسبب غياب smoke/regression checklist.',
    summary_en: 'A working feature broke after release due to missing smoke/regression checklist.',
    symptoms: 'فشل سيناريو baseline بعد نشر تحديث بسيط.',
    symptoms_en: 'Baseline scenario fails after a small release.',
    repro: 'Run baseline flow pre/post release → observe failure; compare impacted components.',
    repro_en: 'Run baseline flow pre/post release → observe failure; compare impacted components.',
    cause: 'نقص تغطية الاختبارات وعدم ربط التغيير بـchecklist رجعي.',
    cause_en: 'Insufficient coverage and no regression checklist tied to the change.',
    fix: 'Regression checklist + smoke tests + test notes + link to change scope.',
    fix_en: 'Regression checklist + smoke tests + test notes + link to change scope.',
    impact: 'ارتفاع التذاكر وتراجع الثقة وزيادة وقت التحقيق.',
    impact_en: 'Higher ticket volume, reduced trust, longer investigation time.',
    prevention: 'UAT + pre-release smoke + clear rollback path + severity definitions.',
    prevention_en: 'UAT + pre-release smoke + clear rollback path + severity definitions.'
  }
];

/* =====================
 * قاموس الترجمة للواجهة بين العربية والإنجليزية
 */
const i18n = {
  ar: {
    profile_tagline: 'مهندس دعم التطبيقات | أدوات داخلية وأتمتة | مطور برمجيات',
    profile_summary: 'متخصص دعم التطبيقات بخبرة تزيد عن خمس سنوات في دعم الأنظمة التشغيلية في بيئات حكومية وخاصة. ماهر في استكشاف المشكلات وتحليل رحلة المستخدم وإعداد تقارير فنية جاهزة للمطورين، بارع في حل المشكلات المعقدة والعمل في بيئات ديناميكية وتقديم نتائج عالية الجودة تحت الضغط. ملتزم بالتعلم المستمر وتحسين جودة الدعم وتجربة المستخدم.',
    primary_btn: 'عرض السيرة الذاتية',
    secondary_btn: 'تواصل معي',
    stats_title: 'الإحصائيات والمهارات',
    stats_labels: ['سنوات الخبرة', 'مشاريع مكتملة', 'تذاكر دعم محلولة'],
    cases_title: 'لوحة القضايا (Incident Board)',
    contact_title: 'تواصل معي',
    contact_text: 'يسعدني تواصلك عبر المنصات التالية:',
    interview_btn: 'وضع المقابلة',
    case_interview_btn: 'أسئلة عن هذه القضية',
    interview_back_btn: 'العودة لمسار المقابلة',
    search_placeholder: 'بحث عن قضية...'
  },
  en: {
    profile_tagline: 'Application Support Engineer | Internal Tools & Automation | Software Developer',
    profile_summary: 'Application support specialist with over five years of experience supporting operational systems in both government and private environments. Skilled in troubleshooting, user journey analysis, and preparing technical reports for developers. Adept at solving complex issues and working in dynamic environments while delivering high-quality results under pressure. Committed to continuous learning and improving support quality and user experience.',
    primary_btn: 'View CV',
    secondary_btn: 'Contact Me',
    stats_title: 'Statistics & Skills',
    stats_labels: ['Years of Experience', 'Completed Projects', 'Resolved Tickets'],
    cases_title: 'Incident Board',
    contact_title: 'Contact Me',
    contact_text: 'Feel free to reach out via the following platforms:',
    interview_btn: 'Interview Mode',
    case_interview_btn: 'Case Interview',
    interview_back_btn: 'Back to Track',
    search_placeholder: 'Search cases...'
  }
};

/* =====================
 * تعريف الثيمات الخاصة بكل تخصص
 * يمكن إضافة المزيد من الثيمات بسهولة. يتم استخدام خصائص primary و secondary و accent لتغيير ألوان المتغيرات في CSS.
 */
const themes = {
  // 1) Application Support
  pulse_support: {
    primary: '#070A12',
    secondary: '#101B2C',
    accent: '#3DA9FC'
  },
  // 2) Incident Management & Triage
  sla_command: {
    primary: '#0A0A0F',
    secondary: '#1A1027',
    accent: '#BF40BF'
  },
  // 3) Automation & Internal Tools
  automation_forge: {
    primary: '#07120E',
    secondary: '#0F2A20',
    accent: '#2EE59D'
  },
  // 4) Knowledge Base & Documentation
  knowledge_vault: {
    primary: '#0C0B12',
    secondary: '#1B1630',
    accent: '#BFA3FF'
  },
  // 5) User Enablement
  enablement_studio: {
    primary: '#0B1114',
    secondary: '#13232A',
    accent: '#FFC857'
  },
  // 6) Implementation Support
  implementation_dock: {
    primary: '#0A1018',
    secondary: '#101F33',
    accent: '#9BB7FF'
  },
  // 7) Quality / Regression
  quality_sentinel: {
    primary: '#0B0F0E',
    secondary: '#10211C',
    accent: '#FF6B6B'
  },
  default: {
    primary: '#000000',
    secondary: '#2D1B4E',
    accent: '#BF40BF'
  }
};

// معلومات المسارات (Tracks) للاستخدام في الـUI والـtooltip والـInterview
const trackInfo = {
  pulse_support: { en: 'Pulse Support', ar: 'دعم التطبيقات' },
  sla_command: { en: 'SLA Command', ar: 'إدارة الحوادث والأولويات' },
  automation_forge: { en: 'Automation Forge', ar: 'الأتمتة والأدوات الداخلية' },
  knowledge_vault: { en: 'Knowledge Vault', ar: 'قاعدة المعرفة والتوثيق' },
  enablement_studio: { en: 'Enablement Studio', ar: 'تمكين المستخدم' },
  implementation_dock: { en: 'Implementation Dock', ar: 'الدعم أثناء التطبيق والتهيئة' },
  quality_sentinel: { en: 'Quality Sentinel', ar: 'الاختبار والانحدار والجودة' }
};

// وظيفة تبديل الثيم: تغير متغيرات الألوان في :root وتحديث meta theme-color + حفظ الثيم
function switchTheme(themeName, opts = {}) {
  const theme = themes[themeName] || themes.default;
  const root = document.documentElement;

  // استخراج RGB من لون الأكسنت لاستخدامه في توهج الأيقونات والحدود والسبوتلايت
  const accentRgb = hexToRgbTriplet(theme.accent);
  root.style.setProperty('--accent-rgb', accentRgb);

  // تجهيز طبقة الانتقال (إن وُجدت)
  const overlay = document.getElementById('themeOverlay');
  if (overlay) {
    // تحديد نقطة الانطلاق حسب النقر (أو مركز الشاشة)
    const x = typeof opts.x === 'number' ? opts.x : Math.round(window.innerWidth * 0.5);
    const y = typeof opts.y === 'number' ? opts.y : Math.round(window.innerHeight * 0.22);
    root.style.setProperty('--overlay-x', `${x}px`);
    root.style.setProperty('--overlay-y', `${y}px`);
    // نستخدم لون الأكسنت كتأثير انتقال (بصيغة rgb الحديثة لانسجام أدق)
    root.style.setProperty('--overlay-color', `rgb(${accentRgb} / 0.28)`);
    overlay.classList.remove('is-animating');
    // إعادة تشغيل الأنيميشن بشكل مضمون
    void overlay.offsetWidth;
    overlay.classList.add('is-animating');
  }

  // تطبيق الألوان
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent', theme.accent);

  // تحديث لون شريط المتصفح في الأجهزة الذكية
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme.primary);
  }

  // حفظ الثيم لفتحه لاحقًا
  try {
    localStorage.setItem('selectedTheme', themeName);
  } catch (e) {
    // تجاهل أي خطأ (مثلاً وضع التصفح الخاص)
  }
}

// ضبط Track الحالي + تطبيق الثيم + تحديث الـUI المرتبط (Case Board + Interview)
function setTrack(trackName, opts = {}) {
  currentTrack = themes[trackName] ? trackName : 'pulse_support';
  switchTheme(currentTrack, opts);
  applyTrackFilter();

  // إذا كان وضع المقابلة مفتوحًا، حدّث الأسئلة وفق المسار
  const interviewModal = document.getElementById('interview-modal');
  if (interviewModal && !interviewModal.classList.contains('hidden')) {
    renderInterviewModal();
  }
}

// تحويل HEX إلى RGBA
function hexToRgba(hex, alpha) {
  const cleanHex = (hex || '').replace('#', '').trim();
  if (cleanHex.length !== 6) return `rgba(191, 64, 191, ${alpha})`;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// تحويل HEX إلى ثلاثية RGB بصيغة "R G B" لاستخدامها داخل CSS rgb(var(--accent-rgb) / a)
function hexToRgbTriplet(hex) {
  const cleanHex = (hex || '').replace('#', '').trim();
  if (cleanHex.length !== 6) return '191 64 191';
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

// استرجاع الثيم المحفوظ (إن وجد)
function applySavedTheme() {
  try {
    const saved = localStorage.getItem('selectedTheme');
    if (saved && themes[saved]) {
      currentTrack = saved;
      switchTheme(saved);
      applyTrackFilter();
      // تمييز الشريحة المناسبة
      const chip = document.querySelector(`.skills-chips .chip[data-theme="${saved}"]`);
      if (chip) {
        document.querySelectorAll('.skills-chips .chip').forEach(c => c.classList.remove('chip-selected'));
        chip.classList.add('chip-selected');
      }
    } else {
      // تطبيق الافتراضي مع تمييزه
      currentTrack = 'pulse_support';
      switchTheme(currentTrack);
      applyTrackFilter();
      const defChip = document.querySelector(`.skills-chips .chip[data-theme="${currentTrack}"]`);
      if (defChip) {
        document.querySelectorAll('.skills-chips .chip').forEach(c => c.classList.remove('chip-selected'));
        defChip.classList.add('chip-selected');
      }
    }
  } catch (e) {
    // ignore
  }
}

// اللغة الحالية (الافتراضية العربية)
let currentLang = 'ar';

// المسار الحالي (الثيم) - افتراضيًا دعم التطبيقات
let currentTrack = 'pulse_support';

// سياق المقابلة: إما Track عام أو Case محددة
let interviewContext = { mode: 'track', track: currentTrack, caseObj: null };
let lastOpenedCase = null;
let lastGeneratedTicket = null;

// تطبيق الترجمة على واجهة الصفحة
function applyTranslations() {
  // تحديث النصوص في قسم الملف التعريفي
  const taglineEl = document.querySelector('.profile-section .tagline');
  if (taglineEl) taglineEl.textContent = i18n[currentLang].profile_tagline;
  const summaryEl = document.querySelector('.profile-section .summary');
  if (summaryEl) summaryEl.textContent = i18n[currentLang].profile_summary;
  // تحديث أزرار الملف التعريفي
  const primaryBtn = document.querySelector('.profile-actions .primary-btn');
  if (primaryBtn) primaryBtn.textContent = i18n[currentLang].primary_btn;
  const secondaryBtn = document.querySelector('.profile-actions .secondary-btn');
  if (secondaryBtn) secondaryBtn.textContent = i18n[currentLang].secondary_btn;
  // تحديث عناوين الأقسام
  const statsTitle = document.getElementById('statsTitle');
  if (statsTitle) statsTitle.textContent = i18n[currentLang].stats_title;
  const casesTitle = document.getElementById('casesTitle');
  if (casesTitle) casesTitle.textContent = i18n[currentLang].cases_title;
  const contactTitle = document.getElementById('contactTitle');
  if (contactTitle) contactTitle.textContent = i18n[currentLang].contact_title;
  const contactText = document.getElementById('contactText');
  if (contactText) contactText.textContent = i18n[currentLang].contact_text;
  // تحديث تسمية زر وضع المقابلة
  const interviewBtn = document.getElementById('interviewModeBtn');
  if (interviewBtn) interviewBtn.textContent = i18n[currentLang].interview_btn;
  // زر أسئلة القضية
  const caseInterviewBtn = document.getElementById('caseToInterviewBtn');
  if (caseInterviewBtn) caseInterviewBtn.textContent = i18n[currentLang].case_interview_btn;
  // زر العودة لمسار المقابلة
  const interviewBackBtn = document.getElementById('interviewBackBtn');
  if (interviewBackBtn) interviewBackBtn.textContent = i18n[currentLang].interview_back_btn;

  // تحديث placeholder لبحث القضايا
  const searchInput = document.getElementById('caseSearchInput');
  if (searchInput) searchInput.placeholder = i18n[currentLang].search_placeholder;
  // تحديث ملصقات الإحصائيات
  const statLabels = document.querySelectorAll('.stat-label');
  statLabels.forEach((label, idx) => {
    if (i18n[currentLang].stats_labels[idx]) {
      label.textContent = i18n[currentLang].stats_labels[idx];
    }
  });
  // تحديث زر تبديل اللغة
  const langToggleBtn = document.getElementById('langToggle');
  if (langToggleBtn) langToggleBtn.textContent = currentLang === 'ar' ? 'EN' : 'AR';

  // تحديث تلميحات Tracks (تبقى النصوص بالإنجليزية داخل الـUI)
  const trackChips = document.querySelectorAll('#tracksChips .chip');
  trackChips.forEach(chip => {
    const key = chip.getAttribute('data-theme');
    if (key && trackInfo[key]) {
      chip.setAttribute('title', trackInfo[key].ar);
    }
  });

  // تحديث Badge وضع المقابلة
  const badge = document.getElementById('interviewTrackBadge');
  if (badge && trackInfo[currentTrack]) {
    badge.textContent = trackInfo[currentTrack].en;
    badge.setAttribute('title', trackInfo[currentTrack].ar);
  }
  // تغيير اتجاه الصفحة
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  // إذا كانت هناك تذكرة مولدة، أعد تحديث النصوص/الشارة
  if (lastGeneratedTicket) {
    renderTicketPanel(lastGeneratedTicket);
  }
}

// تبديل اللغة بين العربية والإنجليزية
function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  applyTranslations();
  renderCaseBoard();
  renderInterviewModal();
  searchCases();
}

// ترجمة حالة القضية إلى العربية لعرضها في الواجهة
function translateStatus(status) {
  // ترجمة حالة القضية اعتمادًا على اللغة الحالية
  if (currentLang === 'ar') {
    switch (status) {
      case 'Incoming':
        return 'الواردة';
      case 'Investigating':
        return 'قيد التحقيق';
      case 'Resolved':
        return 'تم الحل';
      case 'Prevented':
        return 'تم الوقاية';
      default:
        return status;
    }
  } else {
    // اللغة الإنجليزية تستخدم نفس المصطلحات الأصلية
    switch (status) {
      case 'Incoming':
        return 'Incoming';
      case 'Investigating':
        return 'Investigating';
      case 'Resolved':
        return 'Resolved';
      case 'Prevented':
        return 'Prevented';
      default:
        return status;
    }
  }
}

// إنشاء لوحة القضايا بناءً على البيانات أعلاه
function renderCaseBoard() {
  const board = document.getElementById('case-board');
  if (!board) return;
  board.innerHTML = '';
  const statuses = [
    { key: 'Incoming', label_ar: 'القضايا الواردة', label_en: 'Incoming' },
    { key: 'Investigating', label_ar: 'قيد التحقيق', label_en: 'Investigating' },
    { key: 'Resolved', label_ar: 'تم الحل', label_en: 'Resolved' },
    { key: 'Prevented', label_ar: 'تم الوقاية', label_en: 'Prevented' }
  ];
  statuses.forEach(statusObj => {
    const col = document.createElement('div');
    col.className = 'case-column';
    const heading = document.createElement('h3');
    heading.textContent = currentLang === 'ar' ? statusObj.label_ar : statusObj.label_en;
    col.appendChild(heading);
    // استخراج القضايا حسب الحالة
    const filtered = casesData.filter(c => c.status === statusObj.key);
    filtered.forEach(c => {
      const card = document.createElement('div');
      card.className = 'case-card';
      card.setAttribute('data-id', c.id);
      card.setAttribute('data-track', c.track || 'pulse_support');
      // اختيار عنوان وملخص حسب اللغة الحالية
      const titleText = currentLang === 'ar' ? c.title : c.title_en;
      const summaryText = currentLang === 'ar' ? c.summary : c.summary_en;
      card.innerHTML = `<h4>${titleText}</h4><p>${summaryText}</p>`;
      card.addEventListener('click', () => showCaseModal(c));
      col.appendChild(card);
    });
    board.appendChild(col);
  });

  // بعد إعادة البناء: طبّق فلترة/تمييز Track الحالي + ابقِ البحث متناسقًا
  applyTrackFilter();
}

// تمييز القضايا حسب Track الحالي: إبراز المطابق وتخفيف غير المطابق
function applyTrackFilter() {
  const cards = document.querySelectorAll('.case-card');
  cards.forEach(card => {
    const t = card.getAttribute('data-track');
    const isMatch = t === currentTrack;
    card.classList.toggle('track-focus', isMatch);
    card.classList.toggle('track-dim', !isMatch);
  });

  // تحديث Badge وضع المقابلة
  const badge = document.getElementById('interviewTrackBadge');
  if (badge && trackInfo[currentTrack]) {
    badge.textContent = trackInfo[currentTrack].en;
    badge.setAttribute('title', trackInfo[currentTrack].ar);
  }
}

// عرض تفاصيل القضية في نافذة منفصلة
function showCaseModal(caseObj) {
  lastOpenedCase = caseObj;

  const modal = document.getElementById('case-modal');
  const body = document.getElementById('case-modal-body');
  if (!modal || !body) return;

  // Reset ticket UI for new case
  clearTicketPanel();
  const genBtn = document.getElementById('generateTicketBtn');
  if (genBtn) genBtn.disabled = false;

  const caseInterviewBtn = document.getElementById('caseToInterviewBtn');
  if (caseInterviewBtn) {
    caseInterviewBtn.disabled = false;
    caseInterviewBtn.onclick = () => {
      if (!lastOpenedCase) return;
      interviewContext = { mode: 'case', track: lastOpenedCase.track || currentTrack, caseObj: lastOpenedCase };
      hideCaseModal();
      showInterviewModal();
    };
  }

  // تحديد النصوص المناسبة لكل لغة
  const title = currentLang === 'ar' ? caseObj.title : caseObj.title_en;
  const symptoms = currentLang === 'ar' ? caseObj.symptoms : caseObj.symptoms_en;
  const repro = currentLang === 'ar' ? caseObj.repro : caseObj.repro_en;
  const cause = currentLang === 'ar' ? caseObj.cause : caseObj.cause_en;
  const fix = currentLang === 'ar' ? caseObj.fix : caseObj.fix_en;
  const impact = currentLang === 'ar' ? caseObj.impact : caseObj.impact_en;
  const prevention = currentLang === 'ar' ? caseObj.prevention : caseObj.prevention_en;
  // تسميات الحقول اعتمادًا على اللغة
  const labels = {
    ar: {
      status: 'الحالة',
      symptoms: 'الأعراض',
      repro: 'خطوات إعادة الإنتاج',
      cause: 'السبب الجذري',
      fix: 'الحل / المعالجة',
      impact: 'التأثير',
      prevention: 'إجراءات وقائية'
    },
    en: {
      status: 'Status',
      symptoms: 'Symptoms',
      repro: 'Reproduction Steps',
      cause: 'Root Cause',
      fix: 'Fix / Workaround',
      impact: 'Impact',
      prevention: 'Preventive Actions'
    }
  };
  body.innerHTML = `
    <h3>${title}</h3>
    <p><strong>${currentLang === 'ar' ? 'المسار' : 'Track'}:</strong> ${trackInfo[caseObj.track]?.en || 'Pulse Support'} <span style="opacity:.75">(${trackInfo[caseObj.track]?.ar || 'دعم التطبيقات'})</span></p>
    <p><strong>${labels[currentLang].status}:</strong> ${translateStatus(caseObj.status)}</p>
    <p><strong>${labels[currentLang].symptoms}:</strong> ${symptoms}</p>
    <p><strong>${labels[currentLang].repro}:</strong> ${repro}</p>
    <p><strong>${labels[currentLang].cause}:</strong> ${cause}</p>
    <p><strong>${labels[currentLang].fix}:</strong> ${fix}</p>
    <p><strong>${labels[currentLang].impact}:</strong> ${impact}</p>
    <p><strong>${labels[currentLang].prevention}:</strong> ${prevention}</p>
  `;
  modal.classList.remove('hidden');
}

function hideCaseModal() {
  const modal = document.getElementById('case-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
  clearTicketPanel();
}

/* =====================
 * AI Ticket Composer UI
 */
function clearTicketPanel() {
  const panel = document.getElementById('ticketPanel');
  const en = document.getElementById('ticketEnglish');
  const ar = document.getElementById('ticketArabic');
  const badge = document.getElementById('ticketQualityBadge');
  const note = document.getElementById('ticketImproveNote');
  const copyBtn = document.getElementById('copyTicketJsonBtn');
  if (panel) panel.classList.add('hidden');
  if (en) en.innerHTML = '';
  if (ar) ar.innerHTML = '';
  if (badge) badge.textContent = '–';
  if (note) note.textContent = '';
  if (copyBtn) copyBtn.disabled = true;
  lastGeneratedTicket = null;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderTicketCard(container, langLabel, ticket) {
  if (!container || !ticket) return;
  const steps = Array.isArray(ticket.reproduction_steps) ? ticket.reproduction_steps : [];
  const checklist = Array.isArray(ticket.attachments_checklist) ? ticket.attachments_checklist : [];

  // Labels per language
  const L = {
    en: { title: 'Title', sev: 'Severity', steps: 'Reproduction Steps', exp: 'Expected', act: 'Actual', impact: 'Business Impact', attach: 'Attachments Checklist' },
    ar: { title: 'العنوان', sev: 'الخطورة', steps: 'خطوات إعادة الإنتاج', exp: 'المتوقع', act: 'الفعلي', impact: 'الأثر على العمل', attach: 'المرفقات المطلوبة' }
  };
  const labels = langLabel === 'AR' ? L.ar : L.en;

  container.innerHTML = `
    <h4>${langLabel}</h4>
    <div class="ticket-row"><span class="k">${labels.title}</span><div class="v">${escapeHtml(ticket.title)}</div></div>
    <div class="ticket-row"><span class="k">${labels.sev}</span><div class="v">${escapeHtml(ticket.severity_suggestion)}</div></div>
    <div class="ticket-row"><span class="k">${labels.steps}</span>
      <ul class="ticket-list">${steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
    </div>
    <div class="ticket-row"><span class="k">${labels.exp}</span><div class="v">${escapeHtml(ticket.expected_behavior)}</div></div>
    <div class="ticket-row"><span class="k">${labels.act}</span><div class="v">${escapeHtml(ticket.actual_behavior)}</div></div>
    <div class="ticket-row"><span class="k">${labels.impact}</span><div class="v">${escapeHtml(ticket.business_impact)}</div></div>
    <div class="ticket-row"><span class="k">${labels.attach}</span>
      <ul class="ticket-list">${checklist.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
    </div>
  `;
}

function renderTicketPanel(ticketJson) {
  const panel = document.getElementById('ticketPanel');
  const en = document.getElementById('ticketEnglish');
  const ar = document.getElementById('ticketArabic');
  const badge = document.getElementById('ticketQualityBadge');
  const note = document.getElementById('ticketImproveNote');
  const copyBtn = document.getElementById('copyTicketJsonBtn');
  if (!panel || !en || !ar || !badge || !note) return;

  lastGeneratedTicket = ticketJson;
  const score = ticketJson?.ai_quality_score?.score || '–';
  const improve = ticketJson?.ai_quality_score?.improvement_note || '';

  badge.textContent = `${i18n[currentLang].ticket_quality}: ${score}`;
  note.textContent = improve;

  renderTicketCard(en, 'EN', ticketJson.ticket.english);
  renderTicketCard(ar, 'AR', ticketJson.ticket.arabic);

  panel.classList.remove('hidden');
  if (copyBtn) copyBtn.disabled = false;
}

async function copyTicketJson() {
  if (!lastGeneratedTicket) return;
  const text = JSON.stringify(lastGeneratedTicket, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    const copyBtn = document.getElementById('copyTicketJsonBtn');
    if (copyBtn) {
      const old = copyBtn.textContent;
      copyBtn.textContent = i18n[currentLang].ticket_copied;
      setTimeout(() => { copyBtn.textContent = old; }, 1200);
    }
  } catch (e) {
    // fallback: show JSON in alert for manual copy
    alert(text);
  }
}

/* =====================
 * إعدادات التأثيرات السينمائية والمؤشر
 */
// مراقبة الأقسام لإظهارها عند التمرير
function initScrollAnimations() {
  // fallback: إذا لم يدعم المتصفح IntersectionObserver نجعل كل العناصر مرئية
  if (typeof IntersectionObserver === 'undefined') {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));
}

// تحريك ضوء المؤشر بناءً على موقع الفأرة
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursorSpotlight');
  if (!spotlight) return;
  // إخفاء المؤشر على شاشات اللمس
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice) {
    spotlight.style.display = 'none';
    return;
  }
  document.addEventListener('pointermove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    spotlight.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* =====================
 * بيانات وضع المقابلة (Interview Mode)
 * أسئلة وأجوبة باللغتين العربية والإنجليزية.
 */
const interviewByTrack = {
  pulse_support: [
    {
      question_ar: 'كيف تتعامل مع Incident يؤثر على رحلة المستخدم (User Journey)؟',
      answer_ar: 'أبدأ بتحديد نقطة الانكسار في الرحلة (Login/Checkout/Booking)، ثم أجمع إشارات سريعة: timestamps، نسبة الفشل، الخدمات المتأثرة، ووجود تغييرات حديثة. أوثق Repro Steps بدقة مع Expected vs Actual، وأرفع تصعيدًا “Developer‑ready” مع أثر المشكلة (Impact) وSeverity. بالتوازي أبحث عن تخفيف سريع (Workaround) أو تعطيل Feature Flag إن أمكن.',
      question_en: 'How do you handle an incident impacting the user journey?',
      answer_en: 'I identify the break point in the journey (login/checkout/booking), gather quick signals (timestamps, failure rate, impacted services, recent changes), and document precise repro steps with expected vs actual. I escalate with a developer-ready ticket including impact and severity, while looking for a fast mitigation (workaround/feature flag rollback).'
    },
    {
      question_ar: 'ما الذي يجعل تذكرتك “جاهزة للمطور”؟',
      answer_ar: 'خطوات إعادة الإنتاج + بيئة/نسخة + توقيت + Logs إن وجدت + Expected/Actual + أثر الأعمال + نطاق المشكلة (من المتأثر؟) + اقتراح فرضيات أولية. هذا يقلل الـback-and-forth ويقصر TTR.',
      question_en: 'What makes your ticket “developer-ready”?',
      answer_en: 'Repro steps, environment/version, timestamps, logs (when available), expected vs actual, business impact, scope of affected users, plus initial hypotheses. It reduces back-and-forth and shortens TTR.'
    },
    {
      question_ar: 'كيف توازن بين حل سريع والتحقيق الجذري؟',
      answer_ar: 'أتعامل مع الموضوع بطبقتين: Mitigation أولًا لحماية الخدمة (rollback/feature flag/limit traffic)، ثم RCA لاحقًا بتوثيق ما حدث وما الذي تغير، وتحديد Action Items قابلة للقياس لمنع التكرار.',
      question_en: 'How do you balance fast mitigation vs. root-cause analysis?',
      answer_en: 'I operate in two layers: mitigate first to protect service (rollback/feature flag/traffic limiting), then run RCA to document what changed, what happened, and define measurable action items to prevent recurrence.'
    }
  ],

  sla_command: [
    {
      question_ar: 'كيف تحدد Severity وSLA للحادثة؟',
      answer_ar: 'أستخدم مصفوفة تجمع (عدد المستخدمين المتأثرين × توقف الخدمة × حساسية الوقت). أربط ذلك بـSLA المتفق عليه وأُبرز “Impact Statement” واضح قبل أي قرار.',
      question_en: 'How do you determine severity and SLA for an incident?',
      answer_en: 'I use a matrix combining affected users × service stoppage × time sensitivity. I tie it to the agreed SLA and write a clear impact statement before deciding.'
    },
    {
      question_ar: 'كيف تدير تواصل المستخدم أثناء التحقيق؟',
      answer_ar: 'أحدد cadence ثابت (كل X ساعات) مع: ما الذي نعرفه، ما الذي نفعله الآن، وETA تقريبي إن أمكن. الهدف تقليل القلق ووقف تذاكر المتابعة.',
      question_en: 'How do you manage user communication during investigation?',
      answer_en: 'I set a consistent cadence (every X hours) covering what we know, what we’re doing now, and a rough ETA when possible. It reduces anxiety and follow-up tickets.'
    },
    {
      question_ar: 'كيف تتأكد أن التصعيد فعال؟',
      answer_ar: 'لا أرسل تصعيدًا بدون Repro واضح + logs + timestamps + severity + owner. وأتابع “time-to-first-action” كقياس لجودة التصعيد.',
      question_en: 'How do you ensure escalations are effective?',
      answer_en: 'I never escalate without clear repro, logs, timestamps, severity, and ownership. I track time-to-first-action as a quality metric.'
    }
  ],

  automation_forge: [
    {
      question_ar: 'كيف تختار ما يستحق الأتمتة؟',
      answer_ar: 'أختار بناءً على التكرار × الوقت المستهلك × خطر الخطأ البشري. أبدأ بأتمتة صغيرة عالية العائد مثل auto-routing، قوالب التذاكر، أو تذكيرات SLA.',
      question_en: 'How do you decide what to automate?',
      answer_en: 'I prioritize by frequency × time cost × risk of human error. I start with small, high-ROI automations like auto-routing, ticket templates, or SLA reminders.'
    },
    {
      question_ar: 'كيف تقيس أثر الأتمتة؟',
      answer_ar: 'قبل/بعد: زمن الاستجابة، TTR، نسبة mis-route، وعدد التذاكر المتكررة. الأهم تحويل القياس إلى تحسين مستمر.',
      question_en: 'How do you measure automation impact?',
      answer_en: 'Before/after metrics: response time, TTR, mis-route rate, and repeat ticket volume. Then I iterate based on the data.'
    },
    {
      question_ar: 'ما الذي يجعل Self‑Service ناجحًا؟',
      answer_ar: 'ظهور الإجابة في اللحظة المناسبة (داخل النموذج/داخل التطبيق) مع كلمات مفتاحية صحيحة ومحتوى قصير واضح، ثم مسار تصعيد إن لم تنجح الخطوات.',
      question_en: 'What makes self-service successful?',
      answer_en: 'Surfacing the right answer at the right time (in-form/in-app) with good keywords, concise steps, and a clear escalation path if it doesn’t work.'
    }
  ],

  knowledge_vault: [
    {
      question_ar: 'كيف تبني Knowledge Base قابلة للبحث؟',
      answer_ar: 'بـTaxonomy واضح، عناوين معيارية، كلمات مفتاحية، وقوالب ثابتة. أراقب “Top searches” و“no-result queries” لتحسين IA.',
      question_en: 'How do you build a searchable knowledge base?',
      answer_en: 'With clear taxonomy, consistent titles, strong keywords, and standard templates. I monitor top searches and no-result queries to improve IA.'
    },
    {
      question_ar: 'كيف تمنع المقالات من أن تصبح قديمة؟',
      answer_ar: 'DoD للمقالة (owner، آخر تحديث، نسخة مدعومة) + دورة مراجعة + إشعار عند تغييرات المنتج المؤثرة.',
      question_en: 'How do you prevent articles from becoming outdated?',
      answer_en: 'Define an article DoD (owner, last updated, supported version) + review cycle + alerts when product changes impact documentation.'
    },
    {
      question_ar: 'كيف تقلل التكرار في المقالات؟',
      answer_ar: 'Canonical article + redirects + سياسة naming + مراجعة قبل النشر. الهدف “مصدر واحد للحقيقة”.',
      question_en: 'How do you reduce duplicated articles?',
      answer_en: 'Canonical articles + redirects + naming policy + pre-publish review. The goal is a single source of truth.'
    }
  ],

  enablement_studio: [
    {
      question_ar: 'كيف تجهز المستخدمين لميزة جديدة دون إغراق الدعم؟',
      answer_ar: 'Quick Start قصير + فيديو 60 ثانية + FAQ داخل التطبيق + مقالة KB مفهرسة. ثم أراقب adoption وأحدث المحتوى حسب ما يظهر من تذاكر.',
      question_en: 'How do you enable users for a new feature without overwhelming support?',
      answer_en: 'A short quick start, a 60-second walkthrough, in-app FAQ, and a searchable KB article. Then I monitor adoption and iterate based on ticket signals.'
    },
    {
      question_ar: 'كيف تحدد أكثر نقطة تسبب ارتباك؟',
      answer_ar: 'أحلل نصوص التذاكر (top phrases) + خطوة الانقطاع في رحلة المستخدم + معدل التراجع/التخلي. بعدها أصمم “micro-guides” موجهة لهذه النقطة.',
      question_en: 'How do you identify the biggest confusion point?',
      answer_en: 'I analyze ticket text (top phrases), the break point in the user journey, and drop-off rates. Then I craft micro-guides targeted at that point.'
    },
    {
      question_ar: 'ما مقياس نجاح enablement؟',
      answer_ar: 'انخفاض تذاكر how-to، تحسن وقت الحل، وارتفاع اكتمال المهام داخل النظام (task completion).',
      question_en: 'What is your enablement success metric?',
      answer_en: 'Lower how-to tickets, faster resolution time, and higher task completion inside the product.'
    }
  ],

  implementation_dock: [
    {
      question_ar: 'كيف تدير Access/Roles أثناء Go‑Live؟',
      answer_ar: 'أبني Role Matrix، أضع قوالب onboarding، وأجري اختبار صلاحيات (pre-go-live) لضمان أن كل دور يرى ما يحتاجه فقط.',
      question_en: 'How do you handle access/roles during go-live?',
      answer_en: 'I build a role matrix, use onboarding templates, and run pre-go-live access tests to ensure each role sees only what it needs.'
    },
    {
      question_ar: 'كيف تمنع “الميزة غير موجودة” من التحول لظاهرة؟',
      answer_ar: 'توثيق الأدوار، قوالب تهيئة موحدة، وقياس نسبة تذاكر access. وأضيف قائمة تحقق لكل تفعيل مستخدم.',
      question_en: 'How do you prevent “feature missing” tickets from becoming systemic?',
      answer_en: 'Document roles, standardize provisioning, measure access-ticket ratio, and add a checklist per user activation.'
    },
    {
      question_ar: 'كيف تتعامل مع اختلاف بيئات العملاء؟',
      answer_ar: 'أوثق الاختلافات (config matrix)، وأضيف checks قبل التطبيق، وأحافظ على runbook موحد قابل للتخصيص.',
      question_en: 'How do you handle differences across customer environments?',
      answer_en: 'I document a configuration matrix, add pre-implementation checks, and maintain a standardized but customizable runbook.'
    }
  ],

  quality_sentinel: [
    {
      question_ar: 'كيف تصمم Regression Checklist فعالة؟',
      answer_ar: 'أبدأ بالـbaseline flows الأكثر استخدامًا، أربطها بالمكونات المتأثرة، وأضيف smoke سريع قبل النشر. ثم أحتفظ بـtest notes قابلة للتكرار.',
      question_en: 'How do you design an effective regression checklist?',
      answer_en: 'I start with the most-used baseline flows, tie them to impacted components, add a fast pre-release smoke set, and keep reproducible test notes.'
    },
    {
      question_ar: 'كيف تكتب Defect Report قوي؟',
      answer_ar: 'Steps + expected/actual + severity + environment + logs/screens + scope. ثم أحدد “why it matters” للمستخدم/العمل.',
      question_en: 'How do you write a strong defect report?',
      answer_en: 'Steps, expected/actual, severity, environment, logs/screens, scope—plus why it matters for users/business.'
    },
    {
      question_ar: 'متى تختار Rollback؟',
      answer_ar: 'عند تأثير واسع أو risk عالي، خاصة مع غياب fix سريع. rollback قرار حماية للخدمة، ثم نستكمل RCA وخطة منع التكرار.',
      question_en: 'When do you choose rollback?',
      answer_en: 'When impact is wide or risk is high, especially without a fast fix. Rollback protects service, then we complete RCA and prevention actions.'
    }
  ]
};

// إنشاء محتوى وضع المقابلة بناءً على اللغة الحالية
function buildCaseInterview(caseObj) {
  if (!caseObj) return [];
  const titleAr = caseObj.title || '';
  const titleEn = caseObj.title_en || caseObj.title || '';
  const symptomsAr = caseObj.symptoms || '';
  const symptomsEn = caseObj.symptoms_en || caseObj.symptoms || '';
  const reproAr = caseObj.repro || '';
  const reproEn = caseObj.repro_en || caseObj.repro || '';
  const causeAr = caseObj.cause || '';
  const causeEn = caseObj.cause_en || caseObj.cause || '';
  const fixAr = caseObj.fix || '';
  const fixEn = caseObj.fix_en || caseObj.fix || '';
  const impactAr = caseObj.impact || '';
  const impactEn = caseObj.impact_en || caseObj.impact || '';
  const preventionAr = caseObj.prevention || '';
  const preventionEn = caseObj.prevention_en || caseObj.prevention || '';

  return [
    {
      question_ar: `احكِ لي عن هذه القضية: ${titleAr}. ماذا كانت الأعراض وما الذي لاحظته أولاً؟`,
      answer_ar: `الأعراض كانت: ${symptomsAr}. بدأت بجمع تفاصيل من المستخدمين/السجلات والتأكد من نطاق التأثر قبل اتخاذ أي إجراء.`,
      question_en: `Walk me through this case: ${titleEn}. What symptoms did you notice first?`,
      answer_en: `The symptoms were: ${symptomsEn}. I started by collecting user reports/log signals and confirming the impact scope before taking action.`
    },
    {
      question_ar: `كيف تمكنت من إعادة إنتاج المشكلة أو التحقق منها بسرعة؟`,
      answer_ar: `اعتمدت على خطوات إعادة الإنتاج: ${reproAr}. ثم وثّقت المتوقع مقابل الفعلي، وأضفت أي مؤشرات زمنية أو لقطات/سجلات تدعم التشخيص.`,
      question_en: `How did you reproduce or validate the issue quickly?`,
      answer_en: `I followed the repro steps: ${reproEn}. Then I documented expected vs actual behavior and attached relevant timestamps/log evidence to support diagnosis.`
    },
    {
      question_ar: `ما السبب الجذري أو أقرب فرضية وكيف تعاونت مع الفريق الفني؟`,
      answer_ar: `السبب/الفرضية: ${causeAr}. شاركت الفريق بخلاصة مركزة تشمل الأعراض + خطوات إعادة الإنتاج + التأثير + أولوية المعالجة لتسريع الوصول للحل.`,
      question_en: `What was the root cause or best hypothesis, and how did you collaborate with engineering?`,
      answer_en: `Root cause/hypothesis: ${causeEn}. I shared a concise report (symptoms + repro + impact + priority) to help engineering converge quickly.`
    },
    {
      question_ar: `ما الحل الذي تم تطبيقه وكيف تحققت من نجاحه؟`,
      answer_ar: `الحل/المعالجة: ${fixAr}. تحققت عبر إعادة تشغيل السيناريو الأساسي، ومتابعة مؤشرات النظام، والتأكد من عدم ظهور آثار جانبية على السيناريوهات القريبة.`,
      question_en: `What fix/workaround was applied and how did you verify it?`,
      answer_en: `Fix/workaround: ${fixEn}. I verified by re-running the baseline flow, monitoring key metrics/logs, and confirming no regressions in adjacent scenarios.`
    },
    {
      question_ar: `ما التأثير وكيف منعت تكرار المشكلة مستقبلًا؟`,
      answer_ar: `التأثير: ${impactAr}. الوقاية: ${preventionAr}. كما اقترحت تحسينات مثل runbook، أو تنبيهات، أو اختبارات دخان/تكامل وفق نوع العطل.`,
      question_en: `What was the impact, and how did you prevent recurrence?`,
      answer_en: `Impact: ${impactEn}. Prevention: ${preventionEn}. I also recommended improvements like runbooks, alerts, and smoke/integration tests based on the failure mode.`
    }
  ];
}

function renderInterviewModal() {
  const container = document.getElementById('interview-modal-body');
  if (!container) return;
  container.innerHTML = '';

  const badge = document.getElementById('interviewTrackBadge');
  const backBtn = document.getElementById('interviewBackBtn');

  // اختيار مصدر الأسئلة حسب السياق
  let list = [];
  if (interviewContext.mode === 'case' && interviewContext.caseObj) {
    list = buildCaseInterview(interviewContext.caseObj);
    // Badge بالإنجليزية + Tooltip بالعربية
    const caseTitleEn = interviewContext.caseObj.title_en || interviewContext.caseObj.title || 'Case';
    const caseTitleAr = interviewContext.caseObj.title || 'قضية';
    if (badge) {
      badge.textContent = `CASE • ${caseTitleEn}`;
      badge.setAttribute('title', `قضية • ${caseTitleAr}`);
    }
    if (backBtn) backBtn.classList.remove('hidden');
  } else {
    interviewContext = { mode: 'track', track: currentTrack, caseObj: null };
    list = interviewByTrack[currentTrack] || interviewByTrack.pulse_support;
    if (badge && trackInfo[currentTrack]) {
      badge.textContent = trackInfo[currentTrack].en;
      badge.setAttribute('title', trackInfo[currentTrack].ar);
    }
    if (backBtn) backBtn.classList.add('hidden');
  }

  list.forEach(item => {
    const qaItem = document.createElement('div');
    qaItem.className = 'qa-item';
    const q = document.createElement('h4');
    q.className = 'question';
    q.textContent = currentLang === 'ar' ? item.question_ar : item.question_en;
    const a = document.createElement('p');
    a.className = 'answer hidden';
    a.textContent = currentLang === 'ar' ? item.answer_ar : item.answer_en;
    q.addEventListener('click', () => {
      a.classList.toggle('hidden');
    });
    qaItem.appendChild(q);
    qaItem.appendChild(a);
    container.appendChild(qaItem);
  });
}

// إظهار نافذة المقابلة

function showInterviewModal() {
  // عند فتح وضع المقابلة بشكل عام، نعود لسياق المسار الحالي
  if (interviewContext.mode !== 'case') {
    interviewContext = { mode: 'track', track: currentTrack, caseObj: null };
  }
  renderInterviewModal();
  const modal = document.getElementById('interview-modal');
  if (modal) modal.classList.remove('hidden');
}

// إخفاء نافذة المقابلة
function hideInterviewModal() {
  const modal = document.getElementById('interview-modal');
  if (modal) modal.classList.add('hidden');
}

/* =====================
 * البحث في القضايا (Smart Search)
 * يقوم بتظليل البطاقات المطابقة وتمييز غير المطابقة عبر تقليل الشفافية.
 */
function searchCases() {
  const input = document.getElementById('caseSearchInput');
  if (!input) return;
  const term = input.value.trim().toLowerCase();
  // إزالة تأثيرات البحث السابقة
  const cards = document.querySelectorAll('.case-card');
  cards.forEach(card => {
    card.classList.remove('highlight-case');
    card.classList.remove('dim-case');
  });
  if (!term) return;
  casesData.forEach(c => {
    const title = currentLang === 'ar' ? c.title : c.title_en;
    const summary = currentLang === 'ar' ? c.summary : c.summary_en;
    const match = title.toLowerCase().includes(term) || summary.toLowerCase().includes(term);
    const cardEl = document.querySelector(`.case-card[data-id="${c.id}"]`);
    if (cardEl) {
      if (match) {
        cardEl.classList.add('highlight-case');
      } else {
        cardEl.classList.add('dim-case');
      }
    }
  });
}

// الدردشة الذكية
function addMessage(text, type) {
  const container = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ' + type;
  msgDiv.textContent = text;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

async function getChatResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('مرحبا') || lower.includes('hello')) {
    return 'أهلاً وسهلاً! كيف يمكنني مساعدتك؟';
  } else if (lower.includes('cv') || lower.includes('سيرة')) {
    return 'يمكنك الاطلاع على سيرتي الذاتية عبر الرابط في أعلى الصفحة.';
  } else if (lower.includes('خبرة') || lower.includes('experience')) {
    return 'لدي خبرة قوية في دعم التطبيقات، الأتمتة، وخدمة العملاء. يمكنك استكشاف قسم الخبرات للمزيد من التفاصيل.';
  } else {
    return 'سأقوم بالرد عليك قريباً، شكرًا لتواصلك!';
  }
}

async function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  addMessage(msg, 'user');
  input.value = '';
  const reply = await getChatResponse(msg);
  addMessage(reply, 'bot');
}

// تهيئة الأحداث عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  // تفعيل وضع JS الآن (حتى لا تختفي الصفحة إذا حدث خطأ قبل اكتمال التهيئة)
  document.documentElement.classList.add('js');

  // Watchdog: إذا لم تظهر أي عناصر خلال 900ms، نفشل-مفتوحًا بإظهار المحتوى وإزالة وضع JS
  setTimeout(() => {
    const anyVisible = document.querySelector('.reveal.visible');
    if (!anyVisible) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      document.documentElement.classList.remove('js');
    }
  }, 900);

  try {
  setCurrentYear();

  // إذا كان هناك زر للتبديل بين الوضع الليلي والنهاري قم بربطه
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', toggleDarkMode);
  }

  // تهيئة الدردشة في حال وجود العناصر
  const chatToggle = document.getElementById('chat-toggle');
  const chatContainer = document.getElementById('chat-container');
  if (chatToggle && chatContainer) {
    chatToggle.addEventListener('click', () => {
      chatContainer.classList.toggle('open');
    });
    const closeChat = document.getElementById('close-chat');
    if (closeChat) {
      closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('open');
      });
    }
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', handleChatSubmit);
    }
  }

  // تسجيل Service Worker إذا كان مدعومًا
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => console.error('Service Worker failed', err));
  }

  // إنشاء لوحة القضايا عند تحميل الصفحة
  renderCaseBoard();

  // تطبيق الترجمة الافتراضية
  applyTranslations();

  // إعداد أحداث إغلاق نافذة القضية
  const closeCaseBtn = document.getElementById('close-case-modal');
  if (closeCaseBtn) {
    closeCaseBtn.addEventListener('click', hideCaseModal);
  }
  const caseModal = document.getElementById('case-modal');
  if (caseModal) {
    caseModal.addEventListener('click', (e) => {
      if (e.target === caseModal) {
        hideCaseModal();
      }
    });
  }

  // AI Ticket Composer buttons
  const genTicketBtn = document.getElementById('generateTicketBtn');
  if (genTicketBtn) {
    genTicketBtn.addEventListener('click', () => {
      if (!lastOpenedCase) return;
      if (typeof window.composeTicket !== 'function') {
        alert('Ticket composer is not loaded.');
        return;
      }
      const ticketJson = window.composeTicket(lastOpenedCase);
      renderTicketPanel(ticketJson);
    });
  }

  const copyJsonBtn = document.getElementById('copyTicketJsonBtn');
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', copyTicketJson);
  }

  // تهيئة البحث في القضايا
  const caseSearchInput = document.getElementById('caseSearchInput');
  if (caseSearchInput) {
    caseSearchInput.addEventListener('input', searchCases);
  }

  // إعداد زر تبديل اللغة
  const langToggleBtn = document.getElementById('langToggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLanguage);
  }

  // إعداد زر وضع المقابلة
  const interviewBtn = document.getElementById('interviewModeBtn');
  if (interviewBtn) {
    interviewBtn.addEventListener('click', showInterviewModal);
  }
  // إعداد إغلاق نافذة المقابلة
  const closeInterviewBtn = document.getElementById('close-interview-modal');
  if (closeInterviewBtn) {
    closeInterviewBtn.addEventListener('click', hideInterviewModal);
  }
  const interviewModal = document.getElementById('interview-modal');
  if (interviewModal) {
    interviewModal.addEventListener('click', (e) => {
      if (e.target === interviewModal) hideInterviewModal();
    });
  }

  // زر العودة لمسار المقابلة عند الدخول من قضية
  const interviewBackBtn = document.getElementById('interviewBackBtn');
  if (interviewBackBtn) {
    interviewBackBtn.addEventListener('click', () => {
      interviewContext = { mode: 'track', track: currentTrack, caseObj: null };
      renderInterviewModal();
    });
  }

  // إعداد تبديل الثيم عند النقر على المهارات
  const chipElements = document.querySelectorAll('.skills-chips .chip');
  chipElements.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const themeName = chip.getAttribute('data-theme');
      if (themeName) {
        // تمرير إحداثيات النقر لانتقال الثيم
        const x = e.clientX;
        const y = e.clientY;
        setTrack(themeName, { x, y });
      }
      // إزالة التحديد عن جميع الشرائح ثم إضافة التحديد على العنصر الحالي
      chipElements.forEach(c => c.classList.remove('chip-selected'));
      chip.classList.add('chip-selected');
    });
  });

  // تهيئة تأثيرات التمرير والمؤشر
  initScrollAnimations();
  initCursorSpotlight();

  // تطبيق الثيم المحفوظ (إن وجد)
  applySavedTheme();
  } catch (err) {
    // إذا حدث خطأ غير متوقع، لا تُخفِ الصفحة. أظهر كل شيء.
    console.error('Init failed:', err);
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.documentElement.classList.remove('js');
  }

});
