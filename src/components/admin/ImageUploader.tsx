import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary, isCloudinaryConfigured } from '../../lib/cloudinary';

interface ImageUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  initialImageUrl?: string;
  label?: string;
}

export default function ImageUploader({ 
  onUploadSuccess, initialImageUrl = '', label = 'Upload Photo' 
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(initialImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileProcess(e.target.files[0]);
    }
  };

  const handleFileProcess = async (file: File) => {
    // Validate is image
    if (!file.type.startsWith('image/')) {
      alert('Highly critical structure error: Only image files are permitted.');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadToCloudinary(file);
      setPreview(result.secure_url);
      onUploadSuccess(result.secure_url, result.public_id);
    } catch (err) {
      console.error(err);
      alert('Error uploading file. Please verify network or Cloudinary configurations.');
    } finally {
      setLoading(false);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    onUploadSuccess('', '');
  };

  return (
    <div className="space-y-2">
      <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider">{label}</label>
      
      {!isCloudinaryConfigured && (
        <span className="block text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/15 rounded-md px-2.5 py-1 text-center">
          Cloudinary variables are not configured. Uploading will return a mock local placeholder file.
        </span>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer overflow-hidden aspect-video transition-all min-h-[140px] max-h-[170px] ${
          dragActive 
            ? 'border-amber-500 bg-amber-500/5' 
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Syncing Photo...</p>
          </div>
        ) : preview ? (
          <div className="absolute inset-0 group">
            <img 
              src={preview} 
              alt="Uploaded Visual" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Hover actions panel */}
            <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="p-2.5 bg-rose-600 hover:bg-rose-700 rounded-full text-white hover:scale-105 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <ImageIcon className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-zinc-300 text-xs font-bold leading-none">Drag & Drop Image</p>
              <p className="text-[10px] text-zinc-500 mt-1">or click to browse your disk drives</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
