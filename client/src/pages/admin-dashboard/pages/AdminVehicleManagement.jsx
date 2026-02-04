import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import AdminVehicleForm from '../components/AdminVehicleForm';

const API_URL = 'http://localhost:8080/api/v1';

const AdminVehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/vehicles?limit=100`);
        setVehicles(res.data.data.vehicles);
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
        setError('Failed to load vehicles. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success/10 text-success';
      case 'rented': return 'bg-warning/10 text-warning';
      case 'maintenance': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleOpenCreateModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSaveVehicle = (savedVehicle, action) => {
    if (action === 'create') {
      setVehicles([savedVehicle, ...vehicles]);
    } else {
      setVehicles(vehicles.map(v => (v.id === savedVehicle.id ? savedVehicle : v)));
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`${API_URL}/vehicles/${vehicleId}`);
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
      } catch (err) {
        console.error('Failed to delete vehicle:', err);
        setError('Failed to delete vehicle. Please try again.');
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
                Vehicle Management
              </h1>
              <p className="text-gray-600">
                Add, edit, or remove vehicles from your fleet.
              </p>
            </div>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={handleOpenCreateModal}
            >
              Add New Vehicle
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
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Price/Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      VIN
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-10 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={vehicle.image}
                              alt={vehicle.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-primary">
                              {vehicle.name}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {vehicle.year} {vehicle.make}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            vehicle.status
                          )}`}
                        >
                          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">
                          ${vehicle.pricePerDay.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-secondary">
                          {vehicle.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-secondary font-mono">
                          {vehicle.vin?.slice(-6) || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Edit"
                            onClick={() => handleOpenEditModal(vehicle)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Trash2"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(vehicle.id)}
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
        <AdminVehicleForm
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default AdminVehicleManagement;