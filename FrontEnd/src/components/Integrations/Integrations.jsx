/*import React, { useState, useEffect, useCallback } from "react";

import { getNotionCredentials, submitNotionCredentials } from "api";
import loaderGif from "../../assets/loader.gif";
const Integrations = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [notionData, setNotionData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [docLink, setDocLink] = useState("");

  const getCredentials = useCallback(async () => {
    const data = await getNotionCredentials(user.email);
    setNotionData(data);
    setLoading(false);
  }, [user.email]);

  const submitCredentials = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const obj = {
      email: user.email,
      token,
      page: docLink,
      team: "",
    };
    await submitNotionCredentials(obj);
    setNotionData(obj);
    setSubmitting(false);
  };

  useEffect(() => {
    getCredentials();
  }, [getCredentials]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img className="h-28" src={loaderGif} alt="smart-loader" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <a
            
            href="/notion.html"
            rel="noreferrer"
            target="_blank"
          >
            
        <p> <h1 className="text-5xl font-bold text-blue-600 mb-4 hover:text-blue-700 transition duration-300"> Why Notion?</h1>
           
          </p>
            
           
            
          </a>
      <h1 className="mt-4 text-gray-800 text-3xl font-bold text-2xl">
        Create your own Notion 
      </h1>
      <br />
      {notionData && notionData.token ? (
        <div className="font-bold text-gray-700 text-lg">
          <p>
            Notion v2 Token:{" "}
            <span className="font-normal">
              {notionData.token.substring(0, 30)}...
            </span>
          </p>
          <p className="mt-3">
            Notion Doc link:{" "}
            <span className="font-normal">{notionData.page}</span>
          </p>
        </div>
      ) : (
        <form style={{ minWidth: 330 }} onSubmit={submitCredentials}>
          <p className="text-lg font-bold text-gray-700 mt-4">
            Notion v2 Token:
            <input
              className="w-full border-gray-300 rounded border block p-3 mt-2 text-gray-700 appearance-none focus:outline-none focus:border-gray-600"
              type="text"
              onChange={(e) => setToken(e.target.value)}
              required
              placeholder="Enter your Notion v2 token"
            />
          </p>
          <p className="text-lg font-bold text-gray-700 mt-4">
            Notion Doc link:
            <input
              className="w-full border-gray-300 rounded border block p-3 mt-2 text-gray-700 appearance-none focus:outline-none focus:border-gray-600"
              type="text"
              onChange={(e) => setDocLink(e.target.value)}
              required
              placeholder="Enter your Notion Doc link"
            />
          </p>
          <button
            disabled={submitting}
            className="w-full focus:outline-none cursor-pointer rounded bg-blue-600 p-3 text-white font-bold mt-5"
          >
            Submit Details
          </button>
          
          
        </form>
      )}
      
      <p></p>
       <p>OR</p>
      <a
            className="text-center w-72 block mt-2"
            href="https://www.notion.so/SmartSummary-18a81a176d8a80918987df8bd33e1e48" //redgregory par apna account banana h
            rel="noreferrer"
            target="_blank"
          >
            
        <button
            disabled={submitting}
            className="w-full focus:outline-none cursor-pointer rounded bg-blue-600 p-5 text-white font-bold mt-5"
          >
            Checkout Mine..
          </button>  
            
          </a>
    </div>
  );
};

export default Integrations;*/
import React, { useState, useEffect, useCallback } from "react";

import { getNotionCredentials } from "api";
import loaderGif from "../../assets/loader.gif";

const Integrations = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [notionData, setNotionData] = useState({});

  const getCredentials = useCallback(async () => {
    const data = await getNotionCredentials(user.email);
    setNotionData(data);
    setLoading(false);
  }, [user.email]);

  useEffect(() => {
    getCredentials();
  }, [getCredentials]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img className="h-28" src={loaderGif} alt="smart-loader" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <a
        href="/notion.html"
        rel="noreferrer"
        target="_blank"
      >
        <p>
          <h1 className="text-5xl font-bold text-blue-600 mb-4 hover:text-blue-700 transition duration-300">
            <u>Why Notion?</u>
          </h1>
        </p>
      </a>
      
      <h1 className="mt-4 text-gray-800 text-3xl font-bold text-2xl">
        Create your own Notion Page
      </h1>
      <br />
      
      {notionData && notionData.token ? (
        <div className="font-bold text-gray-700 text-lg">
          <p>
            Notion v2 Token:{" "}
            <span className="font-normal">
              {notionData.token.substring(0, 30)}...
            </span>
          </p>
          <p className="mt-3">
            Notion Doc link:{" "}
            <span className="font-normal">{notionData.page}</span>
          </p>
        </div>
      ) : (
        <div className="text-center">
          <a
            href="https://www.notion.com/"
            rel="noreferrer"
            target="_blank"
            className="inline-block"
          >
            <button
              className="w-72 focus:outline-none cursor-pointer rounded bg-blue-600 p-3 text-white font-bold mt-5"
            >
              Sign into Notion
            </button>
          </a>
        </div>
      )}
      
      <p className="my-4">OR</p>
      
      <a
        className="text-center w-72 block"
        href="https://www.notion.so/Teamspace-Home-1c481a176d8a80de8249fb3a4d390a3a"
        rel="noreferrer"
        target="_blank"
      >
        <button
          className="w-full focus:outline-none cursor-pointer rounded bg-blue-600 p-5 text-white font-bold mt-5"
        >
          Checkout Mine..
        </button>  
      </a>
    </div>
  );
};

export default Integrations;

