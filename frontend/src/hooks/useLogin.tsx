import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	// Dynamically set backend URL

	const login = async (username: string, password: string) => {
		try {
			setLoading(true);
			const res = await fetch(`${backendUrl}/api/auth/login`, {

				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
				credentials: "include", // ✅ important!
			});
			

			const data = await res.json();

			if (!res.ok) throw new Error(data.error);
			setAuthUser(data);
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;
