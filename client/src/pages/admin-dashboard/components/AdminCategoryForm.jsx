import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_URL } from '../../../utils/config';

const AdminCategoryForm = ({ category, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        subtitle: '',
        description: '',
        badge: '',
        gradient: 'from-slate-500 to-gray-600',
        displayOrder: 0,
        features: [''],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                subtitle: category.subtitle || '',
                description: category.description || '',
                badge: category.badge || '',
                gradient: category.gradient || 'from-slate-500 to-gray-600',
                displayOrder: category.displayOrder || 0,
                features: category.features && category.features.length > 0 ? category.features : [''],
            });
        }
    }, [category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Filter out empty features
            const dataToSubmit = {
                ...formData,
                features: formData.features.filter(f => f.trim() !== '')
            };

            let response;
            if (category) {
                response = await axios.patch(`${API_URL}/categories/${category.id}`, dataToSubmit);
                onSave(response.data.data.category, 'update');
            } else {
                response = await axios.post(`${API_URL}/categories`, dataToSubmit);
                onSave(response.data.data.category, 'create');
            }
            onClose();
        } catch (err) {
            console.error('Error saving category:', err);
            setError(err.response?.data?.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {category ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <Icon name="X" size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="e.g. Luxury"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input
                                type="number"
                                name="displayOrder"
                                value={formData.displayOrder}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="e.g. Premium vehicles for discerning travelers"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="Full description of the category..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                            <input
                                type="text"
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="e.g. Most Popular"
                            />
                        </div>
                        {/* Gradient field removed */}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                        <div className="space-y-3">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                                        placeholder="Feature description"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="p-2 text-gray-400 hover:text-destructive transition-colors"
                                    >
                                        <Icon name="Trash2" size={20} />
                                    </button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                iconName="Plus"
                                onClick={addFeature}
                            >
                                Add Feature
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="default" isLoading={loading}>
                            {category ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCategoryForm;
