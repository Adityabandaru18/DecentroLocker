import { Lock, User } from "lucide-react";
import useStore from "@/store";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { initializeContract, contractSigner } from "./contractTemplate";

const Navbar = () => {
  const { getWallet } = useStore();
  const [userWallet, setUserWallet] = useState("");
  const [userRole, setUserRole] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchWalletAndRole = async () => {
      try {
        const wallet = await getWallet();
        if (wallet) {
          setUserWallet(wallet);
          await initializeContract(wallet);
          const role = await contractSigner.getRole();
          setUserRole(Number(role));
        }
      } catch (error) {
        console.error("Error fetching wallet or role:", error);
      }
    };
    
    fetchWalletAndRole();
  }, [getWallet]);

  return (
    <nav className="bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-row items-center justify-between h-16">
          <Link to="/">
          <div className="flex items-center space-x-2">
            <Lock className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              DecentroLocker
            </span>
          </div>
          </Link>
          
          {userRole === 3 ? (
            <Link to="/admin/dashboard">
              <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer">
                <User className="w-6 h-6 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">{userWallet}</span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer">
              <User className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">{userWallet}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;