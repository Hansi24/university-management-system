import React, { useState, ChangeEvent } from "react";
import { FaCamera, FaTrash } from "react-icons/fa";
import backgroundImage from "../../../assets/background.jpeg";
// import SideBar from "../../layout/SideBar";
// import TitleBar from "../../layout/TitleBar";

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
    <div className="flex w-full min-h-screen bg-cover text-white" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* <SideBar /> */}
      <div className="flex flex-col flex-grow">
        {/* <TitleBar /> */}
        <div className="flex flex-grow justify-center items-center p-6">
          <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl text-black space-y-6">
            <h2 className="text-3xl font-bold text-center text-blue-900">Create a Post</h2>

            <div>
              <input
                type="text"
                name="title"
                placeholder="Post Title"
                value={post.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <input
                type="date"
                name="date"
                value={post.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <input
                type="time"
                name="time"
                value={post.time}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>

            <div>
              <input
                type="text"
                name="venue"
                placeholder="Event Venue"
                value={post.venue}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
            </div>

            <div>
              <textarea
                name="description"
                placeholder="Event Description"
                value={post.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="flex flex-col items-center">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition">
                <FaCamera /> Upload Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {preview && (
                <div className="relative mt-4">
                  <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl shadow-md" />
                  <button
                    className="absolute top-2 right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                    onClick={removeImage}
                  >
                    <FaTrash className="text-white" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handlePublish}
              className="w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition"
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
