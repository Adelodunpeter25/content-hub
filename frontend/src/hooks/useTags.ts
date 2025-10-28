import { request } from '../services/api';
import type { TagCategory, Tag } from '../types/tag';

export const useTags = () => {
  const getAllTags = async (): Promise<{ categories: TagCategory[]; total: number }> => {
    try {
      return await request('/tags');
    } catch (err: any) {
      console.error('Failed to fetch tags:', err.message);
      throw err;
    }
  };

  const getPopularTags = async (limit = 20): Promise<{ tags: Tag[] }> => {
    try {
      return await request(`/tags/popular?limit=${limit}`);
    } catch (err: any) {
      console.error('Failed to fetch popular tags:', err.message);
      throw err;
    }
  };

  const getUserTags = async (): Promise<{ categories: TagCategory[]; total: number; tag_ids: number[] }> => {
    try {
      return await request('/tags/user');
    } catch (err: any) {
      console.error('Failed to fetch user tags:', err.message);
      throw err;
    }
  };

  const updateUserTags = async (tagIds: number[]): Promise<{ message: string; tag_ids: number[]; count: number }> => {
    try {
      return await request('/tags/user', {
        method: 'PUT',
        body: JSON.stringify({ tag_ids: tagIds }),
      });
    } catch (err: any) {
      console.error('Failed to update user tags:', err.message);
      throw err;
    }
  };

  const searchTags = async (query: string): Promise<{ tags: Tag[]; count: number }> => {
    try {
      return await request(`/tags/search?q=${encodeURIComponent(query)}`);
    } catch (err: any) {
      console.error('Failed to search tags:', err.message);
      throw err;
    }
  };

  return {
    getAllTags,
    getPopularTags,
    getUserTags,
    updateUserTags,
    searchTags,
  };
};
