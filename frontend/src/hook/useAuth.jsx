import { useContext } from "react";
import AuthContext from "../components/authProvider";
export function useAuth() {
  return useContext(AuthContext);
}
