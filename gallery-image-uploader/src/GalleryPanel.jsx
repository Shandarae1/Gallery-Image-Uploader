// --- panels/GalleryPanel.jsx ---
import React from "react";
import GalleryUploader from "./GalleryUploader";

const GalleryPanel = () => (
  <div className="image-sharing-panel">
    <h2>Upload Your Images</h2>
    <GalleryUploader />
  </div>
);
export default GalleryPanel;