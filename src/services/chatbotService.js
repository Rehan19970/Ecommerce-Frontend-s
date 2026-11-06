import axios from 'axios';

export const getSessionId = () => {
  let sessionId = localStorage.getItem('chatbotSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('chatbotSessionId', sessionId);
  }
  return sessionId;
};

export const sendChatMessage = async (message) => {
  const sessionId = getSessionId();
  
  // Token nikaalo (localStorage se)
  const userInfo = localStorage.getItem('userInfo');
  const token = userInfo ? JSON.parse(userInfo).token : null;

  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  try {
    const { data } = await axios.post(
      `${baseURL}/chatbot/message`, 
      { message, sessionId }, 
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }) // Token add karo
        }
      }
    );
    return data;
  } catch (error) {
    console.error("Chat service error:", error);
    throw error;
  }
};