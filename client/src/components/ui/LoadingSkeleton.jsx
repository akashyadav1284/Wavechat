const LoadingSkeleton = ({ type = "user", count = 5 }) => {
  if (type === "user") {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
            <div className="skeleton w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "message") {
    return (
      <div className="space-y-4 p-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`skeleton rounded-2xl ${
                i % 2 === 0 ? "w-2/3" : "w-1/2"
              }`}
              style={{ height: `${40 + Math.random() * 40}px` }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === "chat-header") {
    return (
      <div className="flex items-center gap-3 p-4">
        <div className="skeleton w-10 h-10 rounded-full shrink-0" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
