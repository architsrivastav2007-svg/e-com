import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { deleteAdminProductImage, uploadAdminProductImages } from '../../services/adminService.js';

const normalizeImage = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    return { url: image, publicId: null };
  }

  if (typeof image === 'object' && typeof image.url === 'string') {
    return { url: image.url, publicId: image.publicId || null };
  }

  return null;
};

const ImageUploadField = ({
  value = [],
  onChange,
  label = 'Product Images',
  helperText = 'Drag and drop images or click to browse. PNG, JPG, and WebP are supported.',
}) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [localPreviews, setLocalPreviews] = useState([]);

  const images = useMemo(() => value.map(normalizeImage).filter(Boolean), [value]);

  useEffect(() => {
    return () => {
      localPreviews.forEach((preview) => URL.revokeObjectURL(preview.previewUrl));
    };
  }, [localPreviews]);

  const uploadFiles = async (files) => {
    const selectedFiles = Array.from(files || []).filter((file) => file.type.startsWith('image/'));

    if (!selectedFiles.length) {
      setError('Select at least one image file');
      return;
    }

    const previews = selectedFiles.map((file) => ({
      key: `${file.name}-${file.size}-${file.lastModified}`,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    setError('');
    setLocalPreviews(previews);
    setUploading(true);
    setProgress(0);

    try {
      const data = await uploadAdminProductImages(selectedFiles, setProgress);
      const uploadedImages = (data?.images || []).map((image) => ({
        url: image.url,
        publicId: image.publicId,
      }));

      onChange([...images, ...uploadedImages]);
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || uploadError?.message || 'Failed to upload images');
    } finally {
      previews.forEach((preview) => URL.revokeObjectURL(preview.previewUrl));
      setLocalPreviews([]);
      setUploading(false);
      setProgress(0);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragActive(false);
    await uploadFiles(event.dataTransfer.files);
  };

  const handleDelete = async (imageUrl) => {
    try {
      setError('');
      await deleteAdminProductImage(imageUrl);
      onChange(images.filter((image) => image.url !== imageUrl));
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || deleteError?.message || 'Failed to delete image');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
        <div
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={`rounded-[1.75rem] border-2 border-dashed px-5 py-8 text-center transition ${
            dragActive ? 'border-slate-950 bg-slate-100' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-slate-600">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-950/20">
              <FaCloudUploadAlt />
            </span>
            <p className="text-sm font-semibold text-slate-900">Drop images here</p>
            <p className="text-sm text-slate-500">{helperText}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse files
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => uploadFiles(event.target.files)}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {uploading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Uploading images</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-slate-950 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {localPreviews.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {localPreviews.map((preview) => (
            <div key={preview.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-square bg-slate-100">
                <img src={preview.previewUrl} alt={preview.name} className="h-full w-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/10 text-sm font-semibold text-slate-950">Uploading...</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {images.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.url} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-square bg-slate-100">
                <img src={image.url} alt="Product" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDelete(image.url)}
                  className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-rose-700 shadow-lg backdrop-blur transition hover:bg-white"
                >
                  <FaTrash /> Delete
                </button>
              </div>
              <div className="px-4 py-3">
                <p className="truncate text-xs text-slate-500">{image.url}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageUploadField;