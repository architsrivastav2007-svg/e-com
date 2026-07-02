import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import useDebounce from '../../hooks/useDebounce.js';
import ProductsPagination from '../../components/ProductsPagination.jsx';
import ToastMessage from '../../components/ToastMessage.jsx';
import AdminModal from '../../components/admin/AdminModal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageUploadField from '../../components/admin/ImageUploadField.jsx';
import { TableSkeleton } from '../../components/admin/AdminSkeletons.jsx';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from '../../services/adminService.js';

const blankForm = {
  title: '',
  description: '',
  price: '',
  category: '',
  brand: '',
  stock: '',
  images: [],
  featured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [confirmProduct, setConfirmProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAdminProducts({
        page: currentPage,
        limit: pageSize,
        keyword: debouncedSearchTerm.trim() || undefined,
      });

      setProducts(data?.products ?? []);
      setTotalPages(data?.totalPages ?? 0);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(blankForm);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price ?? '',
      category: product.category || '',
      brand: product.brand || '',
      stock: product.stock ?? '',
      images: Array.isArray(product.images) ? product.images.map((imageUrl) => ({ url: imageUrl })) : [],
      featured: Boolean(product.featured),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(blankForm);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        brand: form.brand.trim(),
        stock: Number(form.stock),
        images: form.images.map((image) => image.url),
        featured: form.featured,
      };

      const data = editingProduct
        ? await updateAdminProduct(editingProduct._id, payload)
        : await createAdminProduct(payload);

      setToast({ message: data?.message || `Product ${editingProduct ? 'updated' : 'created'} successfully`, type: 'success' });
      closeModal();
      await loadProducts();
    } catch (requestError) {
      setToast({ message: requestError?.response?.data?.message || requestError?.message || 'Unable to save product', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmProduct) return;

    try {
      setDeleting(true);
      const data = await deleteAdminProduct(confirmProduct._id);
      setToast({ message: data?.message || 'Product deleted successfully', type: 'success' });
      setConfirmProduct(null);
      await loadProducts();
    } catch (requestError) {
      setToast({ message: requestError?.response?.data?.message || requestError?.message || 'Unable to delete product', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const totalProductsLabel = useMemo(() => products.length, [products]);

  return (
    <div className="space-y-6">
      <ToastMessage message={toast.message} type={toast.type} />
      <ConfirmDialog
        open={Boolean(confirmProduct)}
        title="Delete product"
        description={`Delete ${confirmProduct?.title || 'this product'} from the catalog? This cannot be undone.`}
        confirmLabel="Delete product"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmProduct(null)}
      />

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Products</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Manage catalog</h1>
            <p className="mt-2 text-slate-600">Add, edit, and remove products with searchable pagination and Cloudinary uploads.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <FaPlus />
            Add Product
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="block w-full md:max-w-md">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Search</span>
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by product name or description"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
            />
          </label>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
            Showing {totalProductsLabel} products on this page
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : error ? (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-6 py-12 text-center text-rose-700">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">Title</th>
                  <th className="px-4 py-4 font-semibold">Category</th>
                  <th className="px-4 py-4 font-semibold">Price</th>
                  <th className="px-4 py-4 font-semibold">Stock</th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {products.length ? (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{product.title}</p>
                        <p className="mt-1 max-w-lg truncate text-sm text-slate-500">{product.description}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{product.category}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900">${Number(product.price).toFixed(2)}</td>
                      <td className="px-4 py-4 text-slate-600">{product.stock}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmProduct(product)}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-500"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center text-slate-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 ? <ProductsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}

      <AdminModal
        open={modalOpen}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        onClose={closeModal}
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="admin-product-form"
              disabled={saving}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        }
      >
        <form id="admin-product-form" onSubmit={submitForm} className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Title</span>
            <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900" />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Price</span>
            <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Stock</span>
            <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
            <input name="category" value={form.category} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Brand</span>
            <input name="brand" value={form.brand} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900" />
          </label>
          <div className="md:col-span-2">
            <ImageUploadField
              value={form.images}
              onChange={(nextImages) => setForm((current) => ({ ...current, images: nextImages }))}
            />
          </div>
          <label className="flex items-center gap-3 md:col-span-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-slate-950" />
            <span className="text-sm font-semibold text-slate-700">Featured product</span>
          </label>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminProducts;