import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AdminLoyaltyForm from '../components/AdminLoyaltyForm';
import { API_URL } from '../../../utils/config';

const AdminLoyaltyManagement = () => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReward, setEditingReward] = useState(null);

    useEffect(() => {
        const fetchRewards = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/loyalty`);
                setRewards(res.data.data.rewards);
            } catch (err) {
                console.error('Failed to fetch rewards:', err);
                setError('Failed to load rewards. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchRewards();
    }, []);

    const handleOpenCreateModal = () => {
        setEditingReward(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (reward) => {
        setEditingReward(reward);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReward(null);
    };

    const handleSaveReward = (savedReward, action) => {
        if (action === 'create') {
            setRewards([...rewards, savedReward].sort((a, b) => a.pointsCost - b.pointsCost));
        } else {
            setRewards(rewards.map(r => (r._id === savedReward._id ? savedReward : r)).sort((a, b) => a.pointsCost - b.pointsCost));
        }
    };

    const handleDelete = async (rewardId) => {
        if (window.confirm('Are you sure you want to delete this reward?')) {
            try {
                await axios.delete(`${API_URL}/loyalty/${rewardId}`);
                setRewards(rewards.filter(r => r._id !== rewardId));
            } catch (err) {
                console.error('Failed to delete reward:', err);
                setError('Failed to delete reward. Please try again.');
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
                                Loyalty Program Management
                            </h1>
                            <p className="text-gray-600">
                                Manage loyalty rewards and points redemption options.
                            </p>
                        </div>
                        <Button
                            variant="default"
                            iconName="Plus"
                            iconPosition="left"
                            onClick={handleOpenCreateModal}
                        >
                            Add New Reward
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
                                            Points Cost
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {rewards.map((reward) => (
                                        <tr key={reward._id} className="hover:bg-secondary/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-accent">
                                                {reward.pointsCost} pts
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {reward.title}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">
                                                {reward.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${reward.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {reward.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        iconName="Edit"
                                                        onClick={() => handleOpenEditModal(reward)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        iconName="Trash2"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(reward._id)}
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
                <AdminLoyaltyForm
                    reward={editingReward}
                    onSave={handleSaveReward}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default AdminLoyaltyManagement;
