import React from "react";
import { Link } from "react-router-dom";

const NotesCard = ({ data, deleteNoteWithId }) => {
  const deleteNotes = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNoteWithId(data.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    if (typeof duration === "string") return duration;
    return `${Math.floor(duration / 60)}:${(duration % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + `/notes/${data.id}`);
    alert("Link copied to clipboard!");
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Placeholder: just download text file
    const blob = new Blob([data.snippet || "No content"], {
      type: "text/plain",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${data.title || "meeting-note"}.txt`;
    link.click();
  };

  return (
    <Link
      to={`/notes/${data.id}`}
      className="group relative bg-black rounded-2xl p-6 shadow-sm  transition-all duration-500 cursor-pointer overflow-hidden"
    >
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black  to-black" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
             <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-white transition-colors">
              {data.title || "Untitled Meeting"} 
            </h3>
           
            <div className="flex items-center gap-4 text-sm text-white">
              <span className="flex items-center gap-1">
                 {formatDate(data.created_at)}
              </span>
              
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={deleteNotes}
            className="opacity-100 p-2 text-xl text-white rounded-lg transition-all duration-200"
            title="Delete Note"
          >
            ✗
          </button>
        </div>

        {/* Preview Snippet */}
        <p className="text-white text-sm line-clamp-3 mb-4">
          {data.snippet || "No preview available"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">
              Summary Ready
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="text-xs text-white hover:underline"
            >
              Download
            </button>
            <button
              onClick={handleShare}
              className="text-xs text-white hover:underline"
            >
              Share
            </button>
            <div className="flex items-center text-white group-hover:text-white transition-colors">
              <span className="text-sm font-medium mr-1">View</span> →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotesCard;

