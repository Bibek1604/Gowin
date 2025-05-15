import React, { useState } from "react";
import Sidebar from "./sidebar";

const TourismSiteDetails = () => {
    const [siteName, setSiteName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [rating, setRating] = useState("");
    const [gallery, setGallery] = useState([]);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [amenities, setAmenities] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Site Name:", siteName);
        console.log("Location:", location);
        console.log("Description:", description);
        console.log("Category:", category);
        console.log("Rating:", rating);
        console.log("Gallery:", gallery);
        console.log("Address:", address);
        console.log("Phone:", phone);
        console.log("Email:", email);
        console.log("Website:", website);
        console.log("Amenities:", amenities);
        console.log("Ticket Price:", ticketPrice);

        alert("Tourism Site Details added successfully!");

        setSiteName("");
        setLocation("");
        setDescription("");
        setCategory("");
        setRating("");
        setGallery([]);
        setAddress("");
        setPhone("");
        setEmail("");
        setWebsite("");
        setAmenities("");
        setTicketPrice("");
    };

    return (
        <>
            <Sidebar />
            <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-4">Add Tourism Site Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Site Name</label>
                        <input type="text" className="w-full p-3 border rounded-lg" value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
                    </div>
                    <div>
                        <label>Location</label>
                        <input type="text" className="w-full p-3 border rounded-lg" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea className="w-full p-3 border rounded-lg" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    </div>
                    <div>
                        <label>Category</label>
                        <input type="text" className="w-full p-3 border rounded-lg" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div>
                        <label>Rating</label>
                        <input type="number" className="w-full p-3 border rounded-lg" value={rating} onChange={(e) => setRating(e.target.value)} />
                    </div>
                    <div>
                        <label>Gallery (URLs)</label>
                        <input type="text" className="w-full p-3 border rounded-lg" value={gallery} onChange={(e) => setGallery(e.target.value.split(","))} />
                    </div>
                    <div>
                        <label>Address</label>
                        <input type="text" className="w-full p-3 border rounded-lg" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input type="tel" className="w-full p-3 border rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" className="w-full p-3 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Website</label>
                        <input type="url" className="w-full p-3 border rounded-lg" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                    <div>
                        <label>Amenities</label>
                        <input type="text" className="w-full p-3 border rounded-lg" value={amenities} onChange={(e) => setAmenities(e.target.value)} />
                    </div>
                    <div>
                        <label>Ticket Price</label>
                        <input type="text" className="w-full p-3 border rounded-lg" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Details</button>
                </form>
            </div>
        </>
    );
};

export default TourismSiteDetails;
