(function () {
  const c = document.createElement("link").relList;
  if (c && c.supports && c.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) l(o);
  new MutationObserver((o) => {
    for (const t of o)
      if (t.type === "childList")
        for (const f of t.addedNodes)
          f.tagName === "LINK" && f.rel === "modulepreload" && l(f);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(o) {
    const t = {};
    return (
      o.integrity && (t.integrity = o.integrity),
      o.referrerPolicy && (t.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === "use-credentials"
        ? (t.credentials = "include")
        : o.crossOrigin === "anonymous"
          ? (t.credentials = "omit")
          : (t.credentials = "same-origin"),
      t
    );
  }
  function l(o) {
    if (o.ep) return;
    o.ep = !0;
    const t = n(o);
    fetch(o.href, t);
  }
})();
const u = 4,
  q = "1234",
  x = 120,
  F = 600,
  V = (r) =>
    String(r).replace(/[۰-۹٠-٩]/g, (c) => {
      const n = c.charCodeAt(0);
      return n >= 1776 && n <= 1785
        ? String(n - 1776)
        : n >= 1632 && n <= 1641
          ? String(n - 1632)
          : c;
    }),
  D = (r) => V(r).replace(/\D/g, ""),
  Y = (r) => String(r).replace(/\d/g, (c) => "۰۱۲۳۴۵۶۷۸۹"[Number(c)]),
  $ = (r) => {
    const c = Math.floor(r / 60),
      n = r % 60,
      l = `${String(c).padStart(2, "0")}:${String(n).padStart(2, "0")}`;
    return Y(l);
  };
function j() {
  var T, k;
  const r = document.getElementById("otp-card"),
    c = document.getElementById("bg-layer"),
    n = document.getElementById("otp-step-login"),
    l = document.getElementById("otp-step-success"),
    o = document.getElementById("otp-form"),
    t = Array.from(document.querySelectorAll(".otp-input")),
    f = document.getElementById("submit-btn"),
    B = document.getElementById("btn-text"),
    p = document.getElementById("btn-spinner"),
    h = document.getElementById("btn-spinner-icon"),
    g = document.getElementById("error-message"),
    d = document.getElementById("resend-btn"),
    P = document.getElementById("timer-display");
  if (!r || !o || t.length !== u) {
    console.error("[OTP] عناصر DOM یافت نشد.");
    return;
  }
  let v = x,
    L = null,
    E = !1;
  function O() {
    P.textContent = $(v);
    const e = v <= 0;
    ((d.disabled = !e),
      d.classList.toggle("opacity-50", !e),
      d.classList.toggle("cursor-not-allowed", !e),
      d.classList.toggle("cursor-pointer", e),
      d.classList.toggle("text-orange-400", e));
  }
  function b() {
    ((v = x),
      O(),
      clearInterval(L),
      (L = setInterval(() => {
        ((v -= 1), O(), v <= 0 && clearInterval(L));
      }, 1e3)));
  }
  function S() {
    return D(t.map((e) => e.value).join(""));
  }
  function I() {
    t.forEach((e) => {
      ((e.value = ""), e.classList.remove("filled", "error"));
    });
  }
  function C() {
    t.forEach((e) => {
      e.classList.toggle("filled", e.value.length === 1);
    });
  }
  function m(e) {
    (g.classList.toggle("visible", e),
      g.classList.toggle("opacity-0", !e),
      g.classList.toggle("opacity-100", e),
      t.forEach((i) => i.classList.toggle("error", e)));
  }
  function N() {
    (document.body.classList.remove("success-mode"),
      r.classList.remove("is-success"),
      c == null || c.classList.remove("is-success"),
      l == null || l.classList.add("hidden"),
      l == null || l.classList.remove("is-visible"),
      n == null || n.classList.remove("hidden", "is-hiding"),
      r.setAttribute("role", "form"),
      r.setAttribute("aria-labelledby", "otp-title"),
      t.forEach((e) => {
        ((e.disabled = !1), e.classList.remove("is-valid", "error", "filled"));
      }),
      I(),
      m(!1),
      y(!1),
      (B.textContent = "تایید و ورود"),
      f.classList.remove("is-success"),
      (E = !1),
      b(),
      t[0].focus());
  }
  function R() {
    (clearInterval(L),
      y(!1),
      t.forEach((e) => {
        ((e.disabled = !0),
          e.classList.remove("error", "filled"),
          e.classList.add("is-valid"));
      }),
      document.body.classList.add("success-mode"),
      r.classList.add("is-success"),
      c == null || c.classList.add("is-success"),
      n == null || n.classList.add("is-hiding"),
      setTimeout(() => {
        (n == null || n.classList.add("hidden"),
          l == null || l.classList.remove("hidden"),
          l == null || l.classList.add("is-visible"),
          r.setAttribute("role", "status"),
          r.removeAttribute("aria-labelledby"));
      }, 380));
  }
  function A() {
    (r.classList.remove("animate-shake"),
      r.offsetWidth,
      r.classList.add("animate-shake"),
      r.addEventListener(
        "animationend",
        () => r.classList.remove("animate-shake"),
        { once: !0 },
      ));
  }
  function w() {
    S().length === u && !E && o.requestSubmit();
  }
  function M(e) {
    const i = D(e).slice(0, u).split("");
    (t.forEach((a, _) => {
      a.value = i[_] || "";
    }),
      C());
    const s = t.findIndex((a) => !a.value);
    if (s === -1) {
      (t[u - 1].focus(), w());
      return;
    }
    t[s].focus();
  }
  function y(e) {
    ((E = e),
      (f.disabled = e),
      B.classList.toggle("hidden", e),
      p.classList.toggle("hidden", !e),
      p.classList.toggle("inline-flex", e),
      h == null || h.classList.toggle("animate-spin-slow", e),
      p.setAttribute("aria-hidden", e ? "false" : "true"),
      t.forEach((i) => {
        i.disabled = e;
      }));
  }
  (t.forEach((e, i) => {
    (e.addEventListener("input", (s) => {
      m(!1);
      const a = D(s.target.value);
      ((s.target.value = a.slice(-1)),
        s.target.value
          ? (s.target.classList.add("filled"),
            i < u - 1 ? t[i + 1].focus() : w())
          : s.target.classList.remove("filled"));
    }),
      e.addEventListener("keydown", (s) => {
        if (s.key === "Backspace") {
          !e.value &&
            i > 0 &&
            (s.preventDefault(),
            t[i - 1].focus(),
            (t[i - 1].value = ""),
            t[i - 1].classList.remove("filled"));
          return;
        }
        (s.key === "ArrowLeft" &&
          i > 0 &&
          (s.preventDefault(), t[i - 1].focus()),
          s.key === "ArrowRight" &&
            i < u - 1 &&
            (s.preventDefault(), t[i + 1].focus()),
          s.key === "Enter" && (s.preventDefault(), o.requestSubmit()));
      }),
      e.addEventListener("paste", (s) => {
        s.preventDefault();
        const a = (s.clipboardData || window.clipboardData).getData("text");
        M(a);
      }),
      e.addEventListener("focus", () => e.select()));
  }),
    o.addEventListener("submit", async (e) => {
      if ((e.preventDefault(), E)) return;
      const i = S();
      if ((m(!1), i.length < u)) {
        (A(),
          m(!0),
          (g.textContent = "لطفاً هر ۴ رقم کد را وارد کنید."),
          (t.find((a) => !a.value) || t[0]).focus());
        return;
      }
      (y(!0),
        await new Promise((s) => setTimeout(s, F)),
        i === q
          ? R()
          : (y(!1),
            A(),
            m(!0),
            (g.textContent = "کد وارد شده صحیح نیست. دوباره تلاش کنید."),
            I(),
            t[0].focus()));
    }),
    d.addEventListener("click", () => {
      d.disabled || (I(), m(!1), t[0].focus(), b());
    }),
    (T = document.getElementById("success-continue-btn")) == null ||
      T.addEventListener("click", () => {
        console.info("[OTP] انتقال به داشبورد");
      }),
    (k = document.getElementById("success-back-btn")) == null ||
      k.addEventListener("click", N),
    b(),
    t[0].focus());
}
j();
