import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { getUser } from "../features/auth/authUtils";
import { baseApi } from "../services/baseApi";
import { useDispatch } from "react-redux";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth.user) || getUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = user?._id || user?.id;

    // Only connect if user is logged in
    if (!userId) return;

    // Extract base URL without /api if VITE_API_URL includes it
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";
    const newSocket = io(baseUrl, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("register", userId);
    });

    newSocket.on("new_notification", (notification) => {
      dispatch(baseApi.util.invalidateTags(["Notification"]));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id, user?.id, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
