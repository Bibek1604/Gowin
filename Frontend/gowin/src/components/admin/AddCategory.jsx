    import React, { useState } from "react";
    import Sidebar from "./sidebar";
    import useCategoryStore from "../Store/CategoryStore";

    const AddCategory = () => {
        const [category, setCategory] = useState("");
        const [description, setDescription] = useState("");
        const [image, setImage] = useState("");

        const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();

        const handleSubmit = (e) => {
            e.preventDefault();
            if (category.trim() === "" || description.trim() === "") {
                alert("All fields are required!");
                return;
            }

            addCategory({ category, description, image });
            setCategory("");
            setDescription("");
            setImage("");
            alert("Category added successfully!");
        };

        return (
            <>
                <Sidebar />
                <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto mt-10">
                    <h2 className="text-2xl font-bold mb-6 text-center">Add Category Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 font-semibold">Category Name</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Description</label>
                            <textarea 
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">Choose iamge</label>
                            <input 
                                type="image" 
                                                accept="image/*" 
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                            Add Details
                        </button>
                    </form>

                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4">Category List</h3>
                        {categories.length === 0 ? (
                            <p>No categories added yet.</p>
                        ) : (
                            categories.map((cat, index) => (
                                <div key={index} className="p-3 border rounded-md mb-2 flex justify-between items-center">
                                    <div>
                                        <span>{cat.category} - {cat.description}</span>
                                        {cat.image && <img src={cat.image} alt="Category" className="mt-2 w-16 h-16 rounded" />}
                                    </div>
                                    <button onClick={() => deleteCategory(index)} className="text-red-500">Delete</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </>
        );
    };

    export default AddCategory;
