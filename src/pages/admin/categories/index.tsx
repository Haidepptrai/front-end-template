import { Category, MOCK_CATEGORIES } from '@/constants/mockCategories';
import { useState } from 'react';
import { CategoryFormData } from '@/schemas/categorySchema';
import UpsertCategoryModal from '@/components/categories/UpsertCategoryModal';

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCategory = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const onCategorySubmit = (data: CategoryFormData) => {
    const newCategory: Category = {
      id: categories.length + 1,
      name: data.name,
      slug: data.slug,
      createdAt: new Date().toISOString(),
    };

    setCategories((prev) => [...prev, newCategory]);
    setIsModalOpen(false);
  };

  const handleEdit = (id: number) => {
    console.log(`Editing Category ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
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
            onClick={handleCreateCategory}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16m8-8H4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            Create Category
          </button>
        </div>

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
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-mono text-sm text-slate-400">
                    #{category.id.toString().padStart(3, '0')}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
                      /{category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="rounded-md px-3 py-1 font-bold text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <span className="text-sm text-slate-500">
              Showing <span className="font-semibold">{categories.length}</span>{' '}
              results
            </span>
          </div>
        </div>
      </div>

      <UpsertCategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={onCategorySubmit}
      />
    </div>
  );
};

export default CategoryPage;
