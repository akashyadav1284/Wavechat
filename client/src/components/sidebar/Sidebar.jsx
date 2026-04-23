import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, X } from "lucide-react";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import UserListItem from "./UserListItem";
import LoadingSkeleton from "../ui/LoadingSkeleton";

const Sidebar = () => {
  const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser, searchUsers, searchResults, isSearching, clearSearch } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      } else {
        clearSearch();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayUsers = searchQuery.trim() ? searchResults : users;
  const filteredUsers = showOnlineOnly
    ? displayUsers.filter((u) => onlineUsers.includes(u._id))
    : displayUsers;

  return (
    <div className="h-full flex flex-col w-full bg-transparent">
      {/* Header */}
      <div className="p-5 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <Users className="w-5 h-5 text-white" />
            </div>
            Messages
          </h2>
          <span className="text-xs font-medium text-zinc-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
            {onlineUsers.length - 1 > 0 ? onlineUsers.length - 1 : 0} online
          </span>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or @waveId..."
            className="w-full glass-input rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Online filter */}
        <label className="flex items-center gap-2 mt-4 cursor-pointer group w-fit">
          <div className="relative flex items-center justify-center w-4 h-4 rounded border border-zinc-600 bg-white/5 group-hover:border-zinc-400 transition-colors">
            <input type="checkbox" checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="absolute opacity-0 w-full h-full cursor-pointer" />
            {showOnlineOnly && <div className="w-2 h-2 rounded-sm bg-white" />}
          </div>
          <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Show online only</span>
        </label>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {isUsersLoading ? (
          <LoadingSkeleton type="user" count={6} />
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-600">
            <Users className="w-8 h-8 mb-3 opacity-40" />
            <p className="text-sm font-medium">{searchQuery ? "No users found" : "No conversations yet"}</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredUsers.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                isSelected={selectedUser?._id === user._id}
                isOnline={onlineUsers.includes(user._id)}
                onClick={() => setSelectedUser(user)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
