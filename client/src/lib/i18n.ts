export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // App Name
  appName: {
    en: "Family Nesting",
    ar: "Family Nesting"
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
  },

  // Real-time sync translations
  connectedToRealTimeSync: {
    en: "Connected to real-time sync",
    ar: "متصل بالمزامنة الفورية"
  },
  realTimeSync: {
    en: "Real-time",
    ar: "فوري"
  },
  offline: {
    en: "Offline",
    ar: "غير متصل"
  },
  connected: {
    en: "Connected",
    ar: "متصل"
  },
  disconnected: {
    en: "Disconnected",
    ar: "غير متصل"
  },
  reconnecting: {
    en: "Reconnecting",
    ar: "جارٍ إعادة الاتصال"
  },
  attemptingToReconnect: {
    en: "Attempting to reconnect to real-time sync",
    ar: "محاولة إعادة الاتصال بالمزامنة الفورية"
  },
  alreadyConnected: {
    en: "Already connected",
    ar: "متصل بالفعل"
  },
  realTimeSyncActive: {
    en: "Real-time sync is active",
    ar: "المزامنة الفورية نشطة"
  },
  recipeAdded: {
    en: "Recipe added",
    ar: "تمت إضافة وصفة"
  },
  newRecipeAvailable: {
    en: "A new recipe is now available",
    ar: "وصفة جديدة متاحة الآن"
  },
  recipeUpdated: {
    en: "Recipe updated",
    ar: "تم تحديث الوصفة"
  },
  recipeHasBeenModified: {
    en: "A recipe has been modified",
    ar: "تم تعديل وصفة"
  },
  recipeHasBeenRemoved: {
    en: "A recipe has been removed",
    ar: "تم إزالة وصفة"
  },
  newShoppingItemAdded: {
    en: "A new shopping item has been added",
    ar: "تمت إضافة عنصر جديد لقائمة التسوق"
  },
  itemUpdated: {
    en: "Item updated",
    ar: "تم تحديث العنصر"
  },
  shoppingItemModified: {
    en: "A shopping item has been modified",
    ar: "تم تعديل عنصر في قائمة التسوق"
  },
  shoppingItemRemoved: {
    en: "A shopping item has been removed",
    ar: "تم إزالة عنصر من قائمة التسوق"
  },
  itemToggled: {
    en: "Item toggled",
    ar: "تم تغيير حالة العنصر"
  },
  shoppingItemStatusChanged: {
    en: "Shopping item status has been changed",
    ar: "تم تغيير حالة عنصر في قائمة التسوق"
  },
  allCompletedItemsRemoved: {
    en: "All completed items have been removed",
    ar: "تم إزالة جميع العناصر المكتملة"
  },
  newPantryItemAdded: {
    en: "A new pantry item has been added",
    ar: "تمت إضافة عنصر جديد للمخزن"
  },
  pantryItemModified: {
    en: "A pantry item has been modified",
    ar: "تم تعديل عنصر في المخزن"
  },
  pantryItemRemoved: {
    en: "A pantry item has been removed",
    ar: "تم إزالة عنصر من المخزن"
  },

  // PWA Installation
  installApp: {
    en: "Install App",
    ar: "تثبيت التطبيق"
  },
  installAppDescription: {
    en: "Install our app for a better experience with offline access and notifications",
    ar: "ثبت تطبيقنا للحصول على تجربة أفضل مع الوصول بدون إنترنت والإشعارات"
  },
  install: {
    en: "Install",
    ar: "تثبيت"
  },
  later: {
    en: "Later", 
    ar: "لاحقاً"
  },
  appInstalled: {
    en: "App Installed",
    ar: "تم تثبيت التطبيق"
  },
  appInstalledSuccessfully: {
    en: "App has been installed successfully! You can now access it from your home screen.",
    ar: "تم تثبيت التطبيق بنجاح! يمكنك الآن الوصول إليه من الشاشة الرئيسية."
  },

  // Rating System
  ratingUpdated: {
    en: "Rating Updated",
    ar: "تم تحديث التقييم"
  },
  ratingUpdatedSuccessfully: {
    en: "Recipe rating has been updated successfully",
    ar: "تم تحديث تقييم الوصفة بنجاح"
  },
  failedToUpdateRating: {
    en: "Failed to update rating. Please try again.",
    ar: "فشل في تحديث التقييم. يرجى المحاولة مرة أخرى."
  },

  // Sharing
  shared: {
    en: "Shared",
    ar: "تم المشاركة"
  },
  recipeSharedSuccessfully: {
    en: "Recipe shared successfully",
    ar: "تم مشاركة الوصفة بنجاح"
  },
  copied: {
    en: "Copied",
    ar: "تم النسخ"
  },
  linkCopiedToClipboard: {
    en: "Recipe link copied to clipboard",
    ar: "تم نسخ رابط الوصفة إلى الحافظة"
  },
  failedToShare: {
    en: "Failed to share recipe. Please try again.",
    ar: "فشل في مشاركة الوصفة. يرجى المحاولة مرة أخرى."
  },
  checkOutThisRecipe: {
    en: "Check out this recipe",
    ar: "اطلع على هذه الوصفة"
  },
  share: {
    en: "Share",
    ar: "مشاركة"
  },

  // Image Upload
  recipeImagesUpload: {
    en: "Recipe Images",
    ar: "صور الوصفة"
  },
  images: {
    en: "images",
    ar: "صور"
  },
  addImage: {
    en: "Add Image",
    ar: "إضافة صورة"
  },
  maxImagesExceeded: {
    en: "Maximum number of images exceeded",
    ar: "تم تجاوز العدد الأقصى للصور"
  },
  pleaseSelectImageFiles: {
    en: "Please select image files only",
    ar: "يرجى اختيار ملفات الصور فقط"
  },
  fileTooLarge: {
    en: "File size too large. Maximum 5MB per image.",
    ar: "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت للصورة الواحدة."
  },
  imagesUploadedSuccessfully: {
    en: "Images uploaded successfully",
    ar: "تم رفع الصور بنجاح"
  },
  failedToUploadImages: {
    en: "Failed to upload images. Please try again.",
    ar: "فشل في رفع الصور. يرجى المحاولة مرة أخرى."
  },
  imageUploadInfo: {
    en: "Upload up to 5 images. Supported formats: JPG, PNG, GIF. Max 5MB per image.",
    ar: "ارفع حتى 5 صور. الصيغ المدعومة: JPG, PNG, GIF. حد أقصى 5 ميجابايت للصورة."
  },

  // Email Sync
  setupEmailSync: {
    en: "Setup Email Sync",
    ar: "إعداد المزامنة بالإيميل"
  },
  emailSyncDescription: {
    en: "Connect with your family members to sync recipes, shopping lists, and pantry items across all devices.",
    ar: "اتصل مع أفراد عائلتك لمزامنة الوصفات وقوائم التسوق والمؤن عبر جميع الأجهزة."
  },
  yourEmail: {
    en: "Your Email",
    ar: "إيميلك"
  },
  yourName: {
    en: "Your Name",
    ar: "اسمك"
  },
  setupAccount: {
    en: "Setup Account",
    ar: "إعداد الحساب"
  },
  userCreatedSuccessfully: {
    en: "Account created successfully",
    ar: "تم إنشاء الحساب بنجاح"
  },
  failedToCreateUser: {
    en: "Failed to create account",
    ar: "فشل في إنشاء الحساب"
  },
  familySync: {
    en: "Family Sync",
    ar: "مزامنة العائلة"
  },

  addToShoppingList: {
    en: "Add to Shopping List",
    ar: "إضافة لقائمة التسوق"
  },
  ingredientsAddedToShoppingList: {
    en: "Ingredients added to shopping list",
    ar: "تمت إضافة المكونات لقائمة التسوق"
  },
  failedToAddToShoppingList: {
    en: "Failed to add to shopping list",
    ar: "فشل في إضافة لقائمة التسوق"
  },
  vegetables: {
    en: "Vegetables",
    ar: "خضار"
  },
  fruits: {
    en: "Fruits",
    ar: "فواكه"
  },
  grains: {
    en: "Grains",
    ar: "حبوب"
  },
  beverages: {
    en: "Beverages",
    ar: "مشروبات"
  },
  listView: {
    en: "List View",
    ar: "عرض قائمة"
  },
  groupedView: {
    en: "Grouped View",
    ar: "عرض مجمع"
  },
  notConnected: {
    en: "Not Connected",
    ar: "غير متصل"
  },
  members: {
    en: "members",
    ar: "أعضاء"
  },
  familyMembers: {
    en: "Family Members",
    ar: "أفراد العائلة"
  },
  setupFamilySync: {
    en: "Setup Family Sync",
    ar: "إعداد مزامنة العائلة"
  },
  createNewFamily: {
    en: "Create New Family",
    ar: "إنشاء عائلة جديدة"
  },
  familyGroupName: {
    en: "Family Group Name",
    ar: "اسم مجموعة العائلة"
  },
  createFamily: {
    en: "Create Family",
    ar: "إنشاء العائلة"
  },
  familyGroupCreated: {
    en: "Family group created successfully",
    ar: "تم إنشاء مجموعة العائلة بنجاح"
  },
  failedToCreateFamilyGroup: {
    en: "Failed to create family group",
    ar: "فشل في إنشاء مجموعة العائلة"
  },
  or: {
    en: "OR",
    ar: "أو"
  },
  joinExistingFamily: {
    en: "Join Existing Family",
    ar: "انضم لعائلة موجودة"
  },
  inviteCode: {
    en: "Invite Code",
    ar: "رمز الدعوة"
  },
  joinFamily: {
    en: "Join Family",
    ar: "انضم للعائلة"
  },
  joinedFamilyGroup: {
    en: "Successfully joined family group",
    ar: "تم الانضمام لمجموعة العائلة بنجاح"
  },
  failedToJoinFamilyGroup: {
    en: "Failed to join family group",
    ar: "فشل في الانضمام لمجموعة العائلة"
  },
  inviteCodeCopied: {
    en: "Invite code copied to clipboard",
    ar: "تم نسخ رمز الدعوة للحافظة"
  },
  pleaseEnterEmailAndName: {
    en: "Please enter both email and name",
    ar: "يرجى إدخال الإيميل والاسم"
  }
};

export function getTranslation(key: string, language: 'en' | 'ar'): string {
  return translations[key]?.[language] || key;
}
