import React from 'react';

import { useState } from 'react';


const LedgerUpload = () => {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  // State to store the preview URL of the image
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a URL for the file to show a preview
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }
    
    // For now, we'll just log the file to the console.
    // In the next step, we would send this to the backend.
    console.log('Uploading file:', selectedFile.name);
    
    // Here you would use something like Axios to post the file
    // const formData = new FormData();
    // formData.append('ledgerImage', selectedFile);
    // axios.post('http://localhost:5000/api/upload', formData)
    //   .then(res => console.log(res.data))
    //   .catch(err => console.error(err));
  };

  return (
    <div className="card w-full max-w-lg bg-base-100 shadow-xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl">Upload Your Daily Ledger</h2>
        <p>Take a picture of your handwritten sales log and upload it here.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input 
            type="file" 
            className="file-input file-input-bordered file-input-primary w-full"
            accept="image/*" // Accept only image files
            onChange={handleFileChange}
          />

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-4 border-2 border-dashed rounded-lg p-4">
              <p className="font-semibold text-center mb-2">Image Preview:</p>
              <img src={previewUrl} alt="Ledger preview" className="rounded-lg w-full" />
            </div>
          )}
          
          <div className="card-actions justify-end">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!selectedFile} // Disable button if no file is selected
            >
              Digitize Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LedgerUpload;