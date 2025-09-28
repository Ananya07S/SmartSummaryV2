/*let meetingText = window.text;
const email = window.email;
const meetingDuration = window.duration;

const textarea = document.getElementById('meetingText');
const uploadStatus = document.getElementById('uploadStatus');
const transcribeButton = document.getElementById('transcribeButton');
const sendEmailButton = document.getElementById('sendEmailButton');


textarea.value = meetingText || '';

async function uploadAudio() {
    try {
        const fileInput = document.getElementById("audioFile");
        if (fileInput.files.length === 0) {
            alert("Please select an audio file.");
            return;
        }

        // Disable button and show loading status
        transcribeButton.disabled = true;
        uploadStatus.textContent = "Uploading and transcribing...";

        const formData = new FormData();
        formData.append("audio", fileInput.files[0]);

        const response = await fetch("http://localhost:5050/upload", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();

        // Update the textarea with the transcription
        textarea.value = data.transcription;
        meetingText = data.transcription;
        uploadStatus.textContent = "Transcription completed!";

        // Clear file input
        fileInput.value = '';

    } catch (error) {
        console.error("Error:", error);
        uploadStatus.textContent = `Error: ${error.message}`;
    } finally {
        transcribeButton.disabled = false;
    }
}

document.getElementById("submit-meeting-details").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const meetingText = document.getElementById("meetingText").value;
    const agenda = document.getElementById("title").value;
    
    if (!meetingText.trim()) {
        alert("No transcript available to summarize.");
        return;
    }
    
    try {
        // Show loading message
        document.querySelector('.content').style.display = 'none';
        document.querySelector('.message').style.display = 'block';
        
        const response = await fetch("http://localhost:5050/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                text: meetingText,
                title: agenda,
                email: email || "user@example.com", // Use email from window or default
                duration: meetingDuration || "N/A"
            })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to generate summary");
        }
        
        // Success - keep showing the thank you message
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to generate and save summary: " + error.message);
        
        // Show the form again on error
        document.querySelector('.content').style.display = 'flex';
        document.querySelector('.message').style.display = 'none';
    }
});*/
let meetingText = window.text;
const email = window.email;
const meetingDuration = window.duration;

const textarea = document.getElementById('meetingText');
const uploadStatus = document.getElementById('uploadStatus');
const transcribeButton = document.getElementById('transcribeButton');
const playAudioButton = document.getElementById('playAudioButton');
const audioPlayer = document.getElementById('audioPlayer');
const sendEmailButton = document.getElementById('sendEmailButton');

textarea.value = meetingText || '';

// Audio playback functionality
function toggleAudioPlayback() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playAudioButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            Pause Audio
        `;
    } else {
        audioPlayer.pause();
        playAudioButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
            </svg>
            Play Audio
        `;
    }
}

// Reset play button when audio ends
audioPlayer.addEventListener('ended', () => {
    playAudioButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Play Audio
    `;
});

// Add event listener to play button
playAudioButton.addEventListener('click', toggleAudioPlayback);

async function uploadAudio() {
    try {
        const fileInput = document.getElementById("audioFile");
        if (fileInput.files.length === 0) {
            alert("Please select an audio file.");
            return;
        }

        // Disable button and show loading status
        transcribeButton.disabled = true;
        uploadStatus.textContent = "Uploading and transcribing...";

        const formData = new FormData();
        formData.append("audio", fileInput.files[0]);

        // Get the auth token
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("You must be logged in to upload audio");
        }

        const headers = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch("http://localhost:5050/upload", {
            method: "POST",
            headers,
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();

        // Update the textarea with the transcription
        textarea.value = data.transcription;
        meetingText = data.transcription;
        uploadStatus.textContent = "Transcription completed!";

        // Set up audio playback
        audioPlayer.src = URL.createObjectURL(fileInput.files[0]);
        playAudioButton.disabled = false;

        // Clear file input
        fileInput.value = '';

    } catch (error) {
        console.error("Error:", error);
        uploadStatus.textContent = `Error: ${error.message}`;
    } finally {
        transcribeButton.disabled = false;
    }
}

document.getElementById("submit-meeting-details").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const meetingText = document.getElementById("meetingText").value;
    const agenda = document.getElementById("title").value;
    
    if (!meetingText.trim()) {
        alert("No transcript available to summarize.");
        return;
    }
    
    try {
        // Show loading message
        document.querySelector('.content').style.display = 'none';
        document.querySelector('.message').style.display = 'block';
        
        // Get the auth token
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("You must be logged in to generate summaries");
        }
        
        const headers = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch("http://localhost:5050/summarize", {
            method: "POST",
            headers,
            body: JSON.stringify({ 
                text: meetingText,
                title: agenda,
                duration: meetingDuration || "N/A"
            })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to generate summary");
        }
        
        // Success - keep showing the thank you message
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to generate and save summary: " + error.message);
        
        // Show the form again on error
        document.querySelector('.content').style.display = 'flex';
        document.querySelector('.message').style.display = 'none';
    }
});