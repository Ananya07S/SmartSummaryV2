import React, { useState, useEffect, useCallback } from "react";
import NotesCard from "./NotesCard";
import { getNotes, updateNote, deleteNote } from "../../api";

function Dashboard() {
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");

  // NEW STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch meeting notes
  const getNotesData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getNotes();
      setNotesData(data);
    } catch (error) {
      setError(`Failed to load notes. ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete
  const deleteNoteWithId = async (id) => {
    if (window.confirm("Delete this meeting summary permanently?")) {
      try {
        await deleteNote(id);
        setNotesData((prev) => prev.filter((note) => note._id !== id));
      } catch {
        setError("Failed to delete note. Please try again.");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  // Rename / Save updated title
  const renameNote = async (id, newTitle) => {
    try {
      await updateNote(id, { title: newTitle });
      setNotesData((prev) =>
        prev.map((note) =>
          note._id === id ? { ...note, title: newTitle } : note
        )
      );
    } catch {
      setError("Failed to update note title.");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    getNotesData();
  }, [getNotesData]);

  // FILTERING LOGIC
  const filteredNotes = notesData.filter((note) => {
    const matchesSearch = note.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const noteDate = new Date(note.createdAt);
    const matchesMonth = selectedMonth
      ? noteDate.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchesDate = selectedDate
      ? noteDate.getDate() === parseInt(selectedDate)
      : true;

    return matchesSearch && matchesMonth && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-white flex justify-center items-center">
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#ba14a4] relative">
    {/* Top Fade Grid Background */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
        backgroundSize: "40px 30px",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 0%, #fff 60%, transparent 100%)",
      }}
    />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-600 to-purple-600 animate-fadeIn">
          
          </h1>
          
        </div>
        <div className="text-center py-12">
          <h1
  className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900"
  style={{ fontFamily: "'Indie Flower', cursive" }}
>
  ᯓ Your Summaries ᯓ  
</h1>
          <p className="mt-3 text-slate-600">Review and manage your meeting notes</p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-5xl mx-auto px-6 mb-10 flex flex-col md:flex-row gap-4 justify-center">
          <input
          type="text"
          placeholder="Search by meeting heading..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-black w-full md:w-1/2 shadow-sm focus:ring-2 focus:ring-black text-black placeholder-black"
        />
        <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="px-4 py-2 rounded-full border border-black shadow-sm text-black"
        >
        <option value="">All Months</option>
        {[...Array(12)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
        {new Date(0, i).toLocaleString("default", { month: "long" })}
        </option>
  ))}
      </select>

       <input
       type="number"
       min="1"
       max="31"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      placeholder="Day"
      className="px-4 py-2 rounded-full border border-black w-24 shadow-sm text-black placeholder-black"
      /> 
          {(selectedMonth || selectedDate || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedMonth("");
                setSelectedDate("");
              }}
              className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium "
            >
              🗘  Reset 
            </button>
          )}
        </div>

        {/* Notes Section */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <NotesCard
                  key={note._id}
                  data={{
                    id: note._id,
                    title: note.title,
                    duration: note.duration,
                    created_at: note.createdAt,
                    snippet: note.content
              ? note.content.split(/(?<=[.!?])\s/)[0]  // first sentence only
              : "No preview available",
                    
                  }}
                  deleteNoteWithId={deleteNoteWithId}
                  renameNote={renameNote}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  No Meeting Notes Found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

