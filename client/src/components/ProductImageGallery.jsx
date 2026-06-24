const ProductImageGallery = ({ title, images = [] }) => {
  const mainImage = images[0];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        {mainImage ? (
          <img
            src={mainImage}
            alt={title}
            className="h-[22rem] w-full object-cover sm:h-[28rem] lg:h-[34rem]"
          />
        ) : (
          <div className="flex h-[22rem] items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 text-sm font-semibold text-slate-500 sm:h-[28rem] lg:h-[34rem]">
            No Image Available
          </div>
        )}
      </div>

      {hasMultipleImages ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-20 w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProductImageGallery;
