import path from "path";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./firebase.js";

export const FirebaseService = {
  getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
    };
    return mimeTypes[ext] || "application/octet-stream";
  },

  async uploadFile(fileBuffer, fileName, folder) {
    if (!fileBuffer || !fileName) throw new Error("Файл не передано!");

    const uniqueName = `${uuidv4()}_${fileName}`;
    const filePath = `${folder}/${uniqueName}`;

    const file = storage.file(filePath);

    await file.save(fileBuffer, {
      metadata: {
        contentType: this.getContentType(fileName),
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    return filePath; // Повертаємо лише шлях
  }
};

// Функція для обробки GraphQL Upload
export async function handleFileUpload(file, folder) {
	console.log(file);
	
  if (!file) return "";

  const { createReadStream, filename } = await file;
  const fileBuffer = await new Promise((resolve, reject) => {
    const chunks = [];
    const stream = createReadStream();
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

  return FirebaseService.uploadFile(fileBuffer, filename, folder);
}
