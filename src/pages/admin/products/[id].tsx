import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Trash2, Check, Lock, Unlock, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { productSchema, ProductInput } from '@/schemas/productSchema';
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { GetCategoriesResponse } from '@/services/models/categoryModel';
import { GetProductsResponse } from '@/services/models/productModel';

type PageMode = 'create' | 'update' | 'view';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [mode, setMode] = useState<PageMode>('view');
  const [productData, setProductData] = useState<GetProductsResponse | null>(
    null
  );
  const [categories, setCategories] = useState<GetCategoriesResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      category: '',
      isPublished: true,
      mediaUrl: '',
    },
  });

  const isPublished = watch('isPublished');

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const catData = await getCategories();
        setCategories(catData);
      } catch {
        console.error('Failed to load categories');
      }
    };
    fetchSelectData();
  }, []);

  // Load product data based on ID mode
  useEffect(() => {
    if (!router.isReady) return;

    if (id === 'create') {
      setMode('create');
      setProductData(null);
      reset({
        name: '',
        price: 0,
        category: '',
        isPublished: true,
        mediaUrl: '',
      });
      return;
    }

    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getProductById(Number(id));
        setProductData(result);
        setMode('view');
        reset({
          name: result.name,
          price: result.price,
          category: result.categoryId.toString(),
          isPublished: true, // mock
          mediaUrl: '',
        });
      } catch {
        setError('Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router.isReady, reset]);

  const onSubmit = async (data: ProductInput) => {
    setIsMutating(true);
    setError(null);
    try {
      const payload = {
        name: data.name,
        price: data.price,
        categoryId: Number(data.category),
      };

      if (mode === 'create') {
        await createProduct(payload);
      } else if (productData?.id) {
        await updateProduct(productData.id, payload);
      }
      router.push('/admin/products');
    } catch {
      setError(
        mode === 'create'
          ? 'Failed to create product. Please try again.'
          : 'Failed to update product. Please try again.'
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async () => {
    if (!productData?.id) return;
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsMutating(true);
    setError(null);
    try {
      await deleteProduct(productData.id);
      router.push('/admin/products');
    } catch {
      setError('Failed to delete product. Please try again.');
      setIsMutating(false);
    }
  };

  const isReadOnly = mode === 'view';

  const titleTexts: Record<PageMode, string> = {
    create: 'Create New Product',
    update: 'Update Product Details',
    view: 'Product Details',
  };
  const titleText = titleTexts[mode];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header/Nav */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to products
          </Link>

          <div className="flex items-center gap-2">
            {productData && (
              <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-500">
                # {productData.id.toString().padStart(3, '0')}
              </span>
            )}
            {mode === 'view' && (
              <button
                type="button"
                onClick={() => setMode('update')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
              >
                <Unlock className="h-4 w-4" />
                Edit Details
              </button>
            )}
            {mode === 'update' && (
              <button
                type="button"
                onClick={() => setMode('view')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
              >
                <Lock className="h-4 w-4" />
                View Only
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {titleText}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Define your product details, pricing, and visibility settings for
            the marketplace.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
            <div className="flex items-center">
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Info Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6">
              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="product-name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Product Name
                </label>
                <input
                  id="product-name"
                  type="text"
                  disabled={isReadOnly}
                  {...register('name')}
                  placeholder="e.g. Minimalist Oak Desk"
                  className={`w-full rounded-lg border px-3.5 py-2.5 transition-all outline-none ${
                    isReadOnly ? 'bg-slate-50 text-slate-700' : ''
                  } ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.name && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Price and Category */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="product-price"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Price
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <span className="text-slate-400 sm:text-sm">$</span>
                    </div>
                    <input
                      id="product-price"
                      type="number"
                      step="0.01"
                      disabled={isReadOnly}
                      {...register('price', { valueAsNumber: true })}
                      placeholder="0.00"
                      className={`w-full rounded-lg border py-2.5 pr-3.5 pl-8 transition-all outline-none ${
                        isReadOnly ? 'bg-slate-50 text-slate-700' : ''
                      } ${
                        errors.price
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <span className="text-xs font-medium text-red-500">
                      {errors.price.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="product-category"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Category
                  </label>
                  <select
                    id="product-category"
                    disabled={isReadOnly}
                    {...register('category')}
                    className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 transition-all outline-none ${
                      isReadOnly ? 'bg-slate-50 text-slate-700' : ''
                    } ${
                      errors.category
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  >
                    <option value="">Select a category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id.toString()}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-xs font-medium text-red-500">
                      {errors.category.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Media Card - NO NEED TO USE AT THE MOMENT*/}
          {/* <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
              Product Media
            </p>
            <div
              className={`mt-2 flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                isReadOnly
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="rounded-full bg-slate-100 p-3 text-slate-500">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500">
                  PNG, JPG or WEBP (MAX. 800×400px)
                </p>
              </div>
            </div>
          </div> */}

          {/* Product Visibility Card */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Product Visibility
              </p>
              <p className="text-xs text-slate-500">
                Decide if this product is visible to customers in the
                storefront.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isReadOnly}
                onClick={() =>
                  setValue('isPublished', !isPublished, {
                    shouldValidate: true,
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  isPublished ? 'bg-blue-600' : 'bg-slate-200'
                } ${isReadOnly ? 'cursor-not-allowed opacity-75' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isPublished ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm font-bold text-slate-700 uppercase">
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          {/* Danger Zone (Delete) */}
          {(mode === 'update' || mode === 'view') && (
            <div className="rounded-xl border border-red-100 bg-red-50/30 p-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-red-600">
                    Danger Zone
                  </p>
                  <p className="text-xs text-slate-500">
                    Permanently delete this product from your inventory. This
                    action is irreversible.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isReadOnly || isMutating}
                  onClick={handleDelete}
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-all ${
                    isReadOnly || isMutating
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-red-50 active:scale-95'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Product
                </button>
              </div>
            </div>
          )}

          {/* Action Bar Footer */}
          {!isReadOnly && (
            <div className="flex items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  if (mode === 'create') router.push('/admin/products');
                  else setMode('view'); // Revert changes and go to view
                }}
                className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isMutating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                {isMutating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {mode === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductDetail;
