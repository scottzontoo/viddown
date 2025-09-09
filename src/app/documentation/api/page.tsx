"use client";
import { useState } from "react";
import Link from "next/link";

export default function ApiDocumentationPage() {
  const [testUrl, setTestUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const baseUrl = "https://api.massdatagh.com";

  return (
    <main className="container-2xl py-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl sm:text-5xl font-bold mb-8">VidDown API Documentation</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The VidDown API allows you to download videos from popular social media platforms 
          including YouTube, TikTok, and X (Twitter) programmatically. This RESTful API 
          is designed to be simple to use and integrate into your applications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-indigo-50 p-6 rounded-lg dark:bg-indigo-900/30 flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400 mb-3">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <line x1="12" x2="12" y1="3" y2="21"></line>
            </svg>
            <h3 className="text-xl font-medium mb-2">Multiple Platforms</h3>
            <p className="text-zinc-600 dark:text-zinc-300">Support for YouTube, TikTok, and X (Twitter) videos.</p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-lg dark:bg-indigo-900/30 flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400 mb-3">
              <path d="M12 22v-5"></path>
              <path d="M9 8V2"></path>
              <path d="M15 8V2"></path>
              <path d="M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
              <path d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
              <path d="M12 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
            </svg>
            <h3 className="text-xl font-medium mb-2">Simple Integration</h3>
            <p className="text-zinc-600 dark:text-zinc-300">Easy to use with any application that can make HTTP requests.</p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-lg dark:bg-indigo-900/30 flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400 mb-3">
              <path d="m12 14 4-4"></path>
              <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
            </svg>
            <h3 className="text-xl font-medium mb-2">Best Quality</h3>
            <p className="text-zinc-600 dark:text-zinc-300">Automatically selects the highest quality available for each video.</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 dark:bg-yellow-900/30 dark:border-yellow-600">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> The API is currently in beta and does not require authentication.
            Rate limiting may be applied in the future.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Base URL</h2>
        <p className="mb-4">All API requests should be made to:</p>
        <pre className="bg-zinc-200 p-4 rounded dark:bg-zinc-700 overflow-x-auto">
{`${baseUrl}/api`}
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
        
        <div className="bg-zinc-100 p-6 rounded-lg mb-8 dark:bg-zinc-800">
          <div className="flex items-center mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">GET</span>
            <code className="text-lg">/</code>
          </div>
          <p className="mb-4">Service root - returns API information in JSON format.</p>
        </div>

        <div className="bg-zinc-100 p-6 rounded-lg mb-8 dark:bg-zinc-800">
          <div className="flex items-center mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">GET</span>
            <code className="text-lg">/documentation/api</code>
          </div>
          <p className="mb-4">HTML documentation for the API.</p>
        </div>

        <div className="bg-zinc-100 p-6 rounded-lg mb-8 dark:bg-zinc-800">
          <div className="flex items-center mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">GET</span>
            <code className="text-lg">/api/map</code>
          </div>
          <p className="mb-4">Machine-readable endpoint list.</p>
        </div>
        
        <div className="bg-zinc-100 p-6 rounded-lg mb-8 dark:bg-zinc-800">
          <div className="flex items-center mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">GET</span>
            <code className="text-lg">/api/resolve</code>
          </div>
          <p className="mb-4">Resolves a video URL and returns information about the video.</p>
          
          <h3 className="text-xl font-medium mb-2">Query Parameters</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><code>url</code> <span className="text-red-500">required</span> - The URL of the video to resolve</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-2">Response</h3>
          <pre className="bg-zinc-200 p-4 rounded dark:bg-zinc-700 overflow-x-auto">
{`{
  "title": "Video Title",
  "provider": "YouTube", // or "TikTok", "X"
  "thumbnails": ["https://example.com/thumbnail.jpg"],
  "sources": [
    {
      "quality": "1080p",
      "type": "video/mp4",
      "url": "/api/download?url=https://example.com"
    },
    {
      "quality": "720p",
      "type": "video/mp4",
      "url": "/api/download?url=https://example.com"
    }
  ]
}`}
          </pre>
        </div>
        
        <div className="bg-zinc-100 p-6 rounded-lg dark:bg-zinc-800">
          <div className="flex items-center mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">GET</span>
            <code className="text-lg">/api/download</code>
          </div>
          <p className="mb-4">Downloads a video directly from the source platform.</p>
          
          <h3 className="text-xl font-medium mb-2">Query Parameters</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><code>url</code> <span className="text-red-500">required</span> - The URL of the video to download</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-2">Response</h3>
          <p>Returns the video file directly as a download with appropriate Content-Disposition header. The API automatically selects the best available quality.</p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Example Usage</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-2">Direct Download</h3>
            <p className="mb-4">For a simple download, just use the download endpoint with the video URL:</p>
            <pre className="bg-zinc-200 p-4 rounded mb-6 dark:bg-zinc-700 overflow-x-auto">
{`GET ${baseUrl}/api/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
            </pre>
            
            <h4 className="text-lg font-medium mb-2">Using cURL</h4>
            <pre className="bg-zinc-200 p-4 rounded mb-6 dark:bg-zinc-700 overflow-x-auto">
{`curl -L "${baseUrl}/api/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" -o video.mp4`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-2">Resolve First Approach</h3>
            <p className="mb-4">To get information about the video before downloading:</p>
            <pre className="bg-zinc-200 p-4 rounded mb-6 dark:bg-zinc-700 overflow-x-auto">
{`// Step 1: Resolve the video to get information
GET ${baseUrl}/api/resolve?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ

// Step 2: Use the directDownloadUrl from the response
GET ${baseUrl}/api/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
            </pre>
            
            <h4 className="text-lg font-medium mb-2">Using JavaScript Fetch</h4>
            <pre className="bg-zinc-200 p-4 rounded mb-6 dark:bg-zinc-700 overflow-x-auto">
{`// Step 1: Get video info
const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const response = await fetch(
  \`${baseUrl}/api/resolve?url=\${encodeURIComponent(videoUrl)}\`
);
const data = await response.json();

// Step 2: Download using the direct URL
window.location.href = data.directDownloadUrl;`}
            </pre>
          </div>
        </div>
        
        <h3 className="text-xl font-medium mb-4 mt-8">Try It Out</h3>
        <div className="bg-zinc-100 p-6 rounded-lg mb-6 dark:bg-zinc-800">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 rounded-md border border-zinc-200 bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`/api/resolve?url=${encodeURIComponent(testUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-md bg-zinc-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-zinc-500"
            >
              Test Resolve API
            </a>
            <a
              href={`/api/download?url=${encodeURIComponent(testUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              Test Download API
            </a>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Error Responses</h2>
        <p className="mb-4">The API returns standard HTTP status codes along with error messages in JSON format:</p>
        <pre className="bg-zinc-200 p-4 rounded dark:bg-zinc-700 overflow-x-auto">
{`{
  "error": "Error message description"
}`}
        </pre>
        
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="p-2 text-left border border-zinc-300 dark:border-zinc-700">Status Code</th>
              <th className="p-2 text-left border border-zinc-300 dark:border-zinc-700">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-zinc-300 dark:border-zinc-700">400</td>
              <td className="p-2 border border-zinc-300 dark:border-zinc-700">Bad Request - Missing parameters or unsupported URL</td>
            </tr>
            <tr>
              <td className="p-2 border border-zinc-300 dark:border-zinc-700">404</td>
              <td className="p-2 border border-zinc-300 dark:border-zinc-700">Not Found - No downloadable sources found</td>
            </tr>
            <tr>
              <td className="p-2 border border-zinc-300 dark:border-zinc-700">500</td>
              <td className="p-2 border border-zinc-300 dark:border-zinc-700">Internal Server Error</td>
            </tr>
            <tr>
              <td className="p-2 border border-zinc-300 dark:border-zinc-700">503</td>
              <td className="p-2 border border-zinc-300 dark:border-zinc-700">Service Unavailable - Temporary issues with the provider</td>
            </tr>
          </tbody>
        </table>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Supported Platforms</h2>
        <p className="mb-4">The API currently supports the following platforms:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-zinc-100 p-6 rounded-lg dark:bg-zinc-800">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-red-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              YouTube
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">Supports standard YouTube video URLs. Automatically selects the best available quality.</p>
            <div className="mt-4">
              <h4 className="font-medium">Example URLs:</h4>
              <ul className="list-disc pl-6 mt-2">
                <li>https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
                <li>https://youtu.be/dQw4w9WgXcQ</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-zinc-100 p-6 rounded-lg dark:bg-zinc-800">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-black">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              TikTok
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">Downloads TikTok videos without watermarks. Automatically selects the best MP4 format when available.</p>
            <div className="mt-4">
              <h4 className="font-medium">Example URLs:</h4>
              <ul className="list-disc pl-6 mt-2">
                <li>https://www.tiktok.com/@username/video/1234567890123456789</li>
                <li>https://vm.tiktok.com/ABCDEF/</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-zinc-100 p-6 rounded-lg dark:bg-zinc-800">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-zinc-900">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">Downloads videos from X (formerly Twitter). Automatically selects the highest quality version.</p>
            <div className="mt-4">
              <h4 className="font-medium">Example URLs:</h4>
              <ul className="list-disc pl-6 mt-2">
                <li>https://twitter.com/username/status/1234567890123456789</li>
                <li>https://x.com/username/status/1234567890123456789</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Rate Limiting</h2>
        <p className="mb-4">
          Currently, there are no rate limits enforced on the API. However, we reserve the right to
          implement rate limiting in the future to ensure fair usage and service stability.
        </p>
        <p>
          For high-volume applications, please consider implementing reasonable request throttling
          on your end to prevent service disruptions.
        </p>
      </section>
      
      <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700 text-center text-zinc-500 dark:text-zinc-400">
        <p>© 2025 VidDown API. All rights reserved.</p>
        <p className="mt-2">
          <Link href="/tos" className="text-indigo-600 hover:underline dark:text-indigo-400">Terms of Service</Link>
        </p>
      </footer>
    </main>
  );
}
