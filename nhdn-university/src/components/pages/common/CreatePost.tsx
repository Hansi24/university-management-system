import React, { useState, ChangeEvent, useContext } from "react";
import { FaCamera, FaTrash } from "react-icons/fa";
import backgroundImage from "../../../assets/background.jpeg";
import { AppResponse } from "../../../models/Response";
import { IEvent, IEventRequest } from "../../../models/Event";
import { EventService } from '../../../service/eventService';
import { CommonContext } from "../../../context/commonContext";
import { useMessagePopup } from "../../../context/useMessagePopup";

const CreatePost: React.FC = () => {
  const [post, setPost] = useState<IEventRequest>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    flyer: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { setSpinnerOpen } = useContext(CommonContext);
  const { showErrorMessage, showSuccessMessage } = useMessagePopup();

  const validateForm = () => {
    let tempErrors: { [key: string]: string } = {};

    // Check if title is provided
    if (!post.title) tempErrors.title = "Title is required.";

    // Check if description is provided
    if (!post.description) tempErrors.description = "Description is required.";

    // Check if date is provided
    if (!post.date) {
      tempErrors.date = "Date is required.";
    } else {
      // Check if the selected date is in the future
      const selectedDate = new Date(`${post.date}T${post.time}`);
      if (selectedDate <= new Date()) {
        tempErrors.date = "Date and time must be in the future.";
      }
    }

    // Check if time is provided
    if (!post.time) tempErrors.time = "Time is required.";

    // Check if location is provided
    if (!post.location) tempErrors.location = "Location is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPreview(null);
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    setSpinnerOpen(true);
  
    try {
      // Combine date and time into a single string
      const dateTimeString = `${post.date}T${post.time}:00`; // Format: YYYY-MM-DDTHH:MM:00
  
      // Validate if the selected date and time are in the future
      const selectedDateTime = new Date(dateTimeString);
      if (selectedDateTime <= new Date()) {
        alert("Date and time must be in the future.");
        return;
      }
  
      // Create a FormData object
      const formData = new FormData();
  
      // Append event data to FormData
      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("date", dateTimeString);
      formData.append("location", post.location);
  
      // Append the flyer image if it exists
      if (preview) {
        const file = await fetch(preview).then((res) => res.blob());
        formData.append("flyer", file, "flyer.jpg"); // "flyer" is the field name expected by the backend
      }
  
      // Send the FormData to the backend
      const response: AppResponse<IEvent> = await EventService.createEvent(formData);
      console.log("Event created:", response);
      showSuccessMessage("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      showErrorMessage("Failed to create event");
    } finally {
      setPost({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        flyer: "",
      })
      setSpinnerOpen(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-cover text-white" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="flex flex-col flex-grow">
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
                name="location"
                placeholder="Event Location"
                value={post.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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