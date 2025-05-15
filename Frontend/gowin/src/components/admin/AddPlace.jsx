import React, { useState } from "react";
import Sidebar from "./sidebar";

const AddPlace = () => {
    const [placeName, setPlaceName] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [continent, setContinent] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!placeName || !description || !country || !continent || !image) {
            alert("All fields are required!");
            return;
        }

        console.log("Place Name:", placeName);
        console.log("Description:", description);
        console.log("Country:", country);
        console.log("Continent:", continent);
        console.log("Image:", image);

        setPlaceName("");
        setDescription("");
        setCountry("");
        setContinent("");
        setImage(null);
        alert("Place added successfully!");
    };

    return (
        <>
            <Sidebar />
            <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Add Place Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-semibold">Place Name</label>
                        <input type="text" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" value={placeName} onChange={(e) => setPlaceName(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Description</label>
                        <textarea className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Country Name</label>
                        <input type="text" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Continent</label>
                        <input type="text" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" value={continent} onChange={(e) => setContinent(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Upload Image</label>
                        <input type="file" className="w-full p-3 border rounded-lg" onChange={(e) => setImage(e.target.files[0])} required />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">Add Place</button>
                </form>
            </div>
        </>
    );
};

export default AddPlace;
