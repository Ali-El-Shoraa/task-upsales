// مساعدات للتعامل مع الصور

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.startsWith("http") ||
    url.startsWith("data:image/") ||
    url.startsWith("/")
  );
};

export const getImageSize = (base64: string): number => {
  if (!base64.startsWith("data:")) return 0;
  // تقدير حجم base64 بالبايت
  return Math.round(base64.length * 0.75);
};

export const formatImageSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i)) + " " + sizes[i];
};

export const compressBase64Image = (
  base64: string,
  maxWidth = 800,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("فشل في إنشاء canvas"));
        return;
      }

      let { width, height } = img;

      // تقليل الأبعاد مع الحفاظ على النسبة
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // رسم الصورة
      ctx.drawImage(img, 0, 0, width, height);

      // تحديد نوع الصورة والجودة
      const mimeType = base64.split(";")[0].split(":")[1] || "image/jpeg";
      const compressedBase64 = canvas.toDataURL(mimeType, quality);

      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error("فشل في تحميل الصورة"));
    };

    img.src = base64;
  });
};
