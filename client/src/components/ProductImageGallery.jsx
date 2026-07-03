const ProductImageGallery = ({ title, images = [] }) => {
  const mainImage = images[0];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-neutral-900 bg-[#0b0b0b] shadow-2xl">
        {mainImage ? (
          <img
            src={mainImage}
            alt={title}
            className="h-[22rem] w-full object-cover sm:h-[28rem] lg:h-[34rem]"
          />
        ) : (
          <div className="flex h-[22rem] items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-xs font-semibold text-neutral-600 sm:h-[28rem] lg:h-[34rem]">
            No Image Available
          </div>
        )}
      </div>

      {hasMultipleImages ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-neutral-900 bg-[#0b0b0b]">
              <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-20 w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProductImageGallery;
