import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hook/useAuth";
import { IoIosLogOut } from "react-icons/io";

function Logout() {
  const [isLoggingOut, setIsloggingOut] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  async function handleLogoutButton() {
    setIsloggingOut(true);
    setError(null);

    const result = await logout();
    if (!result.success) {
      setError(result.error);
      toast.error(result.error);
    }

    setIsloggingOut(false);
  }
  return (
    <div>
      {error && <div>{error}</div>}
      <span
        className="backdrop-blur-xs  
                bg-[rgba(145,144,144,0.21)] hover:bg-[rgba(145,144,144,0.53)] cursor-pointer flex text-xs rounded-[8px] p-1 mt-1.5 mr-1.5 text-amber-50 gap-1 items-center"
        onClick={handleLogoutButton}
        disabled={isLoggingOut}
      >
        <IoIosLogOut className="w-[50%]" />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </span>
    </div>
  );
}
export default Logout;
