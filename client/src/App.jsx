import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { syncAuth } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Sync auth from localStorage when app starts
    dispatch(syncAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
