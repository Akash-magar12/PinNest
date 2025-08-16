import { ImagePlus } from "lucide-react";

const PinForm = ({
  form,
  loading,
  handleChange,
  handleFileChange,
  handleSubmit,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Create Pin</h1>
        <p className="text-neutral-600">
          Share your inspiration with the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-black">
            Image
          </label>
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-neutral-400 transition-colors">
            <input
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-3"
            >
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center">
                <ImagePlus className="w-8 h-8 text-neutral-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-black">
                  Choose an image
                </p>
                <p className="text-sm text-neutral-500">or drag and drop</p>
              </div>
            </label>
          </div>
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-black"
          >
            Title
          </label>
          <input
            value={form.title}
            onChange={handleChange}
            type="text"
            id="title"
            name="title"
            placeholder="Add a title"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black placeholder-neutral-500"
          />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-black"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            value={form.description}
            placeholder="Tell everyone what your Pin is about"
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black placeholder-neutral-500 resize-none"
          />
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-black"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            onChange={handleChange}
            value={form.category}
            name="category"
            placeholder="e.g., Photography, Travel, Art"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black placeholder-neutral-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-4 cursor-pointer px-6 rounded-xl text-lg transition-colors duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            {loading ? "Creating Pin..." : "Create Pin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PinForm;
