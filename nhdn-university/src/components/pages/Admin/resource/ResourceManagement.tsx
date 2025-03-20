import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Font Awesome icons
import { ResourceService } from "../../../../service/resourceService";
import { IResource, ResourceType } from "../../../../models/Resource";
import { AppResponse } from "../../../../models/Response";
import { useNavigate } from "react-router-dom";

const ResourceManagement = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<IResource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [editingResource, setEditingResource] = useState<IResource | null>(null);
  const [formData, setFormData] = useState<IResource>({
    name: "",
    type: ResourceType.CLASSROOM,
    building: "",
    floor: 0,
    code: "",
    availability: true,
    vehicleNo: "",
    count: 0,
    equipments: "",
    createdAt: "",
    updatedAt: "",
  });

  // Fetch all resources when the component loads
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await ResourceService.getAllResource();
        if (response.success) {
          setResources(response.data);
        } else {
          console.error("Failed to fetch resources:", response.message);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };
    fetchResources();
  }, []);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingResource && editingResource._id) {
        // Update existing resource
        const response: AppResponse<IResource> = await ResourceService.updateResource(editingResource._id, formData);
        if (response.success) {
          setResources(resources.map((res) => (res._id === editingResource._id ? response.data : res)));
          setEditingResource(null);
        }
      } else {
        // Create new resource
        const response = await ResourceService.createResource(formData);
        if (response.success) {
          setResources([...resources, response.data]);
        }
      }
      // Reset form and close modal
      setFormData({
        name: "",
        type: ResourceType.CLASSROOM,
        building: "",
        floor: 0,
        code: "",
        availability: true,
        vehicleNo: "",
        count: 0,
        equipments: "",
        createdAt: "",
        updatedAt: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving resource:", error);
    }
  };

  // Handle edit resource
  const handleEdit = (resource: IResource) => {
    setEditingResource(resource);
    setFormData(resource);
    setIsModalOpen(true);
  };

  // Handle delete resource
  const handleDelete = async (id: string) => {
    try {
      const response = await ResourceService.deleteResource(id);
      if (response.success) {
        setResources(resources.filter((res) => res._id !== id));
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  // Render additional fields based on resource type
  const renderAdditionalFields = () => {
    switch (formData.type) {
      case ResourceType.CLASSROOM:
      case ResourceType.LAB:
      case ResourceType.AUDITORIUM:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Building</label>
              <input
                type="text"
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Floor</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        );
      case ResourceType.VEHICLE:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
            <input
              type="text"
              name="vehicleNo"
              value={formData.vehicleNo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        );
      case ResourceType.EQUIPMENT:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Count</label>
              <input
                type="number"
                name="count"
                value={formData.count}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Equipments</label>
              <textarea
                name="equipments"
                value={formData.equipments}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Resource Management</h1>

        {/* Create New Resource Button */}
        <button
          onClick={() => { 
            setEditingResource(null);
            navigate('/CreateResource')
          }}
          className="flex px-4 gap-2 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 mb-6"
        >
         <FaPlus className="mt-1"/> Create Resource 
        </button>

      </div>
      {/* Resources Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Resource List</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {resources.map((resource) => (
              <tr key={resource._id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 text-sm text-gray-800">{resource.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{resource.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{resource.code}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {resource.availability ? "Available" : "Unavailable"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => resource._id && handleDelete(resource._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit Resource */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingResource ? "Edit Resource" : "Create Resource"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Object.values(ResourceType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <select
                  name="availability"
                  value={formData.availability.toString()}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
              {renderAdditionalFields()}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                >
                  {editingResource ? "Update Resource" : "Create Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;