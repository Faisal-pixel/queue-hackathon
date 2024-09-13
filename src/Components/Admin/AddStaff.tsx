import React, { useState, useEffect } from "react";
import { TEmployee } from "../../types";

const StaffManager: React.FC = () => {
    const [staffList, setStaffList] = useState<TEmployee[]>([]);
    const [showAddStaff, setShowAddStaff] = useState(false);
    const [newStaffName, setNewStaffName] = useState("");
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
    const [editingStaffName, setEditingStaffName] = useState("");
    const [editingStaffEmail, setEditingStaffEmail] = useState("");

    // Load staff data from localStorage when the component mounts
    useEffect(() => {
        const storedStaffList = localStorage.getItem("staffList");
        if (storedStaffList) {
            setStaffList(JSON.parse(storedStaffList));
        }
    }, []);

    // Save staff data to localStorage whenever the staffList state changes
    useEffect(() => {
        if (staffList.length > 0) {
            localStorage.setItem("staffList", JSON.stringify(staffList));
        }
    }, [staffList]);

    const generateNextId = (): string => {
        if (staffList.length === 0) return "001";
        const ids = staffList.map((staff) => parseInt(staff.id, 10));
        const nextId = Math.max(...ids) + 1;
        return nextId.toString().padStart(3, "0");
    };

    const handleAddStaff = () => {
        const newStaff: TSMEEmployee = {
            id: generateNextId(),
            name: newStaffName,
            email: newStaffEmail,
            role: "admin", // Default role
        };
        setStaffList([...staffList, newStaff]);
        setNewStaffName("");
        setNewStaffEmail("");
        setShowAddStaff(false);
    };

    const handleDeleteStaff = (id: string) => {
        const updatedList = staffList
            .filter((staff) => staff.id !== id)
            .map((staff, index) => ({
                ...staff,
                id: (index + 1).toString().padStart(3, "0"),
            }));
        setStaffList(updatedList);
    };

    const handleEditStaff = (id: string) => {
        const staffToEdit = staffList.find((staff) => staff.id === id);
        if (staffToEdit) {
            setEditingStaffId(id);
            setEditingStaffName(staffToEdit.name);
            setEditingStaffEmail(staffToEdit.email);
        }
    };

    const handleSaveEdit = () => {
        const updatedList = staffList.map((staff) =>
            staff.id === editingStaffId
                ? { ...staff, name: editingStaffName, email: editingStaffEmail }
                : staff
        );
        setStaffList(updatedList);
        setEditingStaffId(null);
        setEditingStaffName("");
        setEditingStaffEmail("");
    };

    return (
        <div className="flex flex-col items-center w-[75%] p-8 bg-gray-50">
            <div className="w-full  bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Staff Management</h1>

                {showAddStaff ? (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={newStaffName}
                            onChange={(e) => setNewStaffName(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={newStaffEmail}
                            onChange={(e) => setNewStaffEmail(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleAddStaff}
                                className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300 focus:outline-none"
                            >
                                Add Staff
                            </button>
                            <button
                                onClick={() => setShowAddStaff(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddStaff(true)}
                            className="px-4 py-2 mb-6 bg-orange-400 text-white rounded hover:bg-orange-400 focus:outline-none"
                    >
                        Add Staff
                    </button>
                )}

                {staffList.length > 0 ? (
                    <table className="w-full bg-white border border-gray-300 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-center p-2 font-semibold text-gray-700">ID</th>
                                <th className="text-left p-2 font-semibold text-gray-700">Name</th>
                                <th className="text-left p-2 font-semibold text-gray-700">Email</th>
                                <th className="text-center p-2 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff.id} className="border-t">
                                    <td className="text-center p-2">{staff.id}</td>
                                    <td className="text-left p-2">{staff.name}</td>
                                    <td className="text-left p-2">{staff.email}</td>
                                    <td className="text-center p-2">
                                        <button
                                            onClick={() => handleEditStaff(staff.id)}
                                            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 focus:outline-none"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStaff(staff.id)}
                                            className="px-3 py-1 ml-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-600 text-2xl">No staff yet.</p>
                )}

                {editingStaffId && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Edit name"
                            value={editingStaffName}
                            onChange={(e) => setEditingStaffName(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Edit email"
                            value={editingStaffEmail}
                            onChange={(e) => setEditingStaffEmail(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingStaffId(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffManager;
