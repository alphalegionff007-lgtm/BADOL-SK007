import React, { useEffect, useState } from 'react';
import { dbService } from '../../lib/supabase';
import { GalleryImage } from '../../types';
import { Image, Layers } from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Equipment', 'Interior', 'Training', 'Members', 'Transformation', 'Events'];

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await dbService.getGallery(true);
        setImages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredImages = images.filter((img) => {
    return selectedCategory === 'All' || img.category === selectedCategory;
  });

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest pl-2 border-l border-amber-500">
            Visual Tour
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Our Gym Physical Gallery
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            Browse through our clean, heavy duty power racks, dedicated cardio platforms, ladies bath floors, and actual members' active sweat sessions.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-[10px] md:text-xs font-extrabold tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid display */}
        {loading ? (
          <div className="text-zinc-550 text-center py-20 text-xs font-bold tracking-widest uppercase">
            Syncing visual gallery...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto">
            <Image className="w-12 h-12 text-zinc-650 mx-auto" />
            <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest">No images matched</h4>
            <p className="text-zinc-500 text-xs leading-normal">
              Try selecting another category panel to load spectacular gym snapshots.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square rounded-3xl overflow-hidden border border-zinc-850 bg-zinc-900 shadow-xl overflow-hidden"
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay Text Details on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="bg-amber-500 text-zinc-950 font-bold px-2 py-0.5 rounded-md text-[9px] uppercase tracking-widest w-fit mb-2">
                    {img.category}
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{img.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
