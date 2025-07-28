'use client';
import { useState } from 'react';

export default function NewArticlePage() {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    author: 'Nima Saraian',
    coverImage: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (selectedFile) payload.coverImage = selectedFile.name;

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
      alert('✅ Article submitted successfully!');
    } catch (err) {
      alert('❌ Error submitting article.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-zinc-900 p-10 rounded-xl shadow-xl border border-zinc-800 space-y-10">
        <h2 className="text-center text-2xl font-bold mb-6">Submit New Article</h2>

        {/* Title */}
        <div>
          <label className="block mb-3 font-semibold">Article Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter article title"
            className="w-full p-4 rounded bg-white text-black placeholder-gray-500"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block mb-3 font-semibold">Short Summary*</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
            required
            placeholder="Brief summary of your article"
            className="w-full p-4 rounded bg-white text-black placeholder-gray-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-3 font-semibold">Full Content*</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={7}
            required
            placeholder="Full content of your article"
            className="w-full p-4 rounded bg-white text-black placeholder-gray-500"
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block mb-3 font-semibold">Upload Cover Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full file:mr-4 file:py-2 file:px-6 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 text-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-3 font-semibold">Select Category*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-4 rounded bg-white text-black"
          >
            <option value="">-- Choose a category --</option>
            <option value="ai">AI Articles</option>
            <option value="psychology">Psychology Articles</option>
            <option value="marketing">Marketing Articles</option>
            <option value="daily">Daily Articles</option>
          </select>
        </div>

        {/* Author */}
        <div>
          <label className="block mb-3 font-semibold">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-4 rounded bg-white text-black"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-4 pt-6">
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded transition"
          >
            🚀 Submit Article
          </button>
          <button
            type="reset"
            className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-8 rounded transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
