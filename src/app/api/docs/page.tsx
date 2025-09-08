"use client";
import { useState } from "react";

export default function ApiDocsPage() {
  const [testUrl, setTestUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

  return (
    <main className="container-2xl py-16 px-4">
      <h1 className="text-3xl sm:text-5xl font-bold mb-8">VidDown API Documentation</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">API v1</h2>
        <p className="mb-4">
          The VidDown API allows you to download videos from popular social media platforms 
          including YouTube, TikTok, and X (Twitter) programmatically.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 dark:bg-yellow-900/30 dark:border-yellow-600">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> The API is currently in beta and does not require authentication.
            Rate limiting may be applied in the future.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
        
        <div className="bg-zinc-100 p-6 rounded-lg mb-8 dark:bg-zinc-800">
          <div className="flex items-center mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">GET</span>
            <code className="text-lg">/api/v1/resolve</code>
          </div>
          <p className="mb-4">Resolves a video URL and returns information about available formats.</p>
          
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
      "url": "/api/v1/download?url=https://example.com&quality=1080p"
    },
    {
      "quality": "720p",
      "type": "video/mp4",
      "url": "/api/v1/download?url=https://example.com&quality=720p"
    }
  ],
  "directDownloadUrl": "/api/v1/download?url=https://example.com"
}`}
          </pre>
        </div>
        
        <div className="bg-zinc-100 p-6 rounded-lg dark:bg-zinc-800">
          <div className="flex items-center mb-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">GET</span>
            <code className="text-lg">/api/v1/download</code>
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
        
        <h3 className="text-xl font-medium mb-2">Direct Download</h3>
        <p className="mb-4">For a simple download, just use the download endpoint with the video URL:</p>
        <pre className="bg-zinc-200 p-4 rounded mb-6 dark:bg-zinc-700 overflow-x-auto">
{`GET /api/v1/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
        </pre>
        
        <h3 className="text-xl font-medium mb-2">Resolve First, Then Download</h3>
        <p className="mb-4">To get information about the video before downloading:</p>
        <pre className="bg-zinc-200 p-4 rounded mb-6 dark:bg-zinc-700 overflow-x-auto">
{`// Step 1: Resolve the video to get information
GET /api/v1/resolve?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ

// Step 2: Use the directDownloadUrl from the response to download
GET /api/v1/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
        </pre>
        
        <h3 className="text-xl font-medium mb-4">Try It Out</h3>
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
              href={`/api/v1/resolve?url=${encodeURIComponent(testUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-md bg-zinc-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-zinc-500"
            >
              Test Resolve API
            </a>
            <a
              href={`/api/v1/download?url=${encodeURIComponent(testUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              Test Download API
            </a>
          </div>
        </div>
      </section>
      
      <section>
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
    </main>
  );
}
