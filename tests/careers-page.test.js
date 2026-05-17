const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const careersPath = path.join(root, "careers.html");
const careersArabicPath = path.join(root, "careers-ar.html");
const homePath = path.join(root, "index2.html");
const homeArabicPath = path.join(root, "index.html");
const cssPath = path.join(root, "css", "styles.css");

const careers = fs.readFileSync(careersPath, "utf8");
const careersArabic = fs.readFileSync(careersArabicPath, "utf8");
const home = fs.readFileSync(homePath, "utf8");
const homeArabic = fs.readFileSync(homeArabicPath, "utf8");
const styles = fs.readFileSync(cssPath, "utf8");

const requiredSnippets = [
  "Full Name",
  "Gender",
  "Contact No.",
  "Contact Email",
  "Online Profiles",
  "Age",
  "Current living location",
  "Nationality",
  "Education? (University Name - Faculty Name)",
  "Graduation Year",
  "Are you willing to start Immediately?",
  "What makes you the ideal candidate for this position?",
  "How many your experience years ?",
  "What are your salary expectations?",
  "please upload your cv",
  "Interview date and time",
];

for (const snippet of requiredSnippets) {
  assert.match(careers, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
}

for (const snippet of [
  "الاسم بالكامل",
  "النوع",
  "رقم التواصل",
  "البريد الإلكتروني",
  "روابط الحسابات",
  "السن",
  "مكان الإقامة الحالي",
  "الجنسية",
  "التعليم",
  "سنة التخرج",
  "هل يمكنك البدء فورًا؟",
  "ما الذي يجعلك المرشح المثالي لهذه الوظيفة؟",
  "سنوات الخبرة",
  "توقعات الراتب",
  "ارفع السيرة الذاتية",
  "تاريخ ووقت المقابلة",
]) {
  assert.match(careersArabic, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
}

for (const role of [
  "Java Web Developer",
  "Senior iOS Developer",
  "Senior Android Developer",
  "Character Designer",
  "UI/UX Designer &amp; UI Developer",
  "UI Ux Designer",
  "Instructional Designer",
  "Senior Graphic Designer",
  "Senior Digital marketing",
  "Senior Animator and Motion graphics",
  "(SEO) Search Engine Optimization Specialist",
  "Customer service and moderation",
  "Administrative Assistant",
  "Accountant",
  "Odoo Implementer",
]) {
  assert.match(careers, new RegExp(role.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

assert.match(careers, /type="file"[^>]+accept="\.pdf,\.doc,\.docx,\.ppt,\.pptx"/);
assert.match(careers, /class="file-input"[^>]+type="file"/);
assert.match(careers, /class="file-upload-button"/);
assert.match(careers, /Choose CV File/);
assert.match(careers, /data-file-name/);
assert.match(careers, /type="datetime-local"[^>]+name="interview_datetime"/);
assert.doesNotMatch(careers, /Choose the date and a time from 1:00 PM to 3:00 PM\./);
assert.doesNotMatch(careers, /name="interview_date"/);
assert.doesNotMatch(careers, /name="interview_time"/);
assert.doesNotMatch(careers, /name="other_nationality"/);
assert.match(careers, />Other<\/span>/);
assert.match(careers, /enctype="multipart\/form-data"/);
assert.match(careers, /<h1>Careers<\/h1>/);
assert.doesNotMatch(careers, /Complete the application below and upload your CV\. Required fields are marked with an asterisk\./);
assert.match(careers, /href="careers-ar\.html"[^>]*hreflang="ar"/);
assert.match(careersArabic, /<html lang="ar" dir="rtl">/);
assert.match(careersArabic, /<h1>المسارات المهنية<\/h1>/);
assert.doesNotMatch(careersArabic, />Careers</);
assert.doesNotMatch(careersArabic, /اختر التاريخ والوقت المناسب من 1:00 PM إلى 3:00 PM\./);
assert.doesNotMatch(careersArabic, /name="other_nationality"/);
assert.match(careersArabic, />أخرى<\/span>/);
assert.match(careersArabic, /اختر ملف السيرة الذاتية/);
assert.doesNotMatch(careersArabic, /Complete the application below and upload your CV\. Required fields are marked with an asterisk\./);
assert.match(careersArabic, /href="careers\.html"[^>]*hreflang="en"/);
assert.match(home, /href="careers\.html"[^>]*>Careers<\/a>/);
assert.match(homeArabic, /href="careers-ar\.html"[^>]*>المسارات المهنية<\/a>/);
assert.match(home, /href="https:\/\/www\.quranlms\.com\/"[^>]+data-track-event="portfolio_click_quran_university"/);
assert.match(homeArabic, /href="https:\/\/www\.quranlms\.com\/"[^>]+data-track-event="portfolio_click_quran_university"/);
assert.match(styles, /\.careers-section/);
assert.match(styles, /\.file-input\s*\{[^}]+opacity:\s*0;/s);
assert.match(styles, /\.file-upload-button/);

console.log("careers page contract passed");
