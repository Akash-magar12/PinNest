import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PinForm from "./PinForm";
import PinPreview from "./PinPreview";
import { BASE_URL } from "../utils/const";

const CreatePin = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });
  const user = useSelector((store) => store.user);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false); // 🔄 Loader state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return toast.error("Please upload an image");

    try {
      setLoading(true); // Start loader

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("image", form.image);

      const response = await axios.post(`${BASE_URL}/pin/create`, formData, {
        withCredentials: true,
      });

      console.log(response.data.pins);
      toast.success(response?.data?.message || "Pin created successfully!");

      // Reset form
      setForm({ title: "", description: "", category: "", image: null });
      setPreview("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <PinForm
            form={form}
            loading={loading}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
          />
          {/* Preview Section */}
          <PinPreview user={user} form={form} preview={preview} />
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
