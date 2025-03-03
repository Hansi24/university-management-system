import React, { useState, ChangeEvent } from "react";
import SideBar from "../layout/SideBar";
import TitleBar from "../layout/TitleBar";
import { FaCamera, FaTrash } from "react-icons/fa";
import backgroundImage from "../../assets/background.jpeg";

interface Post {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  image: File | null;
}

const CreatePost: React.FC = () => {
  const [post, setPost] = useState<Post>({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!post.title) tempErrors.title = "Title is required.";
    if (!post.description) tempErrors.description = "Description is required.";
    if (!post.date) tempErrors.date = "Date is required.";
    if (!post.time) tempErrors.time = "Time is required.";
    if (!post.venue) tempErrors.venue = "Venue is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPost({ ...post, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPost({ ...post, image: null });
    setPreview(null);
  };

  const handlePublish = () => {
    if (!validateForm()) return;
    console.log("Published Post:", post);
    alert("Post Published Successfully!");
  };

  return (
    <div className="flex flex w-full min-h-screen bg-cover  text-white" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <SideBar />
      <div className="flex flex-col flex-grow">
        <TitleBar />
        <div className="flex flex-grow justify-center items-center p-5">
          <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-2xl font-bold text-center mb-4">Create a Post</h2>

            <input type="text" name="title" placeholder="Title" value={post.title} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

            <input type="date" name="date" value={post.date} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

            <input type="time" name="time" value={post.time} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
            {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}

            <input type="text" name="venue" placeholder="Venue" value={post.venue} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
            {errors.venue && <p className="text-red-500 text-sm">{errors.venue}</p>}

            <textarea name="description" placeholder="Description" value={post.description} onChange={handleChange} className="w-full p-2 border rounded mb-3"></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

            <div className="flex flex-col items-center mb-4">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                <FaCamera /> Upload Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {preview && (
                <div className="relative mt-4">
                  <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded" />
                  <button className="absolute top-2 right-2 bg-red-500 p-1 rounded-full" onClick={removeImage}>
                    <FaTrash className="text-white" />
                  </button>
                </div>
              )}
            </div>

            <button onClick={handlePublish} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;