import React, { useState } from 'react';

const PostCard = ({ post }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  // Toggle full content display
  const toggleContent = () => setShowFullContent(!showFullContent);

  // Safely handle post content
  const maxLength = 200;
  const content = post?.content || '';
  const contentPreview = content.length > maxLength && !showFullContent
    ? content.slice(0, maxLength) + "..."
    : content;

  // Fix: Correctly get author's name with fallback
  const authorName = post?.firstName && post?.lastName 
    ? `${post.firstName} ${post.lastName}` 
    : "Anonymous";

  // Safely handle post date
  const postDate = post?.createdAt 
    ? new Date(post.createdAt).toLocaleString()
    : '';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      {/* Post Header */}
      <div className="mb-2">
        <p className="font-bold">{authorName}</p>
        <p className="text-sm text-gray-500">
          {postDate}
        </p>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-4">
        {contentPreview}
        {content.length > maxLength && (
          <button onClick={toggleContent} className="text-blue-600 ml-1">
            {showFullContent ? "Show Less" : "Read More"}
          </button>
        )}
      </p>
    </div>
  );
};

export default PostCard;
