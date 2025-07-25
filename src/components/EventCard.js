// src/components/EventCard.js
import { useRouter } from "next/router";

const EventCard = ({ event }) => {
  const router = useRouter();
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  // Format date to show only "MMM DD" (e.g., "Apr 02")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleClick = () => {
    router.push(`/events/${event.eventId || event.id}`);
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm mb-3 cursor-pointer 
      hover:shadow-md transition-all duration-200 border-l-4
      ${isPastEvent ? "border-gray-300 opacity-80" : "border-maroon"}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-md font-semibold text-gray-800 mb-1 line-clamp-1">
          {event.title}
        </h2>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            isPastEvent ? "bg-gray-200 text-gray-600" : "bg-maroon text-white"
          }`}
        >
          {isPastEvent ? "Past" : "Upcoming"}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
        {event.description || "No description available."}
      </p>

      <div className="flex items-center text-xs text-gray-500">
        <svg
          className="w-3 h-3 mr-1 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {formatDate(event.date)}

        {event.location && (
          <>
            <svg
              className="w-3 h-3 ml-3 mr-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{event.location}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default EventCard;
