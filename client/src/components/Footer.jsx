const Footer = () => {
  return (
    <footer className="border-t border-neutral-900 bg-[#070707] px-4 py-12 text-neutral-400 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2">
          <div className="text-lg font-bold tracking-tight text-white">
            Shop<span className="text-[#d4b26f] font-luxury-serif italic font-medium ml-0.5">Sphere</span>
          </div>
          <p className="text-xs text-neutral-500 max-w-md">
            Curated pieces from independent designers and heritage brands — edited for the discerning wardrobe.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-xs tracking-[0.2em] uppercase text-[#d4b26f]">Premium Collection 2025</p>
          <p className="text-[10px] text-neutral-600">
            &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
