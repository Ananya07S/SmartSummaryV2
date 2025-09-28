
/*import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const API = process.env.REACT_APP_API_URL;
// export const googleLogin = async (access_token) => {
//   try {
//     const res = await axios.post(`${baseUrl}/rest-auth/google/`, {
//       access_token,
//     });
//     return { key: res };
//   } catch (err) {
//     return { err: "Something went wrong!" };
//   }
// };

// export const login = async (user) => {
//   try {
//     const res = await axios.post(`${baseUrl}/login`, user);
//     return { key: res.data.key };
//   } catch (err) {
//     return { err: "Something went wrong!" };
//   }
// };

// export const register = async (user) => {
//   try {
//     const res = await axios.post(
//       `${baseUrl}/register
//     `,
//       user
//     );
//     return { key: res.data.key };
//   } catch (err) {
//     return { err: "Something went wrong!" };
//   }
// };
const API_URL = "http://localhost:5000/api/notes";

export const getAllNotes = async (email) => {
  try {
    const res = await axios.get(`${baseUrl}/index/${email}/`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    return { err: "Something went wrong!" };
  }
};

// export const getNote = async (id) => {
//   try {
//     const res = await axios.get(`${baseUrl}/notes/${id}/`);
//     return res.data;
//   } catch (err) {
//     return { err: "Something went wrong!" };
//   }
// };

export const getNote = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};
// export const updateNote = async (id, obj) => {
//   try {
//     const res = await axios.put(`${baseUrl}/notes/${id}/`, obj);
//     console.log(res.data);
//     return res.data;
//   } catch (err) {
//     return { err: "Something went wrong!" };
//   }
// };

export const updateNote = async (id, noteData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });
  return response.json();
};

// export const deleteNote = async (id) => {
//   try {
//     await axios.delete(`${baseUrl}/notes/${id}`);
//   } catch (err) {
//     return { err: "Something went wrong!" };
//   }
// };

export const deleteNote = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

export const getNotionCredentials = async (email) => {
  try {
    const res = await axios.get(`${baseUrl}/notion/email/${email}/`);
    return res.data[0];
  } catch {
    return { err: "Something went wrong!" };
  }
};

export const submitNotionCredentials = async (obj) => {
  try {
    const res = await axios.post(`${baseUrl}/notion/`, obj);
    return res.data;
  } catch {
    return { err: "Something went wrong!" };
  }
};

export const pushMkdToNotion = async (obj) => {
  try {
    const res = await axios.post(`${baseUrl}/notion/note/`, obj);
    return res.data;
  } catch (err) {
    console.log(err.response);
    return { err: "Something went wrong!" };
  }
};

export const getSentiments = async (input) => {
  const { result } = await window.Algorithmia.client(
    process.env.REACT_APP_ALGORITHMIA_API
  )
    .algo("algobox/SentimentAnalysis/0.1.0?timeout=300")
    .pipe(input);

  return result;
};

// const API = process.env.REACT_APP_API_URL;

export const register = async (userData) => {
  try {
    const res = await axios.post(`${API}/register`, userData);
    return res.data;
  } catch (err) {
    return { err: err.response.data || "Registration failed!" };
  }
};
export const login = async (userData) => {
  try {
    const res = await axios.post(`${API}/login`, userData);
    return res.data;
  } catch (err) {
    return { err: err.response.data.err || "Login failed!" };
  }
};

export const googleLogin = async (accessToken) => {
  // Define the Google login API logic
};

async function uploadAudio() {
  try {
    const fileInput = document.getElementById("audioFile");
    const uploadStatus = document.getElementById("uploadStatus");
    const transcribeButton = document.getElementById("transcribeButton");
    const textarea = document.getElementById("meetingText");

    if (fileInput.files.length === 0) {
      alert("Please select an audio file.");
      return;
    }

    // Disable button and show loading status
    transcribeButton.disabled = true;
    uploadStatus.textContent = "Uploading and transcribing...";
    uploadStatus.style.color = "blue";

    const formData = new FormData();
    formData.append("audio", fileInput.files[0]);

    console.log("Sending request to backend..."); // Debug log

    const response = await fetch("http://localhost:5050/upload", {
      // Explicitly using port 5050
      method: "POST",
      body: formData,
    });

    console.log("Response received:", response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.details || "Upload failed");
    }

    const data = await response.json();
    console.log("Response data:", data); // Debug log

    if (data.error) {
      throw new Error(data.error);
    }

    // Update the textarea with the transcription
    textarea.value = data.transcription;
    meetingText = data.transcription;
    uploadStatus.textContent = "Transcription completed successfully!";
    uploadStatus.style.color = "green";

    //Clear file input
    fileInput.value = "";
  } catch (error) {
    console.error("Error:", error);
    uploadStatus.textContent = `Error: ${error.message}`;
    uploadStatus.style.color = "red";
  } finally {
    transcribeButton.disabled = false;
    }
}

// Update the other fetch calls to use port 5050
// async function getSummarizedText() {
//   const body = { email, text: meetingText };

//   const res = await fetch("http://localhost:5050", {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });
//   return await res.json();
//}*/

