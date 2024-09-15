import React, { useState, useEffect, useContext } from "react";
import { TEmployee } from "../../types";
import { GlobalContext } from "../../context/global-context";

const StaffManager: React.FC = () => {
    const [staffList, setStaffList] = useState<TEmployee[]>([]);
    const [showAddStaff, setShowAddStaff] = useState(false);
    const [newStaffName, setNewStaffName] = useState({
        firstName: "",
        lastName: "",
    });
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
    const [editingStaffName, setEditingStaffName] = useState("");
    const [editingStaffEmail, setEditingStaffEmail] = useState("");

    const {currentSME} = useContext(GlobalContext);

    // Load staff data from localStorage when the component mounts
    useEffect(() => {
        const storedStaffList = localStorage.getItem("staffList");
        if (storedStaffList) {
            setStaffList(JSON.parse(storedStaffList));
        }
    }, []);

    useEffect(() => {
        if(currentSME) {
            setStaffList(currentSME.employees || []);
        }
    }, [currentSME]);

    // Save staff data to localStorage whenever the staffList state changes
    useEffect(() => {
        if (staffList.length > 0) {
            localStorage.setItem("staffList", JSON.stringify(staffList));
        }
    }, [staffList]);

    // On load of the component, generate the employees in an sme

    // const generateNextId = (): string => {
    //     if (staffList.length === 0) return "001";
    //     const ids = staffList.map((staff) => parseInt(staff.id, 10));
    //     const nextId = Math.max(...ids) + 1;
    //     return nextId.toString().padStart(3, "0");
    // };

    const handleAddStaff = () => {
        // Remember to set the employee email
        const newStaff: TEmployee = {
            firstName: newStaffName.firstName,
            lastName: newStaffName.lastName,
            email: newStaffEmail,
            role: "admin",
            smeMail: ""
        };
        setStaffList([...staffList, newStaff]);
        setNewStaffName({ firstName: "", lastName: "" });
        setNewStaffEmail("");
        setShowAddStaff(false);
    };

    const handleDeleteStaff = (id: string) => {
        const updatedList = staffList
            .filter((staff) => staff.email !== id)
            .map((staff) => ({
                ...staff,
            }));
        setStaffList(updatedList);
    };

    const handleEditStaff = (id: string) => {
        const staffToEdit = staffList.find((staff) => staff.email === id);
        if (staffToEdit) {
            setEditingStaffId(id);
            setEditingStaffName(staffToEdit.firstName + staffToEdit.lastName);
            setEditingStaffEmail(staffToEdit.email);
        }
    };

    const handleSaveEdit = () => {
        const updatedList = staffList.map((staff) =>
            staff.email === editingStaffId
                ? { ...staff, name: editingStaffName, email: editingStaffEmail }
                : staff
        );
        setStaffList(updatedList);
        setEditingStaffId(null);
        setEditingStaffName("");
        setEditingStaffEmail("");
    };

    return (
        <div className="overflow-auto">
            <div className=" grid gap-10">
                <h1 className="text-2xl font-semibold text-gray-800 text-center">Staff Management</h1>

                {showAddStaff ? (
                    <div className="grid md:grid-cols-3 md:gap-4 grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="First name"
                            value={newStaffName.firstName}
                            onChange={(e) => setNewStaffName({ ...newStaffName, firstName: e.target.value })}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <input
                            type="text"
                            placeholder="Last name"
                            value={newStaffName.lastName}
                            onChange={(e) => setNewStaffName({ ...newStaffName, lastName: e.target.value })}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={newStaffEmail}
                            onChange={(e) => setNewStaffEmail(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <div className="flex md:translate-y-2 gap-2">
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
                    <table className=" bg-white border border-gray-300 rounded-lg  min-w-fit">
                        <thead className="">
                            <tr className="bg-gray-100">
                                <th className="p-2 font-semibold text-gray-700">Name</th>
                                <th className="p-2 font-semibold text-gray-700">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                                {staffList.map((staff) => (
                <tr key={staff.email} className="border-t">
                    <td className="p-2 max-w-20 break-words md:max-w-none md:whitespace-nowrap
                    ">{staff.firstName + staff.lastName}</td>
                    <td className="p-2 max-w-24 break-words md:max-w-none md:whitespace-nowrap">{staff.email}</td>
                    <td className="p-2">
                        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 justify-center">
                            <button
                                onClick={() => handleEditStaff(staff.email)}
                                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 focus:outline-none"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteStaff(staff.email)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                            >
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
</tbody>

                    </table>
                ) : (
                    <p className="text-center text-gray-600 text-2xl">No staff yet.</p>
                )}

                {editingStaffId && (
                    <div className="mt-6 grid grid-cols-2 grid-rows-1 gap-4 md:grid-cols-3">
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
