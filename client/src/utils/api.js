import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const postRegister = async (url, formData) => {
  try {
    const response = await fetch(apiUrl + url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
