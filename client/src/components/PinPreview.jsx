import { ImageIcon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

const PinPreview = ({ form, preview, user }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(formatted);
    };

    updateTime(); // set immediately on mount
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">Preview</h2>
        <p className="text-neutral-600">See how your pin will look</p>
      </div>

      {/* Pin Preview Card */}
      <div className="bg-neutral-50 rounded-2xl p-6 space-y-4">
        {/* Preview Image */}
        <div className="aspect-[3/4] bg-neutral-200 rounded-xl flex items-center justify-center overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-8 h-8 text-neutral-500" />
              </div>
              <p className="text-neutral-500 text-sm">
                Image preview will appear here
              </p>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-bold text-black text-lg">
            {form.title || (
              <span className="text-neutral-400">
                Your title will appear here
              </span>
            )}
          </h3>
        </div>

        {/* Description */}
        <div>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {form.description || (
              <span className="text-neutral-400">
                Your description will appear here...
              </span>
            )}
          </p>
        </div>

        {/* Category */}
        <div>
          <span className="inline-block bg-neutral-200 text-neutral-600 px-3 py-1 rounded-full text-xs font-medium">
            {form.category || (
              <span className="text-neutral-400">Category</span>
            )}
          </span>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 pt-2 border-t border-neutral-200">
          <img
            src={user?.profileImage?.url}
            className="w-8 h-8 bg-neutral-300 rounded-full"
          ></img>
          <div>
            <p className="text-sm font-medium text-black capitalize">
              {user?.name}
            </p>
            <p className="text-xs text-neutral-500">{time}</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
        <h4 className="font-semibold text-black mb-2">Preview Tips:</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• Upload an image to see it in the preview</li>
          <li>• Fill out the form fields to see live updates</li>
          <li>• Your pin will look exactly like this when published</li>
        </ul>
      </div>
    </div>
  );
};

export default PinPreview;
