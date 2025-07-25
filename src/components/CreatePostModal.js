import { useCallback, useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { createPost } from "../services/post.service";

const CreatePostModal = ({ isOpen, onClose, onPostAdded }) => {
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setContent("");
            setError("");
            setLoading(false);
        }
    }, [isOpen]);

    // Debugging: Check if user data is being received
    //useEffect(() => {
    //    console.log("User data in CreatePostModal:", user);
    //}, [user]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError("");
    
        if (!content.trim()) {
            setError("Post content cannot be empty.");
            return;
        }
    
        if (!user?.userId) {
            setError("User not authenticated. Please log in again.");
            console.error("User data:", user);
            return;
        }
    
        setLoading(true);
    
        try {
            const newPost = await createPost({
                userId: user.userId,
                content: content.trim()
            });
            onPostAdded(newPost);
            setContent("");
            onClose();
        } catch (error) {
            console.error("Error creating post:", error);
            setError(error.message || "Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [content, user, onPostAdded, onClose]);
    
    
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Create Post</h2>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                            {error}
                        </div>
                    )}
                    <textarea
                        className="w-full border p-2 rounded"
                        placeholder="Write something..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-maroon text-white py-2 px-4 rounded-md mt-3 w-full relative"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="opacity-0">Post</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </>
                        ) : (
                            "Post"
                        )}
                    </button>
                </form>
                <button 
                    onClick={onClose} 
                    className="mt-2 text-gray-500 underline"
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreatePostModal;
