import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //no user has logged in //null -no user
  const [loading, setLoading] = useState(true); //true means still checking if a user is logged in and app waits before showing login page

  useEffect(() => {
    const storedUser = localStorage.getItem("livepoll_user"); //Look in the browser's storage for a saved user (from a previous login).

    if (storedUser) {
      setUser(JSON.parse(storedUser)); //converts to an object and sets the user in state
    }
    setLoading(false); // Only turn off loading AFTER checking storage //shows the login page
  }, []);

  //on login save user in state,localStorage:
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("livepoll_user", JSON.stringify(userData));
  };

  //on logout remove user from state,localStorage:
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("livepoll_user");
  };

  return (
    // Context Provider:w.k.t
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
