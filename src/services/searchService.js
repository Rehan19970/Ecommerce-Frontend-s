import api from './api';

export const searchProducts = async (keyword) => {
  if (!keyword || keyword.trim().length < 2) return [];
  try {
    const { data } = await api.get(
      `/products?keyword=${encodeURIComponent(keyword)}&pageSize=5`
    );
    return data.products || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};