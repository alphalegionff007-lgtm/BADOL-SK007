import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GalleryImage } from '../../types';
import { Plus, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  // Form parameters
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Equipment');
  const [imageUrl, setImageUrl] = useState('');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = ['Equipment', 'Interior', 'Training', 'Members', 'Transformation', 'Events'];

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await dbService.getGallery();
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingImage(null);
    setTitle('');
    setCategory('Equipment');
    setImageUrl('');
    setCloudinaryPublicId('');
    setIsModalOpen(true);
  };

  const openEditModal = (img: GalleryImage) => {
    setEditingImage(img);
    setTitle(img.title);
    setCategory(img.category);
    setImageUrl(img.image_url);
    setCloudinaryPublicId(img.cloudinary_public_id || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, titleName: string) => {
    if (!confirm(`Are you sure you want to permanently delete photo: "${titleName}"?`)) return;

    try {
      await dbService.deleteGallery(id);
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete gallery image.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Highly critical visual error: An uploaded photo is required before saving.');
      return;
    }
    setSaving(true);

    const payload: Omit<GalleryImage, 'id' | 'created_at'> = {
      title,
      category,
      image_url: imageUrl,
      cloudinary_public_id: cloudinaryPublicId,
      is_active: true,
      order_priority: 0
    };

    try {
      if (editingImage) {
        await dbService.updateGallery(editingImage.id, payload);
      } else {
        await dbService.insertGallery(payload);
      }
      setIsModalOpen(false);
      loadGallery();
    } catch (err) {
      console.error(err);
      alert('Failed to save gallery snapshot.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSuccess = (url: string, publicId: string) => {
    setImageUrl(url);
    setCloudinaryPublicId(publicId);
  };

  return (
    <div className="space-y-6 text-white p-2 text-left">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-white tracking-wider">Visual Gallery Asset Center</h2>
          <p className="text-zinc-500 text-xs mt-1">Acclimate facilities displays, machinery snapshots, and floor activities.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Gallery snap
        </button>
      </div>

      {/* Grid of items */}
      {loading ? (
        <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">Syncing media vaults...</div>
      ) : images.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 p-16 rounded-3xl text-center max-w-sm mx-auto space-y-3.5">
          <AlertCircle className="w-10 h-10 text-zinc-650 mx-auto" />
          <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">No photos uploaded</h4>
          <p className="text-zinc-505 text-xs text-zinc-500">Configure gallery snapshots to attract public trainees to Dhanmondi lifting grids.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group shadow-md relative"
            >
              <div className="aspect-square relative bg-zinc-950">
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Actions overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(img)}
                    className="p-2 rounded-lg bg-zinc-900/95 border border-zinc-700/50 hover:text-white cursor-pointer hover:bg-zinc-800 text-zinc-400 shadow"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id, img.title)}
                    className="p-2 rounded-lg bg-zinc-900/95 border border-zinc-700/50 hover:text-rose-455 cursor-pointer hover:bg-rose-955 text-zinc-400 shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="bg-amber-500 text-zinc-950 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1.5">
                    {img.category}
                  </span>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider truncate">{img.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Overlay container modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-zinc-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold uppercase text-white border-b border-zinc-805 pb-2 ml-0.5 leading-none">
              {editingImage ? 'Edit Photo particulars' : 'Add Gallery Resource'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4.5 text-zinc-300">
              {/* Image Uploader */}
              <ImageUploader
                label="Gym Photo file"
                initialImageUrl={imageUrl}
                onUploadSuccess={handleUploadSuccess}
              />

              {/* Title */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Title / description caption *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Imported Power Cages Strength floor"
                  className="w-full bg-zinc-950 border border-zinc-80s rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-1.5 uppercase">Display Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-3 text-xs text-zinc-350 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Handles */}
              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl text-xs uppercase cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Pin Asset Snapshot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
