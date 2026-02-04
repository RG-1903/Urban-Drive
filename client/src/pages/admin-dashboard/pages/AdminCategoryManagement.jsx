import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AdminCategoryForm from '../components/AdminCategoryForm';
import { API_URL } from '../../../utils/config';

const AdminCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(res.data.data.categories);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setError('Failed to load categories. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleOpenCreateModal = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSaveCategory = (savedCategory, action) => {
        if (action === 'create') {
            setCategories([...categories, savedCategory].sort((a, b) => a.displayOrder - b.displayOrder));
        } else {
            setCategories(categories.map(c => (c.id === savedCategory.id ? savedCategory : c)).sort((a, b) => a.displayOrder - b.displayOrder));
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`${API_URL}/categories/${categoryId}`);
                setCategories(categories.filter(c => c.id !== categoryId));
            } catch (err) {
                console.error('Failed to delete category:', err);
                setError('Failed to delete category. Please try again.');
            }
        }
    };

    return (
        <>
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Category Management
                            </h1>
                            <p className="text-gray-600">
                                Manage vehicle categories, styles, and descriptions.
                            </p>
                        </div>
                        <Button
                            variant="default"
                            iconName="Plus"
                            iconPosition="left"
                            onClick={handleOpenCreateModal}
                        >
                            Add New Category
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Icon name="Loader2" className="animate-spin text-accent" size={48} />
                        </div>
                    ) : error ? (
                        <div className="text-center text-destructive">{error}</div>
                    ) : (
                        <div className="bg-white rounded-xl border border-border shadow-cinematic overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-secondary">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                            Badge
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-secondary/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                                {category.displayOrder}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-primary">
                                                    {category.name}
                                                </div>
                                                <div className="text-xs text-text-secondary">
                                                    {category.subtitle}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent/10 text-accent">
                                                    {category.badge}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        iconName="Edit"
                                                        onClick={() => handleOpenEditModal(category)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        iconName="Trash2"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(category.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <AdminCategoryForm
                    category={editingCategory}
                    onSave={handleSaveCategory}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default AdminCategoryManagement;
