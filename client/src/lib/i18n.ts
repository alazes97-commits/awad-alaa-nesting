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
  },

  // Shopping List
  shoppingList: {
    en: "Shopping List",
    ar: "قائمة التسوق"
  },
  addToShoppingList: {
    en: "Add to Shopping List",
    ar: "إضافة لقائمة التسوق"
  },
  shoppingListEmpty: {
    en: "Your shopping list is empty",
    ar: "قائمة التسوق فارغة"
  },
  markCompleted: {
    en: "Mark as Completed",
    ar: "تحديد كمكتمل"
  },
  markIncomplete: {
    en: "Mark as Incomplete", 
    ar: "تحديد كغير مكتمل"
  },
  clearCompleted: {
    en: "Clear Completed Items",
    ar: "مسح العناصر المكتملة"
  },
  addShoppingItem: {
    en: "Add Shopping Item",
    ar: "إضافة عنصر للتسوق"
  },

  // Pantry
  pantry: {
    en: "Pantry",
    ar: "المؤن"
  },
  myPantry: {
    en: "My Pantry",
    ar: "مؤنتي"
  },
  addToPantry: {
    en: "Add to Pantry",
    ar: "إضافة للمؤن"
  },
  pantryEmpty: {
    en: "Your pantry is empty",
    ar: "المؤن فارغة"
  },
  expiryDate: {
    en: "Expiry Date",
    ar: "تاريخ الانتهاء"
  },
  location: {
    en: "Location",
    ar: "المكان"
  },
  minimumStock: {
    en: "Minimum Stock",
    ar: "الحد الأدنى للمخزون"
  },
  lowStock: {
    en: "Low Stock Alert",
    ar: "تنبيه نقص المخزون"
  },
  expiringSoon: {
    en: "Expiring Soon",
    ar: "ينتهي قريباً"
  },
  addPantryItem: {
    en: "Add Pantry Item",
    ar: "إضافة عنصر للمؤن"
  },

  // Common Fields
  itemName: {
    en: "Item Name",
    ar: "اسم العنصر"
  },
  itemNameEn: {
    en: "Item Name (English)",
    ar: "اسم العنصر (الإنجليزية)"
  },
  itemNameAr: {
    en: "Item Name (Arabic)",
    ar: "اسم العنصر (العربية)"
  },
  quantity: {
    en: "Quantity",
    ar: "الكمية"
  },
  unit: {
    en: "Unit",
    ar: "الوحدة"
  },
  notes: {
    en: "Notes",
    ar: "ملاحظات"
  },
  
  // Units
  kg: {
    en: "Kilogram",
    ar: "كيلوغرام"
  },
  gram: {
    en: "Gram",
    ar: "غرام"
  },
  cup: {
    en: "Cup",
    ar: "كوب"
  },
  piece: {
    en: "Piece",
    ar: "قطعة"
  },
  liter: {
    en: "Liter",
    ar: "لتر"
  },
  tablespoon: {
    en: "Tablespoon",
    ar: "ملعقة كبيرة"
  },
  teaspoon: {
    en: "Teaspoon",
    ar: "ملعقة صغيرة"
  },

  // Storage Locations
  fridge: {
    en: "Refrigerator",
    ar: "الثلاجة"
  },
  freezer: {
    en: "Freezer",
    ar: "الفريزر"
  },
  pantryLocation: {
    en: "Pantry",
    ar: "المؤن"
  },
  cabinet: {
    en: "Cabinet",
    ar: "الخزانة"
  },

  // Food Categories
  vegetables: {
    en: "Vegetables",
    ar: "خضروات"
  },
  fruits: {
    en: "Fruits",
    ar: "فواكه"
  },
  meat: {
    en: "Meat",
    ar: "لحوم"
  },
  dairy: {
    en: "Dairy",
    ar: "ألبان"
  },
  grains: {
    en: "Grains",
    ar: "حبوب"
  },
  spices: {
    en: "Spices",
    ar: "بهارات"
  },
  beverages: {
    en: "Beverages",
    ar: "مشروبات"
  },
  other: {
    en: "Other",
    ar: "أخرى"
  },

  // Sync Features
  sync: {
    en: "Sync",
    ar: "مزامنة"
  },
  syncData: {
    en: "Sync Data",
    ar: "مزامنة البيانات"
  },
  lastSynced: {
    en: "Last Synced",
    ar: "آخر مزامنة"
  },
  syncSuccessful: {
    en: "Data synced successfully",
    ar: "تم مزامنة البيانات بنجاح"
  },
  syncFailed: {
    en: "Sync failed",
    ar: "فشلت المزامنة"
  },
  autoSync: {
    en: "Auto Sync",
    ar: "مزامنة تلقائية"
  },
  syncInProgress: {
    en: "Syncing...",
    ar: "جارٍ المزامنة..."
  },

  // Additional translations for shopping and pantry
  success: {
    en: "Success",
    ar: "نجح"
  },
  itemAdded: {
    en: "Item added successfully",
    ar: "تم إضافة العنصر بنجاح"
  },
  failedToAddItem: {
    en: "Failed to add item",
    ar: "فشل في إضافة العنصر"
  },
  itemDeleted: {
    en: "Item deleted successfully",
    ar: "تم حذف العنصر بنجاح"
  },
  completedItemsCleared: {
    en: "Completed items cleared successfully",
    ar: "تم مسح العناصر المكتملة بنجاح"
  },
  loading: {
    en: "Loading",
    ar: "جارٍ التحميل"
  },
  pending: {
    en: "Pending",
    ar: "معلقة"
  },
  completed: {
    en: "Completed",
    ar: "مكتملة"
  },
  more: {
    en: "more",
    ar: "المزيد"
  },

  // Additional sync translations
  dataUpdated: {
    en: "Data has been updated",
    ar: "تم تحديث البيانات"
  },
  tryAgainLater: {
    en: "Please try again later",
    ar: "يرجى المحاولة مرة أخرى لاحقاً"
  },
  autoSyncEnabled: {
    en: "Auto sync enabled",
    ar: "تم تفعيل المزامنة التلقائية"
  },
  autoSyncDisabled: {
    en: "Auto sync disabled",
    ar: "تم إيقاف المزامنة التلقائية"
  },
  dataWillSyncAutomatically: {
    en: "Data will sync automatically every 5 minutes",
    ar: "ستتم مزامنة البيانات تلقائياً كل 5 دقائق"
  },
  manualSyncOnly: {
    en: "Manual sync only",
    ar: "مزامنة يدوية فقط"
  },
  justNow: {
    en: "Just now",
    ar: "الآن"
  },
  minutesAgo: {
    en: "m ago",
    ar: "د مضت"
  },
  hoursAgo: {
    en: "h ago",
    ar: "س مضت"
  },
  never: {
    en: "Never",
    ar: "أبداً"
  },
  disableAutoSync: {
    en: "Disable auto sync",
    ar: "إيقاف المزامنة التلقائية"
  },
  enableAutoSync: {
    en: "Enable auto sync",
    ar: "تفعيل المزامنة التلقائية"
  },
  manual: {
    en: "Manual",
    ar: "يدوي"
  }
};

export function getTranslation(key: string, language: 'en' | 'ar'): string {
  return translations[key]?.[language] || key;
}
