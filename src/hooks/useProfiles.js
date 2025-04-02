import { useState } from 'react';

const useProfiles = () => {

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    if (!file.type.match('image.*')) {
      throw new Error('Please select an image file');
    }
  
    if (file.size > 1024 * 1024) {
      throw new Error('Image size should be less than 1MB');
    }
    
    try {
      const base64 = await convertToBase64(file);
      return base64;
    } catch (error) {
      console.error('Error converting image:', error);
      throw new Error('Failed to process the image');
    }
  };


  const validateImageUrl = async (url) => {
    if (!url) return false;
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return contentType.startsWith('image/');
    } catch {
      return false;
    }
  };

  return {
    handleImageUpload,
    validateImageUrl
  };
};

export default useProfiles;