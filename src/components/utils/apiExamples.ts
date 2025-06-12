/**
 * This file contains examples of how to use the request utilities
 * with your ASP.NET backend.
 */
import api from './requestUtils';

// User interfaces
interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

// Examples of API calls

/**
 * Fetch user profile
 */
export async function getUserProfile(): Promise<User> {
  return await api.get<User>('/user/profile');
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: Partial<User>): Promise<User> {
  return await api.put<User>('/user/profile', data);
}

/**
 * Get all courses
 */
export async function getAllCourses(
  page = 1, 
  limit = 10, 
  search?: string
): Promise<{ courses: Course[], total: number }> {
  return await api.get('/courses', {
    params: { page, limit, search }
  });
}

/**
 * Get a single course by ID
 */
export async function getCourseById(courseId: string): Promise<Course> {
  return await api.get(`/courses/${courseId}`);
}

/**
 * Create a new lesson in a course
 */
export async function createLesson(
  courseId: string, 
  lessonData: Omit<Lesson, 'id'>
): Promise<Lesson> {
  return await api.post(`/courses/${courseId}/lessons`, lessonData);
}

/**
 * Update a lesson
 */
export async function updateLesson(
  courseId: string,
  lessonId: string,
  lessonData: Partial<Lesson>
): Promise<Lesson> {
  return await api.patch(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
}

/**
 * Delete a lesson
 */
export async function deleteLesson(courseId: string, lessonId: string): Promise<void> {
  return await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
}

/**
 * Example of handling file uploads with multipart/form-data
 */
export async function uploadProfilePicture(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);
  
  return await api.post('/user/profile-picture', formData, {
    // Override default JSON Content-Type header
    // The fetch API will automatically set the correct Content-Type for FormData
    headers: {}
  });
}

/**
 * Example of downloading a file
 */
export async function downloadCertificate(courseId: string): Promise<Blob> {
  const response = await api.get(`/courses/${courseId}/certificate`, {
    headers: {
      Accept: 'application/pdf'
    },
    // To handle binary responses
    skipErrorHandling: true
  }) as Response;
  
  return await response.blob();
}

// More examples can be added as needed based on your backend API
