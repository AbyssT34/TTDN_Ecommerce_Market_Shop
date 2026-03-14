import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, formData) => {
  try {
    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
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
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
      },
    };
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
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.put(apiUrl + url, updatedData, params);
    return res; // ✅ return đúng cách
  } catch (error) {
    console.error("editData error:", error?.response?.data); // ✅ xem lỗi backend rõ hơn
    return error?.response;
  }
};

export const uploadImages = async (url, formData) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.post(apiUrl + url, formData, params);
    return res; // ✅ return đúng cách
  } catch (error) {
    console.error("editData error:", error?.response?.data); // ✅ xem lỗi backend rõ hơn
    return error?.response;
  }
};

export const editData = async (url, updatedData) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put(apiUrl + url, updatedData, params);
    return res; // ✅ return đúng cách
  } catch (error) {
    console.error("editData error:", error?.response?.data); // ✅ xem lỗi backend rõ hơn
    return error?.response;
  }
};

export const deleteImages = async (url, image) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      "Content-Type": "application/json",
    },
    data: { img: image }, // ✅ body của DELETE để trong data
  };

  try {
    const res = await axios.delete(apiUrl + url, params); // ✅ chỉ 2 tham số
    return res;
  } catch (error) {
    console.error("deleteImages error:", error?.response?.data);
    return error?.response;
  }
};

export const deleteData = async (url) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.delete(apiUrl + url, params); // ✅ chỉ 2 tham số
    return res;
  } catch (error) {
    console.error("delete data error:", error?.response?.data);
    return error?.response;
  }
};

export const deleteMultipleData = async (url, ids) => {
  try {
    const res = await axios({
      method: "delete",
      url: apiUrl + url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
      },
      data: { ids }, // ✅ body của DELETE phải dùng axios config object
    });
    return res;
  } catch (error) {
    console.error("deleteMultipleData error:", error?.response?.data);
    return error?.response;
  }
};