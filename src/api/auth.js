import { BASE_URL } from "./constants";

export async function login(userData) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Что то пошло не так');
  return await response.json(); // Возвращаем чистый результат
}

// Запрос на создание пользователя (POST)
export async function createUser(userData) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Ошибка при создании пользователя');
  return await response.json();
}

