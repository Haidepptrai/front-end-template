import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { MOCK_PRODUCTS, Product } from '@/constants/products';

const ProductPage = () => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading] = useState(false); // Can be toggled if simulating load

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Paginated partition
  const currentProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your store products and inventory.
            </p>
          </div>
          <Link
            id="btn-create-product"
            href="/admin/products/create"
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
          >
            <Plus className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
            Create Product
          </Link>
        </div>

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
              {/* Loading skeleton (mock logic) */}
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Loading products…
                    </span>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!isLoading && products.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-slate-400"
                  >
                    No products found. Create your first one!
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!isLoading &&
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-slate-400">
                      #{product.id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
                        /{product.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          id={`btn-edit-${product.id}`}
                          href={`/admin/products/${product.id}`}
                          className="rounded-md px-3 py-1 font-bold text-blue-600 transition-colors hover:bg-blue-50"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Reusable Pagination footer */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
