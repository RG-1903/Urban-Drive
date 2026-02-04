import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const API_URL = 'http://localhost:8080/api/v1';

const AdminContactManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);

    const statusOptions = [
        { value: 'new', label: 'New' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'in-progress': return 'bg-warning/10 text-warning';
            case 'resolved': return 'bg-success/10 text-success';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/contact`);
            setContacts(res.data.data.contacts);
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
            setError('Failed to load contact messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (contactId, newStatus) => {
        try {
            const res = await axios.patch(`${API_URL}/contact/${contactId}`, { status: newStatus });
            setContacts(contacts.map(c => (c._id === contactId ? res.data.data.contact : c)));
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update contact status.');
        }
    };

    const handleDelete = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact message?')) return;

        try {
            await axios.delete(`${API_URL}/contact/${contactId}`);
            setContacts(contacts.filter(c => c._id !== contactId));
            if (selectedContact?._id === contactId) setSelectedContact(null);
        } catch (err) {
            console.error('Failed to delete contact:', err);
            alert('Failed to delete contact message.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Contact Messages
                        </h1>
                        <p className="text-gray-600">
                            View and manage customer inquiries and contact form submissions.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 font-medium">
                            Total: {contacts.length}
                        </span>
                        <Button
                            variant="outline"
                            iconName="RefreshCw"
                            onClick={fetchContacts}
                            size="sm"
                        >
                            Refresh
                        </Button>
                    </div>
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
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Email / Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Subject
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
                                {contacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-secondary/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-primary">
                                                {formatDate(contact.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-primary">
                                                {contact.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-primary">
                                                {contact.email}
                                            </div>
                                            {contact.phone && (
                                                <div className="text-xs text-text-secondary">
                                                    {contact.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-primary max-w-xs truncate">
                                                {contact.subject}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Select
                                                className="w-36"
                                                options={statusOptions}
                                                value={contact.status}
                                                onChange={(newStatus) => handleStatusChange(contact._id, newStatus)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    iconName="Eye"
                                                    onClick={() => setSelectedContact(contact)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    iconName="Trash2"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(contact._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {contacts.length === 0 && (
                            <div className="text-center py-12">
                                <Icon name="Inbox" size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500">No contact messages yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Contact Detail Modal */}
                {selectedContact && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-primary">Contact Details</h2>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Icon name="X" size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Name</label>
                                    <p className="text-primary font-medium">{selectedContact.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1">Email</label>
                                        <a href={`mailto:${selectedContact.email}`} className="text-accent hover:underline">
                                            {selectedContact.email}
                                        </a>
                                    </div>
                                    {selectedContact.phone && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600 block mb-1">Phone</label>
                                            <a href={`tel:${selectedContact.phone}`} className="text-accent hover:underline">
                                                {selectedContact.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Subject</label>
                                    <p className="text-primary font-medium">{selectedContact.subject}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Message</label>
                                    <p className="text-primary whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                        {selectedContact.message}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Date Submitted</label>
                                    <p className="text-text-secondary text-sm">{formatDate(selectedContact.createdAt)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-2">Status</label>
                                    <Select
                                        options={statusOptions}
                                        value={selectedContact.status}
                                        onChange={(newStatus) => {
                                            handleStatusChange(selectedContact._id, newStatus);
                                            setSelectedContact({ ...selectedContact, status: newStatus });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContactManagement;
