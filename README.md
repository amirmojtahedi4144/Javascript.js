<div align="center">

<img src="https://capsule-render.top/api?type=waving&color=gradient&customColorList=6,11,20&height=260&section=header&text=JavaScript&fontSize=75&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Code%20that%20powers%20the%20web&descAlignY=58&descAlign=50" width="100%" alt="JavaScript Banner"/>

<br/>

<img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" width="160" alt="JavaScript Logo"/>

<br/><br/>

# JavaScript

**زبان برنامه‌نویسی وب — از مرورگر تا سرور، از موبایل تا هوش مصنوعی**

<p>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/ECMAScript-2024-3178C6?style=flat-square" alt="ECMAScript 2024"/>
  <img src="https://img.shields.io/badge/Node.js-Compatible-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License MIT"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
</p>

<p>
  <img src="https://img.shields.io/github/stars/your-username/your-repo?style=social" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/your-username/your-repo?style=social" alt="Forks"/>
</p>

</div>

<br/>

## 📖 فهرست مطالب

- [معرفی](#-معرفی)
- [چرا جاوااسکریپت؟](#-چرا-جاوااسکریپت)
- [ویژگی‌های کلیدی زبان](#-ویژگی‌های-کلیدی-زبان)
- [اکوسیستم و کاربردها](#-اکوسیستم-و-کاربردها)
- [نمونه کدها](#-نمونه-کدها)
- [مقایسه نسخه‌های ECMAScript](#-مقایسه-نسخه‌های-ecmascript)
- [مسیر یادگیری پیشنهادی](#-مسیر-یادگیری-پیشنهادی)
- [منابع معتبر](#-منابع-معتبر)
- [مشارکت](#-مشارکت)
- [لایسنس](#-لایسنس)

---

## 🎯 معرفی

**جاوااسکریپت (JavaScript)** یک زبان برنامه‌نویسی سبک، تفسیری و چندپارادایمی است که در سال ۱۹۹۵ توسط Brendan Eich در تنها ۱۰ روز طراحی شد. امروزه این زبان، ستون فقرات وب مدرن محسوب می‌شود و طبق نظرسنجی سالانه Stack Overflow، سال‌هاست عنوان **پراستفاده‌ترین زبان برنامه‌نویسی دنیا** را در اختیار دارد.

> این ریپازیتوری به‌عنوان مرجعی مختصر و حرفه‌ای برای آشنایی با مفاهیم، ویژگی‌ها و اکوسیستم جاوااسکریپت طراحی شده است.

---

## 🚀 چرا جاوااسکریپت؟

| مزیت | توضیح |
|:---|:---|
| 🌍 **همه‌جا اجرا می‌شود** | مرورگر، سرور (Node.js)، موبایل (React Native)، دسکتاپ (Electron) |
| ⚡ **کارایی بالا** | موتورهای مدرن مثل V8 با JIT Compilation سرعت بالایی ارائه می‌دهند |
| 📦 **بزرگ‌ترین اکوسیستم پکیج** | بیش از ۲ میلیون پکیج در npm |
| 🔄 **مدل ناهمگام قدرتمند** | Event Loop، Promise و Async/Await |
| 👥 **جامعه‌ی عظیم توسعه‌دهندگان** | مستندات، ابزار و پشتیبانی فراوان |

---

## 🧩 ویژگی‌های کلیدی زبان

- **Dynamic & Weak Typing** — تایپ پویا با تبدیل ضمنی نوع‌ها
- **First-Class Functions** — توابع به‌عنوان مقادیر درجه‌یک
- **Prototype-Based OOP** — وراثت مبتنی بر پروتوتایپ به‌جای کلاس‌های کلاسیک
- **Closures** — دسترسی توابع به Scope والد خود
- **Event-Driven & Non-blocking I/O** — مدل اجرای تک‌رشته‌ای با Event Loop
- **Modules (ESM)** — سیستم ماژول استاندارد از ES6 به بعد

---

## 🛠 اکوسیستم و کاربردها

```
Frontend        →  React · Vue · Angular · Svelte
Backend         →  Node.js · Express · NestJS
Mobile          →  React Native · Ionic
Desktop         →  Electron · Tauri
Testing         →  Jest · Vitest · Playwright
Build Tools     →  Vite · Webpack · esbuild
```

---

## 💻 نمونه کدها

<details>
<summary><strong>مثال ۱ — Async/Await و مدیریت خطا</strong></summary>

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    if (!response.ok) throw new Error(`خطای HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("دریافت اطلاعات با خطا مواجه شد:", error.message);
    return null;
  }
}
```

</details>

<details>
<summary><strong>مثال ۲ — Closure و Encapsulation</strong></summary>

```javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.value()); // 2
```

</details>

<details>
<summary><strong>مثال ۳ — Destructuring و Spread Operator</strong></summary>

```javascript
const user = { name: "علی", age: 28, city: "تهران" };
const { name, ...rest } = user;

const numbers = [1, 2, 3];
const extended = [...numbers, 4, 5];

console.log(name, rest, extended);
```

</details>

---

## 📊 مقایسه نسخه‌های ECMAScript

| نسخه | سال | ویژگی برجسته |
|:---:|:---:|:---|
| ES5 | ۲۰۰۹ | Strict Mode، JSON native support |
| ES6 (ES2015) | ۲۰۱۵ | let/const، Arrow Functions، Classes، Promises |
| ES2017 | ۲۰۱۷ | Async/Await |
| ES2020 | ۲۰۲۰ | Optional Chaining، Nullish Coalescing |
| ES2022 | ۲۰۲۲ | Top-level Await، Class Fields |
| ES2024 | ۲۰۲۴ | Array Grouping، Promise.withResolvers |

---

## 🗺 مسیر یادگیری پیشنهادی

1. مبانی زبان: متغیرها، توابع، حلقه‌ها، شرط‌ها
2. DOM Manipulation و رویدادها
3. مفاهیم پیشرفته: Closures، Prototypes، `this`
4. برنامه‌نویسی ناهمگام: Callback → Promise → Async/Await
5. ماژول‌ها و ابزارهای Build
6. یک فریم‌ورک (React یا Vue)
7. Node.js و توسعه‌ی سمت سرور
8. تست‌نویسی و بهترین شیوه‌ها (Best Practices)

---

## 📚 منابع معتبر

- 📘 [MDN Web Docs](https://developer.mozilla.org/fa/docs/Web/JavaScript) — مرجع رسمی و کامل
- 📗 [JavaScript.info](https://javascript.info) — آموزش عمیق و ساختاریافته
- 📙 [You Don't Know JS (Book Series)](https://github.com/getify/You-Dont-Know-JS)
- 📕 [ECMAScript Specification](https://tc39.es/ecma262/)

---

## 🤝 مشارکت

مشارکت شما باعث افتخار است! برای مشارکت در این پروژه:

1. ریپازیتوری را Fork کنید
2. یک Branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات خود را Commit کنید (`git commit -m 'Add: AmazingFeature'`)
4. به Branch خود Push کنید (`git push origin feature/AmazingFeature`)
5. یک Pull Request باز کنید

---

## 📄 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است. برای اطلاعات بیشتر فایل [LICENSE](LICENSE) را مطالعه کنید.

<div align="center">

---

⭐ اگر این ریپازیتوری براتون مفید بود، یک ستاره فراموش نشه!

</div>