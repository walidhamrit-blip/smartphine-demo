import type { ColorOption, LocalizedText, SpecItem } from "@/db/schema";

const px = (id: number, ext: "jpeg" | "png" = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&w=1200`;

export const IMG = {
  phoneHero: "/images/hero-phone.jpg",
  audioHero: "/images/hero-audio.jpg",
  tabletHero: "/images/hero-tablet.jpg",
  earbuds: "/images/earbuds.jpg",
  watch: "/images/watch.jpg",
  charger: "/images/charger.jpg",
  cases: "/images/cases.jpg",
  speaker: "/images/speaker.jpg",
  blackPhone: px(7981660),
  cameraMacro: px(12794501),
  silverPhone: px(3945672),
  appsPhone: px(11216260),
  redPhone: px(2378138),
  tabletStylus: px(33632618),
  tabletDark: px(13570171),
  tabletDesk: px(3945691),
  headphonesWhite: px(3394650),
  headphonesStudio: px(3394653),
  headphonesCase: px(3394651),
  earphonesFlat: px(3945679),
  usbDrive: px(18641665, "png"),
  devices: px(3946006),
};

const c = (en: string, ar: string, hex: string): ColorOption => ({ name: { en, ar }, hex });
const s = (le: string, la: string, ve: string, va: string): SpecItem => ({
  label: { en: le, ar: la },
  value: { en: ve, ar: va },
});
const L = (en: string, ar: string): LocalizedText => ({ en, ar });

export type SeedCategory = {
  slug: string;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  image: string;
  icon: string;
  sortOrder: number;
};

export const seedCategories: SeedCategory[] = [
  {
    slug: "smartphones",
    nameEn: "Smartphones",
    nameAr: "الهواتف الذكية",
    taglineEn: "Flagships and everyday heroes",
    taglineAr: "هواتف رائدة وخيارات لكل يوم",
    image: "/images/hero-phone.jpg",
    icon: "◍",
    sortOrder: 1,
  },
  {
    slug: "tablets",
    nameEn: "Tablets",
    nameAr: "الأجهزة اللوحية",
    taglineEn: "Big screens for work and play",
    taglineAr: "شاشات كبيرة للعمل والترفيه",
    image: "/images/hero-tablet.jpg",
    icon: "▭",
    sortOrder: 2,
  },
  {
    slug: "audio",
    nameEn: "Sound & Audio",
    nameAr: "الصوت والسماعات",
    taglineEn: "Headphones, earbuds & speakers",
    taglineAr: "سماعات الرأس والأذن ومكبرات الصوت",
    image: "/images/earbuds.jpg",
    icon: "◉",
    sortOrder: 3,
  },
  {
    slug: "wearables",
    nameEn: "Wearables",
    nameAr: "الساعات الذكية",
    taglineEn: "Health, fitness and style",
    taglineAr: "الصحة واللياقة والأناقة",
    image: "/images/watch.jpg",
    icon: "◠",
    sortOrder: 4,
  },
  {
    slug: "accessories",
    nameEn: "Accessories",
    nameAr: "الإكسسوارات",
    taglineEn: "Power, protection and cables",
    taglineAr: "الطاقة والحماية والكابلات",
    image: "/images/charger.jpg",
    icon: "✦",
    sortOrder: 5,
  },
];

export type SeedBrand = { slug: string; name: string; monogram: string; accent: string; sortOrder: number };

export const seedBrands: SeedBrand[] = [
  { slug: "apple", name: "Apple", monogram: "", accent: "#111114", sortOrder: 1 },
  { slug: "samsung", name: "SAMSUNG", monogram: "", accent: "#1428A0", sortOrder: 2 },
  { slug: "xiaomi", name: "Xiaomi", monogram: "MI", accent: "#FF6900", sortOrder: 3 },
  { slug: "infinix", name: "Infinix", monogram: "", accent: "#00A651", sortOrder: 4 },
  { slug: "tecno", name: "TECNO", monogram: "", accent: "#0B57A4", sortOrder: 5 },
  { slug: "honor", name: "HONOR", monogram: "", accent: "#0F1B4C", sortOrder: 6 },
  { slug: "anker", name: "Anker", monogram: "", accent: "#00A7E1", sortOrder: 7 },
  { slug: "jbl", name: "JBL", monogram: "", accent: "#FF6B00", sortOrder: 8 },
  { slug: "sony", name: "SONY", monogram: "", accent: "#111114", sortOrder: 9 },
  { slug: "spigen", name: "Spigen", monogram: "", accent: "#C8102E", sortOrder: 10 },
  { slug: "baseus", name: "Baseus", monogram: "", accent: "#F2B705", sortOrder: 11 },
  { slug: "soundcore", name: "soundcore", monogram: "", accent: "#2563EB", sortOrder: 12 },
  { slug: "sandisk", name: "SanDisk", monogram: "", accent: "#E4002B", sortOrder: 13 },
];

export type SeedProduct = {
  slug: string;
  categorySlug: string;
  brandSlug: string;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  compareAt?: number;
  stock: number;
  images: string[];
  colors: ColorOption[];
  storages: string[];
  specs: SpecItem[];
  badgeEn?: string;
  badgeAr?: string;
  featured?: boolean;
  deal?: boolean;
  isNew?: boolean;
};

export const seedProducts: SeedProduct[] = [
  {
    slug: "iphone-15-pro-max",
    categorySlug: "smartphones",
    brandSlug: "apple",
    nameEn: "iPhone 15 Pro Max",
    nameAr: "آيفون 15 برو ماكس",
    taglineEn: "Titanium. So strong. So light. So Pro.",
    taglineAr: "التيتانيوم. أقوى. أخف. احترافي.",
    descriptionEn:
      "The lightest Pro ever, forged in aerospace-grade titanium. A17 Pro delivers console-class gaming, while the 48MP main camera with 5x tetraprism telephoto captures Tripoli's coastline in astonishing detail. USB-C, Action button and all-day battery complete the package.",
    descriptionAr:
      "أخف إصدار احترافي على الإطلاق، مصنوع من التيتانيوم المستخدم في الطيران. شريحة A17 Pro تقدم أداءً استثنائياً للألعاب، وكاميرا رئيسية بدقة 48 ميجابكسل مع تقريب بصري 5x لتوثيق ساحل طرابلس بأدق التفاصيل. منفذ USB-C وزر Action وبطارية تدوم اليوم كاملاً.",
    price: 6299,
    compareAt: 6999,
    stock: 12,
    images: [IMG.blackPhone, IMG.phoneHero, IMG.cameraMacro, IMG.silverPhone],
    colors: [c("Natural Titanium", "تيتانيوم طبيعي", "#B7B0A6"), c("Blue Titanium", "تيتانيوم أزرق", "#3C4A5C"), c("Black Titanium", "تيتانيوم أسود", "#2A2A2C")],
    storages: ["256GB", "512GB", "1TB"],
    specs: [
      s("Display", "الشاشة", "6.7\" Super Retina XDR 120Hz", "6.7 بوصة Super Retina XDR 120Hz"),
      s("Chipset", "المعالج", "A17 Pro", "A17 Pro"),
      s("Camera", "الكاميرا", "48MP + 12MP + 12MP · 5x zoom", "48 + 12 + 12 ميجابكسل · تقريب 5x"),
      s("Battery", "البطارية", "Up to 29h video playback", "حتى 29 ساعة تشغيل فيديو"),
      s("Warranty", "الضمان", "1 year MyPhone warranty", "ضمان سنة من ماي فون"),
    ],
    badgeEn: "Bestseller",
    badgeAr: "الأكثر مبيعاً",
    featured: true,
    deal: true,
  },
  {
    slug: "iphone-15",
    categorySlug: "smartphones",
    brandSlug: "apple",
    nameEn: "iPhone 15",
    nameAr: "آيفون 15",
    taglineEn: "Dynamic Island. 48MP. USB-C.",
    taglineAr: "الجزيرة التفاعلية. 48 ميجابكسل. USB-C.",
    descriptionEn:
      "A 48MP main camera with 2x optical-quality telephoto, the Dynamic Island and a colour-infused glass back. Powered by the A16 Bionic chip and now with USB-C for one cable everywhere.",
    descriptionAr:
      "كاميرا رئيسية بدقة 48 ميجابكسل مع تقريب بصري بجودة 2x، والجزيرة التفاعلية وظهر زجاجي بألوان مدمجة. يعمل بمعالج A16 Bionic ويأتي بمنفذ USB-C لكابل واحد لكل أجهزتك.",
    price: 4199,
    compareAt: 4599,
    stock: 18,
    images: [IMG.silverPhone, IMG.appsPhone, IMG.cameraMacro],
    colors: [c("Pink", "وردي", "#E7C9CE"), c("Blue", "أزرق", "#C3D5DE"), c("Black", "أسود", "#2E2E30")],
    storages: ["128GB", "256GB"],
    specs: [
      s("Display", "الشاشة", "6.1\" Super Retina XDR", "6.1 بوصة Super Retina XDR"),
      s("Chipset", "المعالج", "A16 Bionic", "A16 Bionic"),
      s("Camera", "الكاميرا", "48MP main · 12MP ultra wide", "48 ميجابكسل رئيسية · 12 فائقة الاتساع"),
      s("Battery", "البطارية", "Up to 20h video playback", "حتى 20 ساعة فيديو"),
    ],
    featured: true,
  },
  {
    slug: "samsung-galaxy-s24-ultra",
    categorySlug: "smartphones",
    brandSlug: "samsung",
    nameEn: "Galaxy S24 Ultra",
    nameAr: "جالكسي S24 ألترا",
    taglineEn: "Galaxy AI. 200MP. S Pen included.",
    taglineAr: "ذكاء جالكسي. 200 ميجابكسل. قلم S Pen مرفق.",
    descriptionEn:
      "A titanium frame, flat 6.8\" QHD+ display and a 200MP quad camera with 5x optical zoom. Circle to Search, live translate calls and the built-in S Pen make it the most capable Galaxy yet.",
    descriptionAr:
      "إطار من التيتانيوم وشاشة مسطحة 6.8 بوصة QHD+ وكاميرا رباعية بدقة 200 ميجابكسل مع تقريب بصري 5x. ميزات Circle to Search والترجمة الفورية للمكالمات وقلم S Pen المدمج تجعله أقوى جالكسي حتى الآن.",
    price: 5499,
    compareAt: 5999,
    stock: 9,
    images: [IMG.cameraMacro, IMG.phoneHero, IMG.blackPhone],
    colors: [c("Titanium Gray", "تيتانيوم رمادي", "#6E6E70"), c("Titanium Violet", "تيتانيوم بنفسجي", "#8A7F9B"), c("Titanium Black", "تيتانيوم أسود", "#242426")],
    storages: ["256GB", "512GB"],
    specs: [
      s("Display", "الشاشة", "6.8\" QHD+ Dynamic AMOLED 2X", "6.8 بوصة QHD+ Dynamic AMOLED 2X"),
      s("Chipset", "المعالج", "Snapdragon 8 Gen 3 for Galaxy", "Snapdragon 8 Gen 3 for Galaxy"),
      s("Camera", "الكاميرا", "200MP quad camera · 5x optical", "كاميرا رباعية 200 ميجابكسل · 5x بصري"),
      s("Battery", "البطارية", "5000mAh · 45W fast charge", "5000 مللي أمبير · شحن سريع 45 واط"),
      s("Extras", "إضافات", "S Pen, Galaxy AI, IP68", "S Pen، ذكاء جالكسي، IP68"),
    ],
    badgeEn: "Galaxy AI",
    badgeAr: "ذكاء جالكسي",
    featured: true,
    isNew: true,
  },
  {
    slug: "samsung-galaxy-a55",
    categorySlug: "smartphones",
    brandSlug: "samsung",
    nameEn: "Galaxy A55 5G",
    nameAr: "جالكسي A55 5G",
    taglineEn: "Premium build, everyday price",
    taglineAr: "تصميم فاخر بسعر مناسب",
    descriptionEn:
      "A metal frame, 6.6\" Super AMOLED 120Hz display and a 50MP OIS camera with 4 years of OS updates. The most balanced mid-ranger in the MyPhone lineup.",
    descriptionAr:
      "إطار معدني وشاشة Super AMOLED 6.6 بوصة بمعدل 120Hz وكاميرا 50 ميجابكسل مع مثبت بصري وأربع سنوات من تحديثات النظام. أفضل توازن في فئة الهواتف المتوسطة لدى ماي فون.",
    price: 1499,
    compareAt: 1699,
    stock: 24,
    images: [IMG.appsPhone, IMG.silverPhone, IMG.devices],
    colors: [c("Awesome Navy", "كحلي", "#22304C"), c("Awesome Iceblue", "أزرق فاتح", "#BBD2E0"), c("Awesome Lilac", "ليلكي", "#C9BEDC")],
    storages: ["128GB", "256GB"],
    specs: [
      s("Display", "الشاشة", "6.6\" Super AMOLED 120Hz", "6.6 بوصة Super AMOLED 120Hz"),
      s("Chipset", "المعالج", "Exynos 1480", "Exynos 1480"),
      s("Camera", "الكاميرا", "50MP OIS + 12MP + 5MP", "50 ميجابكسل مثبت + 12 + 5"),
      s("Battery", "البطارية", "5000mAh · 25W", "5000 مللي أمبير · 25 واط"),
    ],
    deal: true,
  },
  {
    slug: "xiaomi-14",
    categorySlug: "smartphones",
    brandSlug: "xiaomi",
    nameEn: "Xiaomi 14",
    nameAr: "شاومي 14",
    taglineEn: "Leica optics in your pocket",
    taglineAr: "عدسات لايكا في جيبك",
    descriptionEn:
      "Co-engineered with Leica: a 50MP triple camera with Summilux lenses and a 1/1.31\" sensor. Snapdragon 8 Gen 3, 90W HyperCharge and a gorgeous 6.36\" LTPO display.",
    descriptionAr:
      "مطوّر بالتعاون مع لايكا: كاميرا ثلاثية 50 ميجابكسل بعدسات Summilux ومستشعر 1/1.31 بوصة. معالج Snapdragon 8 Gen 3 وشحن فائق 90 واط وشاشة LTPO رائعة 6.36 بوصة.",
    price: 3199,
    compareAt: 3499,
    stock: 11,
    images: [IMG.blackPhone, IMG.cameraMacro, IMG.phoneHero],
    colors: [c("Black", "أسود", "#232325"), c("Jade Green", "أخضر يشمي", "#4E6E61"), c("White", "أبيض", "#F0EEEA")],
    storages: ["256GB", "512GB"],
    specs: [
      s("Display", "الشاشة", "6.36\" LTPO AMOLED 120Hz", "6.36 بوصة LTPO AMOLED 120Hz"),
      s("Chipset", "المعالج", "Snapdragon 8 Gen 3", "Snapdragon 8 Gen 3"),
      s("Camera", "الكاميرا", "50MP Leica triple camera", "كاميرا لايكا ثلاثية 50 ميجابكسل"),
      s("Battery", "البطارية", "4610mAh · 90W HyperCharge", "4610 مللي أمبير · شحن 90 واط"),
    ],
    isNew: true,
    featured: true,
  },
  {
    slug: "redmi-note-13-pro",
    categorySlug: "smartphones",
    brandSlug: "xiaomi",
    nameEn: "Redmi Note 13 Pro",
    nameAr: "ريدمي نوت 13 برو",
    taglineEn: "200MP camera. 67W turbo charge.",
    taglineAr: "كاميرا 200 ميجابكسل. شحن سريع 67 واط.",
    descriptionEn:
      "A 200MP OIS camera, 1.5K 120Hz AMOLED display and 67W turbo charging — the value champion of Tripoli. Comes with 8GB RAM and a 5100mAh battery that lasts two days light use.",
    descriptionAr:
      "كاميرا 200 ميجابكسل مع مثبت بصري وشاشة AMOLED بدقة 1.5K و120Hz وشحن سريع 67 واط — بطل القيمة في طرابلس. يأتي بذاكرة 8 جيجابايت وبطارية 5100 مللي أمبير تدوم يومين للاستخدام الخفيف.",
    price: 899,
    compareAt: 1049,
    stock: 36,
    images: [IMG.redPhone, IMG.cameraMacro, IMG.silverPhone],
    colors: [c("Midnight Black", "أسود منتصف الليل", "#1E1F22"), c("Forest Green", "أخضر غامق", "#35564A"), c("Ocean Blue", "أزرق محيطي", "#2C5A8C")],
    storages: ["128GB", "256GB"],
    specs: [
      s("Display", "الشاشة", "6.67\" 1.5K AMOLED 120Hz", "6.67 بوصة 1.5K AMOLED 120Hz"),
      s("Camera", "الكاميرا", "200MP OIS + 8MP + 2MP", "200 ميجابكسل مثبت + 8 + 2"),
      s("Battery", "البطارية", "5100mAh · 67W turbo", "5100 مللي أمبير · شحن 67 واط"),
      s("Chipset", "المعالج", "Snapdragon 7s Gen 2", "Snapdragon 7s Gen 2"),
    ],
    deal: true,
    featured: true,
  },
  {
    slug: "infinix-note-40-pro",
    categorySlug: "smartphones",
    brandSlug: "infinix",
    nameEn: "Infinix Note 40 Pro",
    nameAr: "إنفينكس نوت 40 برو",
    taglineEn: "All-day power, uninterrupted gaming",
    taglineAr: "طاقة ليوم كامل ولعب بلا انقطاع",
    descriptionEn:
      "A 6.78\" 120Hz AMOLED display, Helio G99 Ultimate chipset and 70W MultiSpeed charging with MagCharge wireless support. Ideal for students and mobile gamers in Libya.",
    descriptionAr:
      "شاشة AMOLED 6.78 بوصة بمعدل 120Hz ومعالج Helio G99 Ultimate وشحن متعدد السرعات 70 واط ودعم الشحن اللاسلكي MagCharge. مثالي للطلاب ومحبي الألعاب في ليبيا.",
    price: 749,
    compareAt: 849,
    stock: 30,
    images: [IMG.blackPhone, IMG.devices, IMG.appsPhone],
    colors: [c("Obsidian Black", "أسود", "#1A1A1C"), c("Titan Gold", "ذهبي", "#C8A96A"), c("Vintage Green", "أخضر", "#43584B")],
    storages: ["256GB"],
    specs: [
      s("Display", "الشاشة", "6.78\" AMOLED 120Hz", "6.78 بوصة AMOLED 120Hz"),
      s("Chipset", "المعالج", "Helio G99 Ultimate", "Helio G99 Ultimate"),
      s("Battery", "البطارية", "5000mAh · 70W", "5000 مللي أمبير · 70 واط"),
      s("Camera", "الكاميرا", "108MP triple camera", "كاميرا ثلاثية 108 ميجابكسل"),
    ],
    deal: true,
  },
  {
    slug: "tecno-camon-30",
    categorySlug: "smartphones",
    brandSlug: "tecno",
    nameEn: "Tecno Camon 30",
    nameAr: "تكنو كامون 30",
    taglineEn: "Portrait master on a budget",
    taglineAr: "سيد البورتريه بسعر مناسب",
    descriptionEn:
      "A 50MP Sony OIS main camera and 50MP front shooter for the sharpest selfies in its class. 70W charging, 6.78\" AMOLED screen and a sleek vegan-leather finish.",
    descriptionAr:
      "كاميرا رئيسية 50 ميجابكسل من سوني مع مثبت بصري وكاميرا أمامية 50 ميجابكسل لأفضل سيلفي في فئتها. شحن 70 واط وشاشة AMOLED 6.78 بوصة وتصميم أنيق من الجلد النباتي.",
    price: 699,
    compareAt: 799,
    stock: 22,
    images: [IMG.devices, IMG.blackPhone, IMG.silverPhone],
    colors: [c("Iceland Basaltic Dark", "أسود بازلتي", "#26282B"), c("Uyuni Salt White", "أبيض", "#EFEEE9")],
    storages: ["256GB"],
    specs: [
      s("Display", "الشاشة", "6.78\" AMOLED 120Hz", "6.78 بوصة AMOLED 120Hz"),
      s("Camera", "الكاميرا", "50MP Sony OIS main", "50 ميجابكسل سوني مثبت"),
      s("Battery", "البطارية", "5000mAh · 70W", "5000 مللي أمبير · 70 واط"),
      s("Selfie", "الأمامية", "50MP with autofocus", "50 ميجابكسل بتركيز تلقائي"),
    ],
  },
  {
    slug: "honor-x9b",
    categorySlug: "smartphones",
    brandSlug: "honor",
    nameEn: "HONOR X9b",
    nameAr: "هونر X9b",
    taglineEn: "Ultra-tough AMOLED, 3-day battery",
    taglineAr: "شاشة AMOLED فائقة المتانة وبطارية 3 أيام",
    descriptionEn:
      "An anti-drop 360° curved AMOLED display, 108MP camera and a 5800mAh battery. Thin, light and built for real life in Tripoli.",
    descriptionAr:
      "شاشة AMOLED منحنية 360° مقاومة للسقوط وكاميرا 108 ميجابكسل وبطارية 5800 مللي أمبير. نحيف وخفيف ومصمم لواقع الحياة في طرابلس.",
    price: 829,
    stock: 16,
    images: [IMG.appsPhone, IMG.blackPhone, IMG.cameraMacro],
    colors: [c("Emerald Green", "أخضر زمردي", "#2F5D50"), c("Midnight Black", "أسود", "#212123")],
    storages: ["256GB"],
    specs: [
      s("Display", "الشاشة", "6.78\" curved AMOLED 120Hz", "6.78 بوصة AMOLED منحنية 120Hz"),
      s("Camera", "الكاميرا", "108MP ultra clear", "108 ميجابكسل فائقة الوضوح"),
      s("Battery", "البطارية", "5800mAh", "5800 مللي أمبير"),
      s("Display protection", "حماية الشاشة", "Ultra-bounce anti-drop", "حماية فائقة ضد السقوط"),
    ],
  },
  {
    slug: "ipad-air-11-m2",
    categorySlug: "tablets",
    brandSlug: "apple",
    nameEn: "iPad Air 11\" (M2)",
    nameAr: "آيباد إير 11\" (M2)",
    taglineEn: "Serious performance. Feather light.",
    taglineAr: "أداء جدي. خفيف كالريشة.",
    descriptionEn:
      "The M2 chip brings laptop-class power to a 462g tablet. Perfect for design students, Netflix nights and Apple Pencil Pro sketching on the stunning Liquid Retina display.",
    descriptionAr:
      "شريحة M2 تمنح جهازاً لوحياً بوزن 462 جراماً قوة الحواسيب المحمولة. مثالي لطلاب التصميم وليالي الأفلام والرسم بقلم Apple Pencil Pro على شاشة Liquid Retina المذهلة.",
    price: 3299,
    compareAt: 3599,
    stock: 8,
    images: [IMG.tabletStylus, IMG.tabletHero, IMG.tabletDesk],
    colors: [c("Space Gray", "رمادي فضائي", "#5C5E61"), c("Blue", "أزرق", "#A7C4D4"), c("Starlight", "أبيض نجمي", "#EDE6DA")],
    storages: ["128GB", "256GB"],
    specs: [
      s("Display", "الشاشة", "11\" Liquid Retina 264ppi", "11 بوصة Liquid Retina"),
      s("Chipset", "المعالج", "Apple M2", "Apple M2"),
      s("Battery", "البطارية", "Up to 10h surfing", "حتى 10 ساعات تصفح"),
      s("Accessories", "الملحقات", "Apple Pencil Pro, Magic Keyboard", "قلم Apple Pencil Pro ولوحة مفاتيح ماجيك"),
    ],
    featured: true,
  },
  {
    slug: "ipad-10th-gen",
    categorySlug: "tablets",
    brandSlug: "apple",
    nameEn: "iPad (10th generation)",
    nameAr: "آيباد (الجيل العاشر)",
    taglineEn: "Colourful. Capable. Family favourite.",
    taglineAr: "ملوّن. قوي. المفضل للعائلة.",
    descriptionEn:
      "A 10.9\" Liquid Retina display, A14 Bionic chip and USB-C. Great for school, streaming and video calls with the landscape front camera.",
    descriptionAr:
      "شاشة Liquid Retina 10.9 بوصة ومعالج A14 Bionic ومنفذ USB-C. ممتاز للمدرسة ومشاهدة الأفلام ومكالمات الفيديو مع الكاميرا الأمامية الأفقية.",
    price: 1899,
    compareAt: 2099,
    stock: 15,
    images: [IMG.tabletDesk, IMG.tabletStylus, IMG.tabletDark],
    colors: [c("Silver", "فضي", "#DCDCDA"), c("Pink", "وردي", "#E7C8C5"), c("Blue", "أزرق", "#A9C3D6")],
    storages: ["64GB", "256GB"],
    specs: [
      s("Display", "الشاشة", "10.9\" Liquid Retina", "10.9 بوصة Liquid Retina"),
      s("Chipset", "المعالج", "A14 Bionic", "A14 Bionic"),
      s("Camera", "الكاميرا", "12MP wide · 12MP landscape front", "12 ميجابكسل خلفية وأمامية أفقية"),
      s("Battery", "البطارية", "Up to 10h", "حتى 10 ساعات"),
    ],
    deal: true,
  },
  {
    slug: "galaxy-tab-s9-fe",
    categorySlug: "tablets",
    brandSlug: "samsung",
    nameEn: "Galaxy Tab S9 FE",
    nameAr: "جالكسي تاب S9 FE",
    taglineEn: "S Pen in the box. IP68 body.",
    taglineAr: "قلم S Pen مرفق. مقاومة IP68.",
    descriptionEn:
      "A 10.9\" 90Hz display, bundled S Pen and water-resistant body. DeX turns it into a desktop for study sessions and light office work.",
    descriptionAr:
      "شاشة 10.9 بوصة بمعدل 90Hz وقلم S Pen مرفق وجسم مقاوم للماء. وضع DeX يحوله إلى مكتب للدراسة والعمل الخفيف.",
    price: 1699,
    stock: 12,
    images: [IMG.tabletDark, IMG.tabletHero, IMG.tabletDesk],
    colors: [c("Mint", "نعناعي", "#A8C7B8"), c("Gray", "رمادي", "#76787A"), c("Silver", "فضي", "#D5D7D9")],
    storages: ["128GB", "256GB"],
    specs: [
      s("Display", "الشاشة", "10.9\" WUXGA+ 90Hz", "10.9 بوصة WUXGA+ 90Hz"),
      s("Chipset", "المعالج", "Exynos 1380", "Exynos 1380"),
      s("Battery", "البطارية", "8000mAh · 45W", "8000 مللي أمبير · 45 واط"),
      s("Extras", "إضافات", "S Pen, IP68, Samsung DeX", "S Pen، IP68، Samsung DeX"),
    ],
  },
  {
    slug: "xiaomi-pad-6",
    categorySlug: "tablets",
    brandSlug: "xiaomi",
    nameEn: "Xiaomi Pad 6",
    nameAr: "شاومي باد 6",
    taglineEn: "144Hz entertainment machine",
    taglineAr: "جهاز ترفيه بشاشة 144Hz",
    descriptionEn:
      "A 11\" 144Hz display with Snapdragon 870 performance, quad speakers and a slim aluminium body. Unbeatable value for streaming and note taking.",
    descriptionAr:
      "شاشة 11 بوصة بمعدل 144Hz وأداء Snapdragon 870 وأربعة مكبرات صوت وجسم ألمنيوم نحيف. قيمة لا تُضاهى لمشاهدة المحتوى وتدوين الملاحظات.",
    price: 1199,
    compareAt: 1349,
    stock: 19,
    images: [IMG.tabletStylus, IMG.tabletDark, IMG.tabletHero],
    colors: [c("Gravity Gray", "رمادي", "#595B5E"), c("Mist Blue", "أزرق ضبابي", "#9DB6C4"), c("Champagne", "شامبانيا", "#D9C9A8")],
    storages: ["128GB", "256GB"],
    specs: [
      s("Display", "الشاشة", "11\" 2.8K 144Hz", "11 بوصة 2.8K 144Hz"),
      s("Chipset", "المعالج", "Snapdragon 870", "Snapdragon 870"),
      s("Battery", "البطارية", "8840mAh · 33W", "8840 مللي أمبير · 33 واط"),
      s("Audio", "الصوت", "Quad speakers Dolby Atmos", "أربعة مكبرات Dolby Atmos"),
    ],
    deal: true,
    isNew: true,
  },
  {
    slug: "airpods-pro-2",
    categorySlug: "audio",
    brandSlug: "apple",
    nameEn: "AirPods Pro (2nd gen, USB-C)",
    nameAr: "إير بودز برو (الجيل الثاني، USB-C)",
    taglineEn: "2x stronger noise cancellation",
    taglineAr: "إلغاء ضوضاء أقوى بمرتين",
    descriptionEn:
      "Adaptive Audio, Conversation Awareness and up to 6 hours of listening per charge. MagSafe USB-C case with a built-in speaker and lanyard loop.",
    descriptionAr:
      "صوت تكيفي وميزة الوعي بالمحادثة وحتى 6 ساعات استماع لكل شحنة. علبة MagSafe بمنفذ USB-C مع مكبر صوت وحلقة للتعليق.",
    price: 1099,
    compareAt: 1249,
    stock: 27,
    images: [IMG.earbuds, IMG.headphonesCase, IMG.earphonesFlat],
    colors: [c("White", "أبيض", "#F4F4F1")],
    storages: [],
    specs: [
      s("Driver", "المشغل", "Custom high-excursion Apple driver", "مشغل Apple مخصص عالي الإزاحة"),
      s("Noise control", "إلغاء الضوضاء", "Active Noise Cancellation · Transparency", "إلغاء ضوضاء نشط · وضع الشفافية"),
      s("Battery", "البطارية", "6h + 30h with case", "6 ساعات + 30 مع العلبة"),
      s("Resistance", "المقاومة", "IP54 buds, IP54 case", "IP54 للسماعات والعلبة"),
    ],
    featured: true,
    deal: true,
    badgeEn: "Editor's pick",
    badgeAr: "اختيار المحرر",
  },
  {
    slug: "sony-wh-1000xm5",
    categorySlug: "audio",
    brandSlug: "sony",
    nameEn: "Sony WH-1000XM5",
    nameAr: "سوني WH-1000XM5",
    taglineEn: "Silence, engineered",
    taglineAr: "الصمت بهندسة متقنة",
    descriptionEn:
      "Eight microphones and two processors deliver the class-leading noise cancellation. 30 hours of battery, multipoint pairing and a feather-light comfort band.",
    descriptionAr:
      "ثمانية ميكروفونات ومعالجان يقدمان أفضل إلغاء ضوضاء في فئته. بطارية 30 ساعة واقتران متعدد وحزام مريح فائق الخفة.",
    price: 1499,
    compareAt: 1699,
    stock: 10,
    images: [IMG.audioHero, IMG.headphonesWhite, IMG.headphonesCase],
    colors: [c("Midnight Black", "أسود", "#232325"), c("Platinum Silver", "فضي بلاتيني", "#D7D5D0")],
    storages: [],
    specs: [
      s("Battery", "البطارية", "30h · 3min charge for 3h", "30 ساعة · شحن 3 دقائق لـ3 ساعات"),
      s("Noise control", "إلغاء الضوضاء", "Auto NC Optimizer", "محسّن إلغاء الضوضاء التلقائي"),
      s("Codec", "الترميز", "LDAC, AAC, SBC", "LDAC، AAC، SBC"),
      s("Weight", "الوزن", "250g", "250 جرام"),
    ],
    featured: true,
  },
  {
    slug: "jbl-tune-770nc",
    categorySlug: "audio",
    brandSlug: "jbl",
    nameEn: "JBL Tune 770NC",
    nameAr: "جيه بي إل تيون 770NC",
    taglineEn: "JBL Pure Bass. 70-hour battery.",
    taglineAr: "باس جيه بي إل. بطارية 70 ساعة.",
    descriptionEn:
      "Adaptive noise cancelling with Smart Ambient, JBL Pure Bass sound and a massive 70-hour battery life. Foldable design for easy travel.",
    descriptionAr:
      "إلغاء ضوضاء تكيفي مع Smart Ambient وصوت Pure Bass وبطارية ضخمة تدوم 70 ساعة. تصميم قابل للطي لسهولة السفر.",
    price: 449,
    compareAt: 549,
    stock: 21,
    images: [IMG.headphonesWhite, IMG.headphonesStudio, IMG.audioHero],
    colors: [c("Black", "أسود", "#242426"), c("White", "أبيض", "#EFEEEB"), c("Blue", "أزرق", "#38507A")],
    storages: [],
    specs: [
      s("Battery", "البطارية", "70h (NC off) · 40h (NC on)", "70 ساعة بدون إلغاء الضوضاء"),
      s("Sound", "الصوت", "JBL Pure Bass 40mm drivers", "مشغلات 40 ملم JBL Pure Bass"),
      s("Bluetooth", "بلوتوث", "5.3 LE Audio, multipoint", "5.3 LE Audio ومتعدد الأجهزة"),
      s("Weight", "الوزن", "220g", "220 جرام"),
    ],
    deal: true,
  },
  {
    slug: "galaxy-buds3-pro",
    categorySlug: "audio",
    brandSlug: "samsung",
    nameEn: "Galaxy Buds3 Pro",
    nameAr: "جالكسي بودز3 برو",
    taglineEn: "Hi-Fi 24-bit sound with ANC",
    taglineAr: "صوت Hi-Fi 24 بت مع إلغاء ضوضاء",
    descriptionEn:
      "A dual-driver design with 24-bit Hi-Fi audio, adaptive ANC and blade lights. Seamless switching across Galaxy phones, tablets and laptops.",
    descriptionAr:
      "تصميم بمشغلين مزدوجين وصوت Hi-Fi 24 بت وإلغاء ضوضاء تكيفي وإضاءة Blade. تبديل سلس بين هواتف وأجهزة جالكسي اللوحية والحواسيب.",
    price: 799,
    stock: 18,
    images: [IMG.earbuds, IMG.headphonesStudio, IMG.earphonesFlat],
    colors: [c("Silver", "فضي", "#CFD2D4"), c("White", "أبيض", "#F2F1EE")],
    storages: [],
    specs: [
      s("Audio", "الصوت", "24-bit Hi-Fi, 2-way drivers", "Hi-Fi 24 بت بمشغلين"),
      s("Noise control", "إلغاء الضوضاء", "Adaptive ANC, voice detect", "إلغاء ضوضاء تكيفي"),
      s("Battery", "البطارية", "6h + 20h case", "6 ساعات + 20 مع العلبة"),
      s("Resistance", "المقاومة", "IP57", "IP57"),
    ],
    isNew: true,
  },
  {
    slug: "soundcore-life-q30",
    categorySlug: "audio",
    brandSlug: "soundcore",
    nameEn: "soundcore Life Q30",
    nameAr: "ساوندكور لايف Q30",
    taglineEn: "ANC luxury without the price tag",
    taglineAr: "إلغاء ضوضاء فاخر بسعر مناسب",
    descriptionEn:
      "Hybrid ANC with 40 hours of playtime, custom 40mm drivers and memory-foam ear cups. The go-to first pair of premium headphones.",
    descriptionAr:
      "إلغاء ضوضاء هجين مع 40 ساعة تشغيل ومشغلات 40 ملم مخصصة ووسائد إسفنجية مريحة. الخيار الأول للسماعات الفاخرة الأولى.",
    price: 299,
    compareAt: 359,
    stock: 34,
    images: [IMG.headphonesStudio, IMG.headphonesCase, IMG.headphonesWhite],
    colors: [c("Black", "أسود", "#222224"), c("Blue", "أزرق", "#38506E")],
    storages: [],
    specs: [
      s("Battery", "البطارية", "40h ANC playtime", "40 ساعة مع إلغاء الضوضاء"),
      s("Sound", "الصوت", "40mm dynamic drivers", "مشغلات ديناميكية 40 ملم"),
      s("Bluetooth", "بلوتوث", "5.0, multipoint", "5.0 متعدد الأجهزة"),
      s("Charging", "الشحن", "USB-C fast charge", "شحن سريع USB-C"),
    ],
    deal: true,
  },
  {
    slug: "jbl-charge-5",
    categorySlug: "audio",
    brandSlug: "jbl",
    nameEn: "JBL Charge 5",
    nameAr: "جيه بي إل تشارج 5",
    taglineEn: "Bold sound. Power-bank built in.",
    taglineAr: "صوت قوي. بنك طاقة مدمج.",
    descriptionEn:
      "Room-filling JBL Pro Sound, IP67 waterproofing and 20 hours of playtime. Charges your phone from the beach in Tajoura to the desert in Ghadames.",
    descriptionAr:
      "صوت JBL Pro يملأ المكان ومقاومة ماء IP67 و20 ساعة تشغيل. يشحن هاتفك من شاطئ تاجوراء إلى صحراء غدامس.",
    price: 699,
    stock: 14,
    images: [IMG.speaker, IMG.audioHero, IMG.headphonesWhite],
    colors: [c("Black", "أسود", "#242426"), c("Blue", "أزرق", "#2C5A8C"), c("Red", "أحمر", "#A33A32")],
    storages: [],
    specs: [
      s("Battery", "البطارية", "20h playtime · power bank", "20 ساعة · بنك طاقة"),
      s("Waterproof", "الماء", "IP67 dust and waterproof", "مقاومة غبار وماء IP67"),
      s("Sound", "الصوت", "JBL Pro Sound with racetrack driver", "صوت JBL Pro بمشغل بيضاوي"),
      s("Connectivity", "الاتصال", "Bluetooth 5.1, PartyBoost", "بلوتوث 5.1 وPartyBoost"),
    ],
    featured: true,
  },
  {
    slug: "apple-watch-series-9",
    categorySlug: "wearables",
    brandSlug: "apple",
    nameEn: "Apple Watch Series 9",
    nameAr: "آبل ووتش سيريس 9",
    taglineEn: "Smarter. Brighter. Mightier.",
    taglineAr: "أذكى. أكثر سطوعاً. أقوى.",
    descriptionEn:
      "The S9 SiP enables Double Tap and on-device Siri. A 2000-nit display, advanced health sensors and crash detection — with a recycled aluminium case.",
    descriptionAr:
      "شريحة S9 SiP تتيح النقر المزدوج وسيري على الجهاز. شاشة بسطوع 2000 شمعة ومستشعرات صحية متقدمة وكشف الحوادث — بعلبة ألمنيوم معاد التصنيع.",
    price: 1799,
    compareAt: 1999,
    stock: 13,
    images: [IMG.watch, IMG.phoneHero, IMG.devices],
    colors: [c("Midnight", "منتصف الليل", "#2C2C2E"), c("Starlight", "أبيض نجمي", "#E9E2D6"), c("Silver", "فضي", "#D9D9D6")],
    storages: ["41mm", "45mm"],
    specs: [
      s("Display", "الشاشة", "Always-On Retina 2000 nits", "Retina دائمة العرض 2000 شمعة"),
      s("Chip", "الشريحة", "S9 SiP with 4-core Neural Engine", "S9 SiP بمحرك عصبي رباعي"),
      s("Sensors", "المستشعرات", "ECG, blood oxygen, temperature", "تخطيط قلب وأكسجين وحرارة"),
      s("Battery", "البطارية", "Up to 18h, fast charge", "حتى 18 ساعة وشحن سريع"),
    ],
    featured: true,
  },
  {
    slug: "galaxy-watch6",
    categorySlug: "wearables",
    brandSlug: "samsung",
    nameEn: "Galaxy Watch6",
    nameAr: "جالكسي ووتش6",
    taglineEn: "Advanced sleep coaching on your wrist",
    taglineAr: "تدريب متقدم للنوم على معصمك",
    descriptionEn:
      "A slimmer bezel, brighter sapphire display and detailed sleep coaching. Body composition, ECG and heart-rate alerts keep your health in view.",
    descriptionAr:
      "إطار أنحف وشاشة سافير أكثر سطوعاً وتدريب مفصل على النوم. تحليل تكوين الجسم وتخطيط القلب وتنبيهات النبض تبقي صحتك تحت المراقبة.",
    price: 999,
    compareAt: 1149,
    stock: 17,
    images: [IMG.watch, IMG.tabletDark, IMG.devices],
    colors: [c("Graphite", "جرافيت", "#3A3A3C"), c("Gold", "ذهبي", "#D6B88A")],
    storages: ["40mm", "44mm"],
    specs: [
      s("Display", "الشاشة", "1.3\" Super AMOLED sapphire", "1.3 بوصة Super AMOLED سافير"),
      s("Sensors", "المستشعرات", "BioActive, ECG, BIA", "BioActive، ECG، BIA"),
      s("Battery", "البطارية", "425mAh · up to 40h", "425 مللي أمبير · حتى 40 ساعة"),
      s("OS", "النظام", "Wear OS 4 with One UI Watch", "Wear OS 4 مع One UI Watch"),
    ],
    deal: true,
  },
  {
    slug: "anker-65w-gan-charger",
    categorySlug: "accessories",
    brandSlug: "anker",
    nameEn: "Anker 65W GaN Charger",
    nameAr: "شاحن أنكر 65 واط GaN",
    taglineEn: "Charge laptop and phone together",
    taglineAr: "اشحن اللابتوب والهاتف معاً",
    descriptionEn:
      "Three ports (2× USB-C, 1× USB-A) with 65W total output. GaN II technology keeps it 40% smaller than a standard laptop charger.",
    descriptionAr:
      "ثلاثة منافذ (2 USB-C و1 USB-A) بقدرة إجمالية 65 واط. تقنية GaN II تجعله أصغر بنسبة 40% من شواحن الحواسيب التقليدية.",
    price: 149,
    compareAt: 179,
    stock: 40,
    images: [IMG.charger, IMG.cases, IMG.earphonesFlat],
    colors: [c("White", "أبيض", "#F1F0EC"), c("Black", "أسود", "#2A2A2C")],
    storages: [],
    specs: [
      s("Output", "القدرة", "65W max · 3 ports", "65 واط · 3 منافذ"),
      s("Technology", "التقنية", "GaN II, PowerIQ 4.0", "GaN II وPowerIQ 4.0"),
      s("Compatibility", "التوافق", "MacBook, iPad, iPhone, Android", "ماك بوك، آيباد، آيفون، أندرويد"),
      s("Warranty", "الضمان", "18 months", "18 شهراً"),
    ],
    deal: true,
  },
  {
    slug: "anker-maggo-power-bank",
    categorySlug: "accessories",
    brandSlug: "anker",
    nameEn: "Anker MagGo Power Bank 10K",
    nameAr: "بنك طاقة أنكر ماجو 10K",
    taglineEn: "MagSafe wireless, kickstand ready",
    taglineAr: "شحن لاسلكي ماغ سيف مع حامل",
    descriptionEn:
      "10,000mAh magnetic power bank with 15W Qi2 wireless charging, a fold-out kickstand and a USB-C port. Slim enough for a jacket pocket.",
    descriptionAr:
      "بنك طاقة مغناطيسي 10,000 مللي أمبير مع شحن لاسلكي Qi2 بقدرة 15 واط وحامل قابل للطي ومنفذ USB-C. نحيف بما يناسب جيب الجاكيت.",
    price: 249,
    stock: 25,
    images: [IMG.charger, IMG.phoneHero, IMG.cases],
    colors: [c("Black", "أسود", "#26262A"), c("White", "أبيض", "#F2F1EE")],
    storages: [],
    specs: [
      s("Capacity", "السعة", "10,000mAh", "10,000 مللي أمبير"),
      s("Wireless", "لاسلكي", "15W Qi2 MagSafe", "15 واط Qi2 ماغ سيف"),
      s("Output", "الخرج", "30W USB-C", "30 واط USB-C"),
      s("Extras", "إضافات", "Foldable kickstand, LED display", "حامل قابل للطي وشاشة LED"),
    ],
    isNew: true,
  },
  {
    slug: "spigen-ultra-hybrid-case",
    categorySlug: "accessories",
    brandSlug: "spigen",
    nameEn: "Spigen Ultra Hybrid Case",
    nameAr: "جراب سبايجن ألترا هايبرد",
    taglineEn: "Clear armour for your iPhone",
    taglineAr: "درع شفاف لآيفونك",
    descriptionEn:
      "Military-grade drop protection with a clear polycarbonate back and shock-absorbing TPU bumper. Air Cushion corners and a raised camera lip.",
    descriptionAr:
      "حماية عسكرية ضد السقوط بظهر شفاف من البولي كربونات وإطار TPU ممتص للصدمات. زوايا Air Cushion وحماية بارزة للكاميرا.",
    price: 69,
    compareAt: 89,
    stock: 60,
    images: [IMG.cases, IMG.blackPhone, IMG.earphonesFlat],
    colors: [c("Crystal Clear", "شفاف", "#DDE5E7"), c("Matte Black", "أسود مطفي", "#2B2B2D"), c("Frost", "فروست", "#C9CFD2")],
    storages: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15"],
    specs: [
      s("Material", "المادة", "PC back + TPU bumper", "ظهر PC وإطار TPU"),
      s("Protection", "الحماية", "MIL-STD 810G drop tested", "مختبر ضد السقوط MIL-STD 810G"),
      s("Compatibility", "التوافق", "iPhone 15 series", "سلسلة آيفون 15"),
      s("Extras", "إضافات", "MagSafe compatible ring", "حلقة متوافقة مع ماغ سيف"),
    ],
    deal: true,
  },
  {
    slug: "baseus-100w-usb-c-cable",
    categorySlug: "accessories",
    brandSlug: "baseus",
    nameEn: "Baseus 100W USB-C Cable",
    nameAr: "كابل بيسوس USB-C 100 واط",
    taglineEn: "Braided, 2m, charge anything",
    taglineAr: "مضفور، 2 متر، اشحن كل شيء",
    descriptionEn:
      "A 100W nylon-braided USB-C to USB-C cable with a zinc alloy shell and a 10,000-bend lifespan. Includes a Velcro tie for tidy bags.",
    descriptionAr:
      "كابل USB-C إلى USB-C بقدرة 100 واط مضفور بالنايلون بهيكل من سبائك الزنك وعمر افتراضي 10,000 انثناء. يأتي بحزام فيلكرو لترتيب الحقيبة.",
    price: 45,
    stock: 80,
    images: [IMG.charger, IMG.devices, IMG.cases],
    colors: [c("Black", "أسود", "#26262A"), c("White", "أبيض", "#F0EFEB")],
    storages: ["1m", "2m"],
    specs: [
      s("Power", "الطاقة", "100W PD 5A", "100 واط PD 5A"),
      s("Length", "الطول", "1m or 2m", "1 أو 2 متر"),
      s("Build", "التصنيع", "Nylon braid, zinc alloy", "نايلون مضفور وسبائك زنك"),
      s("Data", "البيانات", "480Mbps", "480 ميجابت"),
    ],
  },
  {
    slug: "sandisk-usb-c-drive-128gb",
    categorySlug: "accessories",
    brandSlug: "sandisk",
    nameEn: "SanDisk 128GB USB-C Drive",
    nameAr: "ذاكرة سانديسك 128 جيجابايت USB-C",
    taglineEn: "Move files at 400MB/s",
    taglineAr: "انقل ملفاتك بسرعة 400 ميجابايت/ث",
    descriptionEn:
      "A dual USB-C and USB-A flash drive with 400MB/s read speeds and a keyring loop. Perfect for moving photos from your phone to your laptop.",
    descriptionAr:
      "ذاكرة فلاش بمنفذي USB-C وUSB-A بسرعة قراءة 400 ميجابايت/ثانية وحلقة للمفاتيح. مثالية لنقل الصور من الهاتف إلى الحاسوب.",
    price: 89,
    stock: 45,
    images: [IMG.usbDrive, IMG.devices, IMG.charger],
    colors: [c("Black", "أسود", "#232325")],
    storages: ["64GB", "128GB", "256GB"],
    specs: [
      s("Capacity", "السعة", "128GB", "128 جيجابايت"),
      s("Speed", "السرعة", "400MB/s read", "قراءة 400 ميجابايت/ث"),
      s("Interface", "المنفذ", "USB-C + USB-A", "USB-C + USB-A"),
      s("Warranty", "الضمان", "2 years", "سنتان"),
    ],
    isNew: true,
  },
];

export type ReviewTemplate = {
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  lang: "en" | "ar";
  daysAgo: number;
};

const authors: { name: string; city: string }[] = [
  { name: "Ahmed Al-Mansouri", city: "Tripoli" },
  { name: "Salma Ben Ashour", city: "Tripoli" },
  { name: "Yousef Al-Turki", city: "Misrata" },
  { name: "Nour Al-Zawawi", city: "Tripoli" },
  { name: "Mohamed Al-Sharif", city: "Benghazi" },
  { name: "Fatima Al-Baruni", city: "Zawiya" },
  { name: "Khaled Al-Werfalli", city: "Tripoli" },
  { name: "Hala Al-Jehani", city: "Janzur" },
  { name: "Anas Al-Misrati", city: "Misrata" },
  { name: "Rania Al-Obeidi", city: "Tripoli" },
  { name: "Omar Al-Ghariani", city: "Gharian" },
  { name: "Sara Al-Fituri", city: "Tripoli" },
  { name: "Tarek Al-Zintani", city: "Zintan" },
  { name: "Amal Al-Suwayhli", city: "Tripoli" },
  { name: "Bilal Al-Kabti", city: "Sabratha" },
];

const enReviews = [
  ["Fast delivery to Tripoli", "Ordered in the morning and it arrived at my door in Hay Al-Andalus before sunset. Sealed box, original charger and the warranty card was stamped. Very professional team."],
  ["Exactly as described", "The photos on the site are honest — the colour and finish are gorgeous in person. Battery easily lasts a full busy day of calls and camera use."],
  ["Great value from MyPhone", "I compared prices in three shops in Tripoli and this was the best deal. They even helped me transfer my data from the old phone at no charge."],
  ["Worth every dinar", "Premium feel, excellent screen and the camera is a huge upgrade. Support answered my WhatsApp questions within minutes."],
  ["Second purchase here", "Bought my previous device from MyPhone two years ago and came back. Same honest service, genuine products and a proper receipt."],
  ["Smooth, hassle-free order", "Paid cash on delivery and inspected everything before paying. The team was patient and friendly. Highly recommended."],
  ["Perfect for my daily work", "Battery life and signal strength in Tripoli are excellent. Calls are clear even in the old city where coverage is patchy."],
  ["A genuine upgrade", "Speed, display quality and audio are all noticeably better than my previous device. The packaging was untouched and factory sealed."],
];

const arReviews = [
  ["توصيل سريع إلى طرابلس", "طلبت الجهاز صباحاً ووصل إلى باب المنزل في حي الأندلس قبل المغرب. العلبة مغلقة والشاحن أصلي وبطاقة الضمان مختومة. فريق محترم جداً."],
  ["كما هو موصوف تماماً", "الصور في الموقع صادقة، واللون والتشطيب أجمل على الطبيعة. البطارية تكفي يوم عمل كامل من المكالمات والتصوير."],
  ["قيمة ممتازة من ماي فون", "قارنت الأسعار في ثلاثة محلات في طرابلس وهذا كان أفضل عرض. ساعدوني في نقل البيانات من الهاتف القديم بدون مقابل."],
  ["يستحق كل دينار", "إحساس فاخر وشاشة رائعة والكاميرا تطوير كبير. فريق الدعم رد على أسئلتي في واتساب في دقائق."],
  ["ثاني عملية شراء", "اشتريت جهازي السابق من ماي فون قبل سنتين وعدت مرة أخرى. نفس الخدمة الصادقة والمنتجات الأصلية وفاتورة رسمية."],
  ["تجربة سهلة ومريحة", "دفعت نقداً عند الاستلام وفحصت الجهاز قبل الدفع. الفريق صبور وودود. أنصح به بشدة."],
  ["ممتاز لعملي اليومي", "البطارية وقوة الإشارة في طرابلس ممتازة. المكالمات واضحة حتى في المدينة القديمة حيث التغطية ضعيفة."],
];

export function buildReviewTemplates(): ReviewTemplate[] {
  const templates: ReviewTemplate[] = [];
  for (let i = 0; i < enReviews.length; i += 1) {
    templates.push({
      author: authors[i % authors.length].name,
      city: authors[i % authors.length].city,
      rating: i % 6 === 4 ? 4 : 5,
      title: enReviews[i][0],
      body: enReviews[i][1],
      lang: "en",
      daysAgo: 4 + i * 9,
    });
  }
  for (let i = 0; i < arReviews.length; i += 1) {
    templates.push({
      author: authors[(i + 8) % authors.length].name,
      city: authors[(i + 8) % authors.length].city,
      rating: i % 5 === 3 ? 4 : 5,
      title: arReviews[i][0],
      body: arReviews[i][1],
      lang: "ar",
      daysAgo: 7 + i * 11,
    });
  }
  return templates;
}
