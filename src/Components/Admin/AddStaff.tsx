import React, { useState, useEffect, useContext } from "react";
import { TSMEEmployee } from "../types";



const StaffManager: React.FC = () => {

    const [showAddStaff, setShowAddStaff] = useState(false);
    const [newStaffName, setNewStaffName] = useState("");
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
    const [editingStaffName, setEditingStaffName] = useState("");
    const [editingStaffEmail, setEditingStaffEmail] = useState("");

    const generateNextId = (): string => {
        if (staffList.length === 0) return "001";
        const ids = staffList.map((staff) => parseInt(staff.id, 10));
        const nextId = Math.min(...ids.filter(id => id > 0 && !ids.includes(id + 1))) + 1;
        return nextId.toString().padStart(3, "0");
    };

    const handleAddStaff = () => {
        const newStaff: TSMEEmployee = {
            id: generateNextId(),
            name: newStaffName,
            email: newStaffEmail,
            role: "admin"
        };
        setStaffList?.([...staffList, newStaff]);
        setNewStaffName("");
        setNewStaffEmail("");
        setShowAddStaff(false);
    };

    const handleDeleteStaff = (id: string) => {
        const updatedList = staffList.filter((staff) => staff.id !== id).map((staff, index) => ({
            ...staff,
            id: (index + 1).toString().padStart(3, "0"), // Reassigning ID after deletion
        }));
        setStaffList?.(updatedList);
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
        setStaffList?.(updatedList);
        setEditingStaffId(null);
        setEditingStaffName("");
        setEditingStaffEmail("");
    };

    return (
        <div className="flex  min-h-screen w-[75%]">
            <div className="p-4 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center">Staff Management</h1>
                {showAddStaff ? (
                    <div className="translate-y-8 grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={newStaffName}
                            onChange={(e) => setNewStaffName(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={newStaffEmail}
                            onChange={(e) => setNewStaffEmail(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <button
                            onClick={handleAddStaff}
                            className="p-2 bg-green-500 text-white rounded"
                        >
                            Add Staff
                        </button>
                        <button
                            onClick={() => setShowAddStaff(false)}
                            className="p-2 bg-red-500 text-white rounded"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddStaff(true)}
                        className="p-2 bg-orange-500 text-white rounded translate-y-6"
                    >
                        Add Staff
                    </button>
                )}
                <table className="w-full bg-gray-100 rounded-lg translate-y-10">
                    <thead>
                        <tr className="bg-gray-300">
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

    );
};

export default StaffManager;
