import React from "react";
import { Link } from "react-router-dom";

import git from "assets/github.png";
function Footer() {
  return (
    <>
      <div className="flex justify-between flex-col md:flex-row px-4 py-6 bg-gray-900 text-white">
        <div>
          
          <div className="mt-4 flex space-x-8">
            <a
              href="https://github.com/Ananya07S/SmartSummary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="h-6 m-auto mb-1 w-auto flex-shrink-1"
                alt="Star"
                src={git}
              />
              GitHub 
            </a>
            <a href='mailto:yoursmartsummary@gmail.com'> 
            <img
              className="h-6 m-auto mb-1 w-auto flex-shrink-1"
              alt="Email"
              src="https://www.shutterstock.com/image-vector/email-line-icon-on-black-260nw-1343676617.jpg"
            />
            Email us
           </a>
          </div>
        </div>
        <div className="mt-8 flex flex-row md:flex-col flex-wrap">
          <Link to="/" className="mx-2 text-lg hover:underline">
            Go Up
          </Link>
          
          
          
        </div>
      </div>
      <div className="text-center bg-black p-2">
        
      </div>
    </>
  );
}

export default Footer;
