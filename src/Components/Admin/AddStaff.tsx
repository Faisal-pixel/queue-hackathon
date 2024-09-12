import React, { useState, useEffect, useContext } from "react";
// import { HackathonContext } from "../context/hackathonContext";
import { TSMEEmployee } from "../types";



const StaffManager: React.FC = () => {

    const [showAddStaff, setShowAddStaff] = useState(false);
    const [newStaffName, setNewStaffName] = useState("");
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
    const [editingStaffName, setEditingStaffName] = useState("");
    const [editingStaffEmail, setEditingStaffEmail] = useState("");

    // const { employee, staffList, setStaffList } = useContext(HackathonContext);

    // Load the staff list from localStorage when the component mounts
    // useEffect(() => {
    //     const savedStaffList = localStorage.getItem("staffList");
    //     if (savedStaffList) {
    //         setStaffList?.([JSON.parse(savedStaffList)]);
    //     }
    //     console.log(savedStaffList);
    // }, [setStaffList]);

    // Save the staff list to localStorage whenever it changes
    // useEffect(() => {
    //     if (staffList.length > 0) {
    //         localStorage.setItem("staffList", JSON.stringify(staffList));
    //     }
    // }, [staffList]);

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
        <div className="flex  min-h-screen pl-[300px]">
            <div className="p-4 w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-4 pt-5 text-center">Staff Management</h1>
                {showAddStaff ? (
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={newStaffName}
                            onChange={(e) => setNewStaffName(e.target.value)}
                            className="p-2 border border-gray-300 rounded mr-2"
                        />
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={newStaffEmail}
                            onChange={(e) => setNewStaffEmail(e.target.value)}
                            className="p-2 border border-gray-300 rounded mr-2"
                        />
                        <button
                            onClick={handleAddStaff}
                            className="p-2 bg-green-500 text-white rounded"
                        >
                            Add Staff
                        </button>
                        <button
                            onClick={() => setShowAddStaff(false)}
                            className="p-2 bg-red-500 text-white rounded ml-2"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddStaff(true)}
                        className="p-2 bg-orange-500 text-white rounded mb-4"
                    >
                        Add Staff
                    </button>
                )}

                <table className="w-full bg-gray-100 rounded-lg">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        {staffList.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4">No staff yet</td>
                            </tr>
                        ) : (
                            staffList.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-300">
                                    <td className="border px-4 py-2 text-center">{staff.id}</td>
                                    <td className="border px-4 py-2 text-center">
                                        {editingStaffId === staff.id ? (
                                            <input
                                                type="text"
                                                value={editingStaffName}
                                                onChange={(e) => setEditingStaffName(e.target.value)}
                                                className="p-1 border border-gray-300 rounded"
                                            />
                                        ) : (
                                            staff.name
                                        )}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        {editingStaffId === staff.id ? (
                                            <input
                                                type="email"
                                                value={editingStaffEmail}
                                                onChange={(e) => setEditingStaffEmail(e.target.value)}
                                                className="p-1 border border-gray-300 rounded"
                                            />
                                        ) : (
                                            staff.email
                                        )}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        {editingStaffId === staff.id ? (
                                            <button
                                                onClick={handleSaveEdit}
                                                className="p-2 bg-green-500 text-white rounded mr-2"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditStaff(staff.id)}
                                                className="p-2 bg-yellow-500 text-white rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteStaff(staff.id)}
                                            className="p-2 bg-red-500 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody> */}
                </table>
            </div>
        </div>

    );
};

export default StaffManager;
