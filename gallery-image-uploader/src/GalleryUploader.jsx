import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GalleryUploader.css';

const baseURL = "https://olivia.mandolinwren.com/babyshower-gallery";

const UPLOAD_URL = `${baseURL}/upload.php`;
const LIST_URL = `${baseURL}/list.php`;
const DELETE_URL = `${baseURL}/delete.php`;
const IMAGE_PATH = `${baseURL}/uploads/`;

const GalleryUploader = () => {
  const [file, setFile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(LIST_URL);
      setGallery(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Error loading gallery');
    }
  };

  const deleteImage = async (filename) => {
    try {
      const res = await axios.post(DELETE_URL, { filename });
      if (res.data.success) {
        setMessage('Image deleted successfully.');
        fetchGallery(); // Refresh gallery after delete
      } else {
        setMessage(`Delete failed: ${res.data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Failed to delete image.');
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!file) return;

    const maxSize = 150 * 1024; // 150KB
    if (file.size > maxSize) {
      setMessage('File is too large. Maximum size is 150KB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(UPLOAD_URL, formData);
           setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Clear file input field
      }
      fetchGallery();
    } catch (err) {
      const error = err.response?.data?.message || 'Upload failed';
      setMessage(error);
    }
  };

  return (
    <div className="gallery-container">
<div className="upload-form">
      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          accept=".jpg"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef}
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p className="message">{message}</p>}
</div>


      <div className="gallery-grid">
        {gallery.map((img, index) => (
          <div key={index} className="gallery-item">
            <img
              src={`${IMAGE_PATH}${img}`}
              alt={`Baby Shower ${index}`}
            />
            <button onClick={() => deleteImage(img)} className="delete-button">
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryUploader;
