export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // App Name
  appName: {
    en: "Awad & Alaa Kitchen",
    ar: "مطبخ عوض وآلاء"
  },
  
  // Navigation
  recipes: {
    en: "Recipes",
    ar: "الوصفات"
  },
  addRecipe: {
    en: "Add Recipe",
    ar: "إضافة وصفة"
  },
  categories: {
    en: "Categories",
    ar: "التصنيفات"
  },
  myFavorites: {
    en: "My Favorites",
    ar: "المفضلة"
  },
  
  // Search and Filters
  searchRecipes: {
    en: "Search Recipes",
    ar: "البحث في الوصفات"
  },
  searchPlaceholder: {
    en: "Search by name, ingredients, or country...",
    ar: "البحث بالاسم أو المقادير أو البلد..."
  },
  country: {
    en: "Country",
    ar: "البلد"
  },
  allCountries: {
    en: "All Countries",
    ar: "جميع البلدان"
  },
  serving: {
    en: "Serving",
    ar: "التقديم"
  },
  all: {
    en: "All",
    ar: "الكل"
  },
  hot: {
    en: "Hot",
    ar: "ساخن"
  },
  cold: {
    en: "Cold",
    ar: "بارد"
  },
  roomTemp: {
    en: "Room Temperature",
    ar: "درجة حرارة الغرفة"
  },
  
  // Recipe Details
  viewRecipe: {
    en: "View Recipe",
    ar: "عرض الوصفة"
  },
  editRecipe: {
    en: "Edit Recipe",
    ar: "تعديل الوصفة"
  },
  deleteRecipe: {
    en: "Delete Recipe",
    ar: "حذف الوصفة"
  },
  addToFavorites: {
    en: "Add to Favorites",
    ar: "إضافة للمفضلة"
  },
  shareRecipe: {
    en: "Share Recipe",
    ar: "مشاركة الوصفة"
  },
  
  // Recipe Form
  addNewRecipe: {
    en: "Add New Recipe",
    ar: "إضافة وصفة جديدة"
  },
  recipeNameEn: {
    en: "Recipe Name (English)",
    ar: "اسم الوصفة (الإنجليزية)"
  },
  recipeNameAr: {
    en: "Recipe Name (Arabic)",
    ar: "اسم الوصفة (العربية)"
  },
  countryOfOrigin: {
    en: "Country of Origin",
    ar: "بلد المنشأ"
  },
  servingTemperature: {
    en: "Serving Temperature",
    ar: "درجة حرارة التقديم"
  },
  calories: {
    en: "Calories (per serving)",
    ar: "السعرات الحرارية (لكل حصة)"
  },
  prepTime: {
    en: "Preparation Time (minutes)",
    ar: "وقت التحضير (بالدقائق)"
  },
  recipeImages: {
    en: "Recipe Images",
    ar: "صور الوصفة"
  },
  videoTutorial: {
    en: "Video Tutorial URL",
    ar: "رابط فيديو الشرح"
  },
  ingredients: {
    en: "Ingredients",
    ar: "المقادير"
  },
  instructions: {
    en: "Instructions",
    ar: "طريقة التحضير"
  },
  instructionsEn: {
    en: "Preparation Instructions (English)",
    ar: "طريقة التحضير (الإنجليزية)"
  },
  instructionsAr: {
    en: "Preparation Instructions (Arabic)",
    ar: "طريقة التحضير (العربية)"
  },
  requiredTools: {
    en: "Required Tools & Equipment",
    ar: "الأدوات والمعدات المطلوبة"
  },
  additionalLinks: {
    en: "Additional Links",
    ar: "روابط إضافية"
  },
  
  // Categories
  breakfast: {
    en: "Breakfast",
    ar: "فطار"
  },
  lunch: {
    en: "Lunch",
    ar: "غداء"
  },
  dinner: {
    en: "Dinner",
    ar: "عشاء"
  },
  snack: {
    en: "Snack",
    ar: "وجبة خفيفة"
  },
  dessert: {
    en: "Dessert",
    ar: "حلويات"
  },
  drink: {
    en: "Drink",
    ar: "مشروبات"
  },
  
  // Countries
  egypt: {
    en: "Egypt",
    ar: "مصر"
  },
  lebanon: {
    en: "Lebanon",
    ar: "لبنان"
  },
  syria: {
    en: "Syria",
    ar: "سوريا"
  },
  morocco: {
    en: "Morocco",
    ar: "المغرب"
  },
  italy: {
    en: "Italy",
    ar: "إيطاليا"
  },
  france: {
    en: "France",
    ar: "فرنسا"
  },
  india: {
    en: "India",
    ar: "الهند"
  },
  mexico: {
    en: "Mexico",
    ar: "المكسيك"
  },
  greece: {
    en: "Greece",
    ar: "اليونان"
  },
  turkey: {
    en: "Turkey",
    ar: "تركيا"
  },
  
  // Common Actions
  save: {
    en: "Save",
    ar: "حفظ"
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء"
  },
  delete: {
    en: "Delete",
    ar: "حذف"
  },
  edit: {
    en: "Edit",
    ar: "تعديل"
  },
  add: {
    en: "Add",
    ar: "إضافة"
  },
  remove: {
    en: "Remove",
    ar: "إزالة"
  },
  
  // Messages
  recipeDeleted: {
    en: "Recipe deleted successfully",
    ar: "تم حذف الوصفة بنجاح"
  },
  recipeSaved: {
    en: "Recipe saved successfully",
    ar: "تم حفظ الوصفة بنجاح"
  },
  errorOccurred: {
    en: "An error occurred",
    ar: "حدث خطأ"
  },
  noRecipesFound: {
    en: "No recipes found",
    ar: "لم يتم العثور على وصفات"
  },
  
  // Placeholders
  enterRecipeNameEn: {
    en: "Enter recipe name in English",
    ar: "أدخل اسم الوصفة بالإنجليزية"
  },
  enterRecipeNameAr: {
    en: "Enter recipe name in Arabic",
    ar: "أدخل اسم الوصفة بالعربية"
  },
  selectCountry: {
    en: "Select Country",
    ar: "اختر البلد"
  },
  selectTemperature: {
    en: "Select Temperature",
    ar: "اختر درجة الحرارة"
  },
  selectCategory: {
    en: "Select Category",
    ar: "اختر التصنيف"
  },
  dragDropImages: {
    en: "Drag and drop images here, or click to browse",
    ar: "اسحب وأفلت الصور هنا، أو انقر للتصفح"
  },
  chooseFiles: {
    en: "Choose Files",
    ar: "اختر الملفات"
  },
  stepByStepEn: {
    en: "Step-by-step instructions in English...",
    ar: "تعليمات التحضير خطوة بخطوة بالإنجليزية..."
  },
  stepByStepAr: {
    en: "Step-by-step instructions in Arabic...",
    ar: "تعليمات التحضير خطوة بخطوة بالعربية..."
  },
  
  // Quick Info
  quickInfo: {
    en: "Quick Info",
    ar: "معلومات سريعة"
  },
  toolsRequired: {
    en: "Tools Required",
    ar: "الأدوات المطلوبة"
  }
};

export function getTranslation(key: string, language: 'en' | 'ar'): string {
  return translations[key]?.[language] || key;
}
