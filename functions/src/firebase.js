import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Перевіряємо, чи Firebase Admin вже ініціалізований
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = getFirestore();
export const auth = admin.auth();

/**
 * Перевіряє Firebase ID токен, що приходить у заголовку Authorization.
 * @param {Object} req - Запит Express з заголовками
 * @returns {Promise<Object|null>} - Декодований токен користувача або null, якщо токен недійсний
 */
export const verifyToken = async (req) => {
  if (!req.headers || !req.headers.authorization) {
    console.error("❌ Заголовок Authorization відсутній або `req` пустий:", req);
    return null;
  }

  const token = req.headers.authorization.split("Bearer ")[1];

  // console.log("🔑 Отриманий токен:", token);

  if (!token) {
    console.error("❌ Немає токена!");
    return null;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    // console.log("✅ Декодований токен:", decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("❌ Помилка перевірки токена:", error);
    return null;
  }
};
