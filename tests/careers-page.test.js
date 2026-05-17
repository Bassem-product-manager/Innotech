const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const careersPath = path.join(root, "careers.html");
const homePath = path.join(root, "index2.html");
const homeArabicPath = path.join(root, "index.html");
const cssPath = path.join(root, "css", "styles.css");

const careers = fs.readFileSync(careersPath, "utf8");
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
  "Interview date",
  "Interview time",
];

for (const snippet of requiredSnippets) {
  assert.match(careers, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
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
assert.match(careers, /type="date"[^>]+name="interview_date"/);
assert.match(careers, /type="time"[^>]+name="interview_time"[^>]+min="13:00"[^>]+max="15:00"/);
assert.match(careers, /enctype="multipart\/form-data"/);
assert.match(home, /href="careers\.html"[^>]*>Careers<\/a>/);
assert.match(homeArabic, /href="careers\.html"[^>]*>Careers<\/a>/);
assert.match(styles, /\.careers-section/);

console.log("careers page contract passed");
