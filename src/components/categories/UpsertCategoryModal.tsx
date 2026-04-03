import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryFormData, categorySchema } from '@/schemas/categorySchema';

interface UpsertCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  /** When provided the modal switches to "Edit" mode */
  initialData?: CategoryFormData;
  isLoading?: boolean;
}

const UpsertCategoryModal: React.FC<UpsertCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEditMode = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData,
  });

  const nameValue = useWatch({ control, name: 'name' });
  const slugValue = useWatch({ control, name: 'slug' });

  // Auto-generate slug from name (only in create mode)
  useEffect(() => {
    if (!isEditMode && nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/(^-|-$)/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, setValue, isEditMode]);

  // Sync form when initialData changes (e.g. clicking a different row's Edit)
  useEffect(() => {
    reset(initialData ?? { name: '', slug: '' });
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 grid h-screen w-screen place-items-center bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="animate-in zoom-in-95 relative m-4 w-full max-w-112.5 rounded-xl bg-white shadow-2xl duration-200">
        {/* Modal Header */}
        <header className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? 'Edit Category' : 'Create Category'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </header>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="category-name"
              className="text-sm font-semibold text-slate-700"
            >
              Category Name
            </label>
            <input
              id="category-name"
              {...register('name')}
              placeholder="e.g. Electronics"
              className={`w-full rounded-lg border px-3 py-2.5 transition-all outline-none ${
                errors.name
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
            />
            {errors.name && (
              <span className="text-xs font-medium text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Slug Input (Editable) */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="category-slug"
              className="text-sm font-semibold text-slate-700"
            >
              Slug
            </label>
            <input
              id="category-slug"
              {...register('slug')}
              placeholder="e.g. electronics"
              className={`w-full rounded-lg border px-3 py-2.5 transition-all outline-none ${
                errors.slug
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
            />
            {errors.slug && (
              <span className="text-xs font-medium text-red-500">
                {errors.slug.message}
              </span>
            )}
          </div>

          {/* Read-only Preview Box */}
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
            <p className="mb-1 text-xs font-bold tracking-tight text-slate-500 uppercase">
              URL Preview
            </p>
            <div className="flex items-center gap-1 overflow-hidden font-mono text-sm text-slate-600">
              <span className="text-slate-400">/categories/</span>
              <span className="truncate font-bold text-blue-600">
                {slugValue || '...'}
              </span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <footer className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 px-6 py-2.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 sm:flex-1"
            >
              {isLoading && (
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {isEditMode ? 'Save Changes' : 'Create Category'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default UpsertCategoryModal;
