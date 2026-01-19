"use client";

import { getImageUrl } from "@/app/lib/api";
import { Category } from "@/app/types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface CategoryTableProps {
  categories: Category[];
  onDelete?: (id: string) => void;
  onEdit?: (category: Category) => void;
}

const CategoryTable = ({
  categories,
  onDelete,
  onEdit,
}: CategoryTableProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 px-6 text-sm font-semibold text-dark">
              Category
            </th>
            <th className="py-4 px-6 text-sm font-semibold text-dark">
              Description
            </th>
            <th className="py-4 px-6 text-sm font-semibold text-dark">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="py-8 text-center text-gray-500 text-sm"
              >
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr
                key={category._id}
                className="border-b border-gray-50 last:border-none hover:bg-gray-50/50"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {category.imageUrl ? (
                        <img
                          src={getImageUrl(category.imageUrl)}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                          Img
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-dark text-sm">
                      {category.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-dark font-medium">
                  {category.description}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <button
                      onClick={() => onEdit?.(category)}
                      className="hover:text-primary transition-colors"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete?.(category._id)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;