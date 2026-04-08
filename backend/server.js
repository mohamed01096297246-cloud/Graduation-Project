require("dotenv").config(); // 1. تأكد إنها في أول سطر لتحميل المتغيرات البيئية
const app = require("./app");
const connectDB = require("./src/config/db");

// دالة لبدء السيرفر بشكل منظم
const startServer = async () => {
  try {
    // 2. انتظر الاتصال بالداتا بيز أولاً قبل تشغيل السيرفر
    await connectDB();
    console.log("📂 Database connection established...");

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is flying on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // 3. معالجة الأخطاء غير المتوقعة (للأمان الشديد)
    process.on("unhandledRejection", (err) => {
      console.log(`❌ Error: ${err.message}`);
      // إغلاق السيرفر بشكل نظيف في حالة وقوع خطأ كارثي
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("💥 Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();