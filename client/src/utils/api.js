import axios from 'axios';
import { LoaderIcon } from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, formData) => {
  try {
    const response = await fetch(apiUrl + url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(apiUrl + url, {
      headers: {
       Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
