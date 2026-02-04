import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { API_URL } from '../../../utils/config';

const AdminLoyaltyForm = ({ reward, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pointsCost: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (reward) {
            setFormData({
                title: reward.title || '',
                description: reward.description || '',
                pointsCost: reward.pointsCost || '',
                isActive: reward.isActive !== undefined ? reward.isActive : true
            });
        }
    }, [reward]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let res;
            if (reward) {
                res = await axios.patch(`${API_URL}/loyalty/${reward._id}`, formData);
            } else {
                res = await axios.post(`${API_URL}/loyalty`, formData);
            }
            onSave(res.data.data.reward, reward ? 'update' : 'create');
            onClose();
        } catch (err) {
            console.error('Failed to save reward:', err);
            setError(err.response?.data?.message || 'Failed to save reward.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-gray-900">
                        {reward ? 'Edit Reward' : 'Add New Reward'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Free Upgrade"
                    />

                    <Input
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="e.g., Upgrade to luxury class for free"
                    />

                    <Input
                        label="Points Cost"
                        name="pointsCost"
                        type="number"
                        value={formData.pointsCost}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 500"
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            isLoading={loading}
                        >
                            {reward ? 'Update Reward' : 'Create Reward'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoyaltyForm;
