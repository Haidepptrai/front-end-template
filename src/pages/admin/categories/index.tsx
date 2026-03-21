import { useCallback, useEffect, useState } from 'react';
import { CategoryFormData } from '@/schemas/categorySchema';
import UpsertCategoryModal from '@/components/categories/UpsertCategoryModal';
import { Plus, Loader2 } from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
} from '@/services/categoryService';
import { GetCategoriesResponse } from '@/services/models/categoryModel';

interface EditTarget {
  id: number;
  formData: CategoryFormData;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<GetCategoriesResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | undefined>(
    undefined
  );

  // Confirm-delete state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ─── Create ────────────────────────────────────────────────────────────────

  const handleCreateCategory = () => {
    setEditTarget(undefined);
    setIsModalOpen(true);
  };

  // ─── Edit ──────────────────────────────────────────────────────────────────

  const handleEdit = async (id: number) => {
    setError(null);
    try {
      const entity = await getCategoryById(id);
      setEditTarget({
        id,
        formData: {
          name: entity.name ?? '',
          slug: entity.slug ?? '',
        },
      });
      setIsModalOpen(true);
    } catch {
      setError(`Failed to load category #${id} for editing.`);
    }
  };

  // ─── Submit (create or update) ─────────────────────────────────────────────

  const onCategorySubmit = async (data: CategoryFormData) => {
    setIsMutating(true);
    setError(null);
    try {
      if (editTarget) {
        // UPDATE
        await updateCategory(editTarget.id, {
          id: editTarget.id,
          name: data.name,
          slug: data.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        // CREATE
        await createCategory({ name: data.name, slug: data.slug });
      }
      setIsModalOpen(false);
      setEditTarget(undefined);
      await fetchCategories();
    } catch {
      setError(
        editTarget
          ? 'Failed to update category. Please try again.'
          : 'Failed to create category. Please try again.'
      );
    } finally {
      setIsMutating(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────

  const handleDeleteRequest = (id: number) => setDeleteId(id);
  const handleDeleteCancel = () => setDeleteId(null);

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;
    setIsMutating(true);
    setError(null);
    try {
      await deleteCategory(deleteId);
      setDeleteId(null);
      await fetchCategories();
    } catch {
      setError(`Failed to delete category #${deleteId}. Please try again.`);
      setDeleteId(null);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Category Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Organize your catalog taxonomy.
            </p>
          </div>
          <button
            id="btn-create-category"
            onClick={handleCreateCategory}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
          >
            <Plus className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
            Create Category
          </button>
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

        {/* Table Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {/* Loading skeleton */}
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Loading categories…
                    </span>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!isLoading && categories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-slate-400"
                  >
                    No categories found. Create your first one!
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!isLoading &&
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-slate-400">
                      #{category.id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {category.name ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
                        /{category.slug ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="inline-flex items-center gap-1">
                        <button
                          id={`btn-edit-${category.id}`}
                          onClick={() => handleEdit(category.id)}
                          className="rounded-md px-3 py-1 font-bold text-blue-600 transition-colors hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          id={`btn-delete-${category.id}`}
                          onClick={() => handleDeleteRequest(category.id)}
                          className="rounded-md px-3 py-1 font-bold text-red-500 transition-colors hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Footer count — pagination untouched */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <span className="text-sm text-slate-500">
              Showing <span className="font-semibold">{categories.length}</span>{' '}
              results
            </span>
          </div>
        </div>
      </div>

      {/* Upsert Modal */}
      <UpsertCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTarget(undefined);
        }}
        onSubmit={onCategorySubmit}
        initialData={editTarget?.formData}
        isLoading={isMutating}
      />

      {/* Delete Confirmation Dialog */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-999 grid h-screen w-screen place-items-center bg-slate-900/50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-2 text-lg font-bold text-slate-800">
              Delete Category
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Are you sure you want to delete category{' '}
              <span className="font-semibold text-slate-700">
                #{deleteId.toString().padStart(3, '0')}
              </span>{' '}
              ? This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                id="btn-delete-cancel"
                onClick={handleDeleteCancel}
                disabled={isMutating}
                className="rounded-lg border border-slate-300 px-5 py-2 font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                id="btn-delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={isMutating}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2 font-bold text-white transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
              >
                {isMutating && (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
