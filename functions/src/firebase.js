import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Перевіряємо, чи Firebase Admin вже ініціалізований
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = getFirestore();
export const storage = admin.storage().bucket();
export const auth = admin.auth();

/**
 * Перевіряє Firebase ID токен, що приходить у заголовку Authorization.
 * @param {Object} req - Запит Express з заголовками
 * @returns {Promise<Object|null>} - Декодований токен користувача або null, якщо токен недійсний
 */
export const verifyToken = async (req) => {
  if (!req.headers || !req.headers.authorization) {
    // Якщо немає заголовка авторизації, повертаємо null без помилки
    return null;
  }

  const token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return null;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("❌ Помилка перевірки токена:", error);
    return null;
  }
};
