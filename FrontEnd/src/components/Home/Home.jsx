import React from "react";
import Navbar from "components/Navbar";
import Icon from "components/Icon";
import Footer from "components/Footer";

// Minimal Integration Card
const IntegrationCard = ({ icon, name, description }) => (
  <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-200 p-6 w-90 hover:bg-gray-50 transition shadow-sm">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-0">{name}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

function Home({ user, setUser }) {
  return (
    <>
      {/* Import Inter Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex flex-col items-center justify-center font-inter"
        style={{
          background: "white",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.1) 1px, transparent 1px),
           radial-gradient(circle at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.1) 40%, transparent 80%)
          `,
          backgroundSize: "58px 58px, 58px 58px, 100% 100%",
        }}
      >
        <Navbar user={user} setUser={setUser} />

        <div className="max-w-6xl text-center mt-16 px-4">
         <h1
  className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 typing-text mb-4"
  style={{ 
    fontFamily: "'Indie Flower', cursive",
    lineHeight: "1.1",
    paddingBottom: "0.2em"
  }}
>
  SmartSummary
</h1>


          <h4 className="italic mt-6 text-xl text-gray-700">
            ❝ Turn Conversations into Actions ❞
          </h4>

          <p className="mt-6 text-lg text-gray-600">
            Get your meeting notes, YouTube recaps, and audio summaries{" "}
            <span className="relative curved-underline">in just one click</span>.
            <br /> Works seamlessly across all platforms.
          </p>

          <a
            className="inline-flex mt-10 px-6 py-3 text-base font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
            href="/landing.html"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="download" />
            &nbsp;Download Chrome Extension
          </a>
        </div>
      </div>

      {/* Integrations Section */}
  <div className=" bg-white relative">
  {/* Noise Texture (Darker Dots) Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: "#ffffff",
      backgroundImage: "radial-gradient(circle at 10px 10px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
      backgroundSize: "20px 20px",
    }}
  />
     {/* Your Content/Components */}
  
 <div className="py-20 font-inter relative z-10">
  <div className="text-center mb-12">
    <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-3">
      Works with your favorite tools 
    </h1>
    <p className="text-lg text-gray-600">
      Seamlessly integrate with the platforms you already use
    </p>
  </div>

  {/* Scrolling integrations - FIXED VERSION */}
  <div className="overflow-hidden">
    <div className="flex space-x-6 animate-scroll-seamless">
      {/* First set of cards */}
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-12 w-12" />} 
        name="Skype" 
        description="Get transcriptions and summaries from every Skype meet." 
      />
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-12 w-12" />} 
        name="Personal Audio Files" 
        description="Just upload your local saved files to get summaries" 
      />
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-12 w-12" />} 
        name="Cisco Webex" 
        description="Get transcriptions, key takeaways of every Webex meet." 
      />
      <IntegrationCard 
        icon={<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJFW8ZrKjj5ajeP2LXxqDfJjnLbw70DbofeQ&s" alt="Zoom" className="h-12 w-12" />} 
        name="Zoom" 
        description="Get automatic real-time transcription, key takeaways and action items." 
      />
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/768px-Google_Meet_icon_%282020%29.svg.png" alt="Google Meet" className="h-12 w-12" />} 
        name="Google Meet" 
        description="Get real-time transcriptions, summaries, and answer questions on any call." 
      />
      <IntegrationCard 
        icon={<img src="https://download.logo.wine/logo/Microsoft_Teams/Microsoft_Teams-Logo.wine.png" alt="Teams" className="h-8 w-8" />} 
        name="Microsoft Teams" 
        description="Get real-time transcriptions, key takeaways, and action items from every Teams meeting." 
      />
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-12 w-12" />} 
        name="YouTube Videos" 
        description="Summarize your youtube video's audios" 
      />

      {/* Duplicate set for seamless loop */}
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-12 w-12" />} 
        name="Skype" 
        description="Get transcriptions and summaries from every Skype meet." 
      />
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-12 w-12" />} 
        name="Personal Audio Files" 
        description="Just upload your local saved files to get summaries" 
      />
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-12 w-12" />} 
        name="Cisco Webex" 
        description="Get transcriptions, key takeaways of every Webex meet." 
      />
      <IntegrationCard 
        icon={<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJFW8ZrKjj5ajeP2LXxqDfJjnLbw70DbofeQ&s" alt="Zoom" className="h-12 w-12" />} 
        name="Zoom" 
        description="Get automatic real-time transcription, key takeaways and action items." 
      />
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/768px-Google_Meet_icon_%282020%29.svg.png" alt="Google Meet" className="h-12 w-12" />} 
        name="Google Meet" 
        description="Get real-time transcriptions, summaries, and answer questions on any call." 
      />
      <IntegrationCard 
        icon={<img src="https://download.logo.wine/logo/Microsoft_Teams/Microsoft_Teams-Logo.wine.png" alt="Teams" className="h-8 w-8" />} 
        name="Microsoft Teams" 
        description="Get real-time transcriptions, key takeaways, and action items from every Teams meeting." 
      />
      <IntegrationCard 
        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-12 w-12" />} 
        name="YouTube Videos" 
        description="Summarize your youtube video's audios" 
      />
     </div>
   </div>
  </div>
  </div>  
  

      {/* Features Section */}
      <div className="sticky top-0 h-[80vh] flex items-center justify-between bg-white border-t border-gray-200 font-inter">
        <div className="w-full sm:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Never miss a thing with SmartSummary!
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Transcribe interviews, podcasts, and meetings. <br />
            Empower collaboration with easy sharing and search. <br />
            Get AI-generated notes and highlights saved automatically.
          </p>
        </div>
        <div className="w-full sm:w-1/2 flex items-center justify-center p-10">
          <img src="M.png" alt="Feature" className="max-w-full max-h-full object-contain" />
        </div>
      </div>

      <div className="sticky top-0 h-[80vh] flex items-center justify-between bg-white border-t border-gray-200 font-inter">
        <div className="w-full sm:w-1/2 flex items-center justify-center p-10">
          <img src="calm.png" alt="Feature" className="max-w-full max-h-full object-contain" />
        </div>
        <div className="w-full sm:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Stay focused and productive.
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          save time on board meetings, team management, and customer support such that you just focus on the conversation and never miss what’s important.
          </p>
        </div>
        
      </div>

      <div className="sticky top-0 h-[80vh] flex items-center justify-between bg-white border-t border-gray-200 font-inter">
        <div className="w-full sm:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Make the most out of every conversation!
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
           Use with anything and everything - Google meet, Zoom, Blue Jeans, GoToMeeting, Microsoft Teams, and many more.
          </p>
        </div>
        <div className="w-full sm:w-1/2 flex items-center justify-center p-10">
          <img src="https://img.freepik.com/premium-vector/conversation-concept-illustration_114360-1102.jpg" alt="Feature" className="max-w-full max-h-full object-contain" />
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .curved-underline {
          position: relative;
          display: inline-block;
        }
        .curved-underline::after {
          content: '';
          position: absolute;
          left: -2%;
          bottom: -2px;
          width: 104%;
          height: 6px;
          background: black;
          border-radius: 80px;
          transform: scaleY(0.8) rotate(-0.9deg);
          opacity: 0.9;
        }
        .typing-text {
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          animation: typing 2s steps(12, end) forwards, blink-caret 0.75s step-end infinite;
          border-right: 3px solid;
          border-color: currentColor;
          display: inline-block;
          line-height: 1.1;
          min-height: 1.2em;
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: currentColor; }
        }
        .animate-scroll-seamless {
  animation: seamlessScroll 30s linear infinite;
  width: max-content;
}

@keyframes seamlessScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Optional: Pause on hover */
.animate-scroll-seamless:hover {
  animation-play-state: paused;
}
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Helvetica, Arial, sans-serif;
        }
      `}</style>
    </>
  );
}

export default Home;