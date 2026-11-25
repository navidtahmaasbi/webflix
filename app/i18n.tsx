import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
export type Locale = "en" | "fa";
export const messages: Record<string, string> = {
  "A user already exists with this email":
    "کاربری با این ایمیل قبلاً ثبت‌نام کرده است",
  "Add to my list": "افزودن به فهرست من",
  "I liked this": "این عنوان را پسندیدم",
  Discover: "خانه",
  Browse: "جست‌وجو",
  Movies: "فیلم‌ها",
  "TV Shows": "سریال‌ها",
  "My List": "فهرست من",
  "Sign in": "ورود",
  Search: "جست‌وجو",
  "Search...": "جست‌وجو…",
  "Search for movies, shows, actors, etc.": "جست‌وجوی فیلم، سریال و بازیگر…",
  "Open main menu": "باز کردن منو",
  "Your next discovery": "تماشای بعدی شما",
  "A little mystery. A lot to explore.": "کمی راز، دنیایی برای کشف",
  "Recently explored": "اخیراً دیده‌شده",
  "Pick up where your curiosity left off": "کشف را از همان‌جا ادامه دهید",
  "The titles you saved for later": "انتخاب‌های شما برای تماشای بعد",
  "Binge-worthy series": "سریال‌های تماشایی",
  "Meet your next favorite characters": "با شخصیت‌های محبوب بعدی خود آشنا شوید",
  "Movie night": "شبِ فیلم",
  "Classics that stand the test of time": "کلاسیک‌هایی فراتر از زمان",
  "Dark & suspenseful": "رازآلود و پرتعلیق",
  "Keep the lights on": "چراغ‌ها را روشن بگذارید",
  "Featured title": "عنوان منتخب",
  "WEBFLIX • FEATURED SERIES": "وب‌فلیکس • سریال منتخب",
  "▶ Watch trailer": "▶ تماشای پیش‌نمایش",
  "ⓘ More info": "ⓘ جزئیات بیشتر",
  "Save featured title": "ذخیرهٔ عنوان منتخب",
  "YOUR PERSONAL SCREENING ROOM": "سینمای شخصی شما",
  titles: "عنوان",
  "saved on this browser": "ذخیره‌شده در این مرورگر",
  "in the local collection": "در مجموعهٔ محلی",
  Genre: "ژانر",
  Genres: "ژانرها",
  "All genres": "همهٔ ژانرها",
  "Sort by": "مرتب‌سازی",
  Featured: "منتخب",
  "Title A–Z": "نام عنوان",
  "Release year": "سال انتشار",
  "Make room for your favorites": "برای علاقه‌مندی‌ها جا باز کنید",
  "No titles in this selection": "عنوانی با این انتخاب پیدا نشد",
  "Use the + button on any title to save it, or try another genre.":
    "با دکمهٔ + عنوان‌ها را ذخیره کنید یا ژانر دیگری را انتخاب کنید.",
  "Explore titles": "کشف عنوان‌ها",
  WEBFLIX: "وب‌فلیکس",
  "A small collection. A big-screen feeling.":
    "مجموعه‌ای کوچک، حسی به وسعت سینما",
  "10 sample titles · Local search & saved list · Original cover artwork":
    "۱۰ عنوان نمونه · جست‌وجو و فهرست محلی · طرح جلد اختصاصی",
  "Trailers require internet. Full movies and episodes are not included.":
    "پیش‌نمایش‌ها به اینترنت نیاز دارند. فیلم‌ها و قسمت‌های کامل در دسترس نیستند.",
  "Close title details": "بستن جزئیات عنوان",
  "FEATURE FILM": "فیلم سینمایی",
  "TV SERIES": "سریال",
  FILM: "فیلم",
  SERIES: "سریال",
  "Trailer playing": "در حال پخش پیش‌نمایش",
  "Watch trailer": "تماشای پیش‌نمایش",
  "Trailer unavailable for this sample":
    "پیش‌نمایش این عنوان نمونه در دسترس نیست",
  "✓ In My List": "✓ در فهرست من",
  "+ My List": "+ فهرست من",
  "Classic cinema": "سینمای کلاسیک",
  "Genres:": "ژانرها:",
  "Cast:": "بازیگران:",
  "Collection:": "مجموعه:",
  "Local demo catalog": "مجموعهٔ نمایشی محلی",
  Seasons: "فصل‌ها",
  "Choose a season": "انتخاب فصل",
  "episodes ·": "قسمت ·",
  "Explore the next chapter of this series.": "فصل بعدی این سریال را کشف کنید.",
  "More like this": "پیشنهادهای مشابه",
  "Sample title information and trailers. Full video playback is not available.":
    "اطلاعات و پیش‌نمایش عنوان‌های نمونه؛ پخش نسخهٔ کامل در دسترس نیست.",
  Drama: "درام",
  Comedy: "کمدی",
  Horror: "ترسناک",
  Thriller: "هیجان‌انگیز",
  Mystery: "معمایی",
  Adventure: "ماجراجویی",
  Romance: "عاشقانه",
  Crime: "جنایی",
  "Science Fiction": "علمی‌تخیلی",
  "Sci-Fi & Fantasy": "علمی‌تخیلی و فانتزی",
  "Explore genres": "کشف ژانرها",
  "Genre filters": "فیلتر ژانرها",
  "Loading more hits...": "در حال دریافت عنوان‌های بیشتر…",
  "Sign in to your account": "ورود به حساب کاربری",
  "Email address": "نشانی ایمیل",
  Password: "گذرواژه",
  "Log in": "ورود",
  "Remember me": "مرا به خاطر بسپار",
  "Don't have an account?": "حساب کاربری ندارید؟",
  "Sign up": "ثبت‌نام",
  "Create an account": "ساخت حساب کاربری",
  "Already have an account?": "قبلاً ثبت‌نام کرده‌اید؟",
  "Email is invalid": "ایمیل معتبر نیست",
  "Password is required": "گذرواژه الزامی است",
  "Invalid email or password": "ایمیل یا گذرواژه نادرست است",
  "Password is too short": "گذرواژه کوتاه است",
  English: "انگلیسی",
};
export function translate(key: string, locale: Locale) {
  return locale === "fa"
    ? messages[key.replace(/\s+/g, " ").trim()] || key
    : key;
}
const LanguageContext = createContext({
  locale: "en" as Locale,
  setLocale: (_: Locale) => {},
});
export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocale] = useState(initialLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.cookie = `webflix-locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [locale]);
  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useI18n() {
  const { locale, setLocale } = useContext(LanguageContext);
  return {
    locale,
    setLocale,
    t: (key: string) => translate(key, locale),
    number: (value: number) =>
      new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value),
  };
}
export function LanguageSwitch() {
  const { locale, setLocale } = useI18n();
  return (
    <button
      className="language-switch"
      onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
      aria-label={locale === "fa" ? "Switch to English" : "تغییر زبان به فارسی"}
      lang={locale === "fa" ? "en" : "fa"}
    >
      {locale === "fa" ? "EN" : "فارسی"}
    </button>
  );
}
