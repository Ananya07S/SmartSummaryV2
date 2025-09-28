import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import { getNote, updateNote, deleteNote } from '../../api';

const Notes = () => {
  const history = useHistory();
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [noteData, setNoteData] = useState({});
  const [mom, setMom] = useState('');
  const [msg, setMsg] = useState('');
  
  // New features state
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  //const [showStats, setShowStats] = useState(false);
  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [isFullscreen, ] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  
  const textareaRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Update statistics when content changes
  useEffect(() => {
    const words = mom.trim() === '' ? 0 : mom.trim().split(/\s+/).length;
    const chars = mom.length;
    const lines = mom.split('\n').length;
    
    setWordCount(words);
    setCharCount(chars);
    setLineCount(lines);
  }, [mom]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !editing || !noteData._id) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveNotes(true); // Silent auto-save
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [mom, autoSave, editing, noteData._id]);

  const changeEditing = () => {
    if (!editing) {
      // Save current state to undo history when starting edit
      setUndoHistory(prev => [...prev, mom]);
      setRedoHistory([]);
    }
    setEditing((state) => !state);
  };

  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const lastState = undoHistory[undoHistory.length - 1];
      setRedoHistory(prev => [mom, ...prev]);
      setUndoHistory(prev => prev.slice(0, -1));
      setMom(lastState);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[0];
      setUndoHistory(prev => [...prev, mom]);
      setRedoHistory(prev => prev.slice(1));
      setMom(nextState);
    }
  };

  const handleKeyDown = (e) => {
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'f':
          e.preventDefault();
          setShowSearch(true);
          break;
        case 's':
          e.preventDefault();
          saveNotes();
          break;
        case 'Escape':
          setShowSearch(false);
          break;
      }
    }
    
    if (e.key === 'Escape') {
      setShowSearch(false);
    }
  };

  

  const jumpToSearchResult = (direction = 'next') => {
    if (!searchTerm || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value.toLowerCase();
    const search = searchTerm.toLowerCase();
    const currentPos = textarea.selectionStart;
    
    let foundPos = -1;
    
    if (direction === 'next') {
      foundPos = text.indexOf(search, currentPos + 1);
      if (foundPos === -1) foundPos = text.indexOf(search, 0); // Wrap around
    } else {
      foundPos = text.lastIndexOf(search, currentPos - 1);
      if (foundPos === -1) foundPos = text.lastIndexOf(search); // Wrap around
    }
    
    if (foundPos !== -1) {
      textarea.focus();
      textarea.setSelectionRange(foundPos, foundPos + search.length);
      textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  

  const exportNote = (format) => {
    const element = document.createElement('a');
    const content = format === 'txt' ? mom : 
                   format === 'pdf' ? mom :
                   `# ${noteData.title}\n\n${mom}`;
    
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${noteData.title || 'note'}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  

  const viewFullText = () => {
    const newWindow = window.open('/fullContent');
    newWindow.data = noteData.content;
    newWindow.meetingHead = noteData.title;
  };

  const deleteNoteWithId = async () => {
    if (window.confirm('This action will delete the notes from your account!')) {
      try {
        await deleteNote(noteData._id);
        history.push('/');
      } catch (error) {
        console.error("Error deleting note:", error);
        setMsg('Failed to delete note');
        setTimeout(() => setMsg(''), 3000);
      }
    }
  };

  const saveNotes = async (silent = false) => {
    setSaving(true);
    try {
      const updatedNote = await updateNote(noteData._id, {
        title: noteData.title,
        markdown: mom 
      });
      
      setNoteData(updatedNote);
      setLastSaved(new Date());
      
      if (!silent) {
        setEditing(false);
        setMsg('Notes saved successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      setMsg('Failed to save notes');
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getNoteData = useCallback(async () => {
    try {
      setLoading(true);
      
      const data = await getNote(id);
      console.log("Fetched note data:", data);
      
      const markdownContent = data.markdown || data.summary || '';
      
      setNoteData({
        ...data,
      });
      setMom(markdownContent);
    } catch (error) {
      console.error("Error fetching note:", error);
      setMsg('Failed to load note');
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getNoteData();
  }, [getNoteData]);

  if (loading) {
    return (
      <div className={`w-full h-screen flex flex-col justify-center items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600 mb-4"></div>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading your notes...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={` top-0 z-10  border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className='w-full px-6 py-4'>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => history.push('/')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              }`}
             >
              <span></span>
              <span></span>
            </button>
            
            <div className="flex items-center space-x-2">
              
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {darkMode ? 'Light Mode ☀️' : ' Dark Mode🌙'}
              </button>
            </div>
          </div>
          
          <h1 className={`text-center text-4xl font-bold transition-colors ${
            darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {noteData.title || "Untitled Meeting"}
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className={`sticky top-24 z-20 mx-6 mb-4 p-4 rounded-lg border transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search in notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-3 py-2 rounded border transition-colors ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              autoFocus
            />
            <button
              onClick={() => jumpToSearchResult('prev')}
              className={`px-3 py-2 rounded transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              ↑
            </button>
            <button
              onClick={() => jumpToSearchResult('next')}
              className={`px-3 py-2 rounded transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              ↓
            </button>
            <button
              onClick={() => setShowSearch(false)}
              className={`px-3 py-2 rounded transition-colors ${
                darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} flex flex-wrap lg:flex-nowrap mx-6 ${isFullscreen ? 'mt-0' : 'mt-8'}`}>
        {/* Main Content */}
        <div className={`${isFullscreen ? 'w-full' : 'w-full lg:w-2/3'}`}>
          {/* Toolbar */}
          <div className='flex items-center flex-wrap justify-center md:justify-between mb-6'>
            <h2 className={`text-center my-4 text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Meeting Notes
            </h2>
            
            <div className='flex flex-wrap items-center gap-2'>
              {editing && (
                <>
                  <div className="flex items-center space-x-1 mx-2">
                    <button
                      onClick={handleUndo}
                      disabled={undoHistory.length === 0}
                      className={`px-2 py-1 rounded text-sm transition-colors ${
                        undoHistory.length === 0 
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                          : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      title="Undo (Ctrl+Z)"
                    >
                      ↶
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={redoHistory.length === 0}
                      className={`px-2 py-1 rounded text-sm transition-colors ${
                        redoHistory.length === 0 
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                          : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      title="Redo (Ctrl+Shift+Z)"
                    >
                      ↷
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Size:</label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-16"
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{fontSize}px</span>
                  </div>
                </>
              )}

              

             
              <button
                className='focus:outline-none text-white bg-black hover:bg-black py-1 text-sm font-bold rounded-full px-4 my-2 mx-1 transition-colors'
                onClick={viewFullText}
              >
                 View Full
              </button>

              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      exportNote(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className={`focus:outline-none text-white bg-black hover:bg-black py-2 text-sm font-bold rounded-full px-2 my-0 mx-0 transition-colors ${
                    darkMode ? 'bg-cyan-600' : 'bg-cyan-600'
                  }`}
                >
                  <option value="">Download Summary</option>
                  <option value="txt">Export as TXT</option>
                  <option value="pdf">Export as PDF</option>
                </select>
              </div>

              <button
                onClick={changeEditing}
                className={`focus:outline-none text-white py-1 text-sm font-bold rounded-full px-4 my-2 mx-2 transition-colors ${
                  editing ? 'bg-black hover:bg-black' : 'bg-black hover:bg-black'
                }`}
              >
                {editing ? ' View' : ' Edit'}
              </button>

              <button
                onClick={deleteNoteWithId}
                className='focus:outline-none text-white bg-black hover:bg-red-700 py-1 text-sm font-bold rounded-full px-4 my-2 mx-1 transition-colors'
              >
                 Delete
              </button>

              <button
                disabled={!editing || saving}
                onClick={() => saveNotes()}
                className={`focus:outline-none text-white py-1 text-sm font-bold rounded-full px-4 my-2 mx-2 transition-colors ${
                  !editing || saving 
                    ? 'bg-black cursor-not-allowed' 
                    : 'bg-black hover:bg-green-700'
                }`}
                title="Save (Ctrl+S)"
              >
                {saving ? ' Saving...' : ' Save'}
              </button>

              {editing && (
                <label className="flex items-center space-x-2 mx-2">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Auto-save</span>
                </label>
              )}
            </div>
          </div>

          {/* Text Editor */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              style={{
                fontSize: `${fontSize}px`,
                height: isFullscreen ? 'calc(100vh - 120px)' : '700px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              }}
              className={`text-xl w-full leading-7 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y p-6 rounded-lg border transition-all duration-200 ${
                editing 
                  ? darkMode 
                    ? 'bg-gray-800 text-white border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                  : darkMode 
                    ? 'bg-gray-800 text-gray-300 border-gray-700 opacity-90' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 opacity-90'
              }`}
              value={mom}
              readOnly={!editing}
              onChange={(e) => {
                if (editing) {
                  // Save to undo history before major changes
                  if (Math.abs(e.target.value.length - mom.length) > 50) {
                    setUndoHistory(prev => [...prev.slice(-9), mom]); // Keep last 10 states
                  }
                  setMom(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Start writing your notes here... 

         Tip: Use Ctrl+F to search, Ctrl+S to save, Ctrl+Z to undo"
            />
            
            {editing && (
              <div className={`absolute bottom-4 right-4 text-sm px-2 py-1 rounded ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'
              } shadow-lg`}>
                Line {lineCount}
              </div>
            )}
          </div>

          
          
        </div>

        {/* Sidebar */}
        {!isFullscreen && (
          
        
          <div className={`w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-10`}>
            
            <div className={` bottom-0 p-6 rounded-lg border transition-colors ${
              darkMode ? 'bg-black border-gray-600' : 'bg-white border-gray-300'
              }`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                 Note Details
              </h3>
              
              <div className="space-y-4">
                <div className={`flex items-center text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                 
                  <span>
                    {new Date(noteData.createdAt || Date.now()).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className={`flex items-center text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="mr-3"></span>
                  <span>{wordCount} words, {charCount} characters</span>
                </div>
              {lastSaved && (
                  <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="mr-3"></span>
                    <span>
                      Last Edited: {lastSaved.toLocaleTimeString()}
                    </span>
                  </div>
                )}

                {editing && autoSave && (
                  <div className={`flex items-center text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <span className="mr-3"></span>
                    <span>Auto-save enabled</span>
                  </div>
                )}
              </div>

              {/* Status Message */}
              {msg && (
                <div className={`mt-6 p-3 rounded text-center font-medium ${
                  msg.includes('Failed') 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {msg}
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  ⚡ Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button
                    onClick={() => setShowSearch(true)}
                    className={`p-2 rounded text-center transition-colors ${
                      darkMode ? 'bg-black hover:bg-gray-600 text-white' : 'bg-black hover:bg-black text-white'
                    }`}
                  >
                     Find
                  </button>
                 
                  <button
                    onClick={() => navigator.clipboard.writeText(mom)}
                    className={`p-2 rounded text-center transition-colors ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-black hover:bg-gray-200 text-white'
                    }`}
                  >
                    Copy
                  </button>
                  
                </div>
              </div>
              </div>
          </div>
        )} 
      </div>
     </div>
  );
};

export default Notes;