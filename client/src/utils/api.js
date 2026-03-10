import axios from 'axios';
import { LoaderIcon } from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, formData) => {
  try {

    const response = await fetch(apiUrl + url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
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

      const params = {
      headers: {
       Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.get(apiUrl + url, params);

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const uploadImage = async (url, updatedData) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const res = await axios.put(apiUrl + url, updatedData, params);
    return res; // ✅ return đúng cách
  } catch (error) {
    console.error('editData error:', error?.response?.data); // ✅ xem lỗi backend rõ hơn
    return error?.response;
  }
};

export const editData = async (url, updatedData) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put(apiUrl + url, updatedData, params);
    return res; // ✅ return đúng cách
  } catch (error) {
    console.error('editData error:', error?.response?.data); // ✅ xem lỗi backend rõ hơn
    return error?.response;
  }
};

export const deleteData = async (url) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
      'Content-Type': 'application/json',
    },
  };

  const { res } = await axios.delete(apiUrl + url, params);
  return res;
}