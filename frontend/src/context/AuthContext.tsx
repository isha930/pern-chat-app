import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type AuthUserType = {
	id: string;
	fullName: string;
	email: string;
	profilePic: string;
	gender: string;
};

const AuthContext = createContext<{
	authUser: AuthUserType | null;
	setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
	isLoading: boolean;
}>({
	authUser: null,
	setAuthUser: () => {},
	isLoading: true,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// logic will go here
	useEffect(() => {
		const fetchAuthUser = async () => {
			try {
				const res = await fetch("/api/auth/me", {
					method: "GET", // GET request
					credentials: "include", // This will include the cookies (JWT) in the request
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error);
				}
				setAuthUser(data); // Set the authenticated user info
			} catch (error) {
				console.error("Error:", error.message);
				toast.error(error.message); // Display error to the user
			} finally {
				setIsLoading(false);
			}
		};

		fetchAuthUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				authUser,
				isLoading,
				setAuthUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