import axios from "axios";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const baseUrl = process.env.REACT_APP_API_BASE_URL;
//const API = process.env.REACT_APP_API_URL;

export const getNotionCredentials = async (email) => {
  try {
    const res = await axios.get(`${baseUrl}/notion/email/${email}/`);
    return res.data[0];
  } catch {
    return { err: "Something went wrong!" };
  }
};

export const submitNotionCredentials = async (obj) => {
  try {
    const res = await axios.post(`${baseUrl}/notion/`, obj);
    return res.data;
  } catch {
    return { err: "Something went wrong!" };
  }
};

export const pushMkdToNotion = async (obj) => {
  try {
    const res = await axios.post(`${baseUrl}/notion/note/`, obj);
    return res.data;
  } catch (err) {
    console.log(err.response);
    return { err: "Something went wrong!" };
  }
};

export const getSentiments = async (input) => {
  const { result } = await window.Algorithmia.client(
    process.env.REACT_APP_ALGORITHMIA_API
  )
    .algo("algobox/SentimentAnalysis/0.1.0?timeout=300")
    .pipe(input);

  return result;
};

export const register = async (userData) => {
  try {
    const res = await api.post("/register", userData);
    
    // Store token and user email in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', userData.email);
    }
    
    return res.data;
  } catch (err) {
    return { err: err.response?.data || "Registration failed!" };
  }
};

export const login = async (userData) => {
  try {
    const res = await api.post("/login", userData);
    
    // Store token and user email in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
    }
    
    return res.data;
  } catch (err) {
    return { err: err.response?.data?.err || "Login failed!" };
  }
};

export const googleLogin = async (accessToken) => {
  // Define the Google login API logic (if needed)
};

export const uploadAudio = async () => {
  try {
    const fileInput = document.getElementById("audioFile");
    const uploadStatusElement = document.getElementById("uploadStatus");
    const transcribeButtonElement = document.getElementById("transcribeButton");
    const textarea = document.getElementById("meetingText");
    let meetingTextContent = "";

    if (fileInput.files.length === 0) {
      alert("Please select an audio file.");
      return;
    }

    // Disable button and show loading status
    transcribeButtonElement.disabled = true;
    uploadStatusElement.textContent = "Uploading and transcribing...";
    uploadStatusElement.style.color = "blue";

    const formData = new FormData();
    formData.append("audio", fileInput.files[0]);

    console.log("Sending request to backend..."); // Debug log

    const response = await api.post("/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("Response received:", response.status); // Debug log

    // Update the textarea with the transcription
    textarea.value = response.data.transcription;
    meetingTextContent = response.data.transcription;
    uploadStatusElement.textContent = "Transcription completed successfully!";
    uploadStatusElement.style.color = "green";

    //Clear file input
    fileInput.value = "";
    
    return meetingTextContent;
  } catch (error) {
    console.error("Error:", error);
    const uploadStatusElement = document.getElementById("uploadStatus");
    if (uploadStatusElement) {
      uploadStatusElement.textContent = `Error: ${error.response?.data?.error || error.message}`;
      uploadStatusElement.style.color = "red";
    }
    
    const transcribeButtonElement = document.getElementById("transcribeButton");
    if (transcribeButtonElement) {
      transcribeButtonElement.disabled = false;
    }
    
    throw error;
  }
};

// Add a logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Optional: Function to get current user's email
export const getCurrentUserEmail = () => {
  return localStorage.getItem('email');
};

export const summarizeMeeting = async (text, title, duration) => {
  try {
    const response = await api.post("/summarize", { text, title, duration });
    return response.data;
  } catch (error) {
    console.error("Summarization error:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${baseUrl}/forgot-password`, { email });
    return { success: true, message: res.data.message };
  } catch (error) {
    return { success: false, message: "Error sending reset link." };
  }
};

export const sendEmails = async (emails, meetingNotes) => {
  try {
    const response = await api.post("/send-email", {
      emails: emails.split(',').map(email => email.trim()),
      meetingNotes
    });
    return response.data;
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
};

// Notes API functions with authentication
export const getNotes = async () => {
  try {
    const response = await api.get("/notes");
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNote = async (id) => {
  try {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

export const updateNote = async (id, noteData) => {
  try {
    const response = await api.post("/notes/update", {
      id,
      title: noteData.title,
      markdown: noteData.markdown
    });
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await api.post("/notes/delete", { id });
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};