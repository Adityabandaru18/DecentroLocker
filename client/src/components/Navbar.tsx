import { Lock, User } from "lucide-react"

const Navbar = () => {
  return (
    <nav className=" bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
    <div className="container mx-auto px-6">
      <div className="flex flex-row items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <Lock className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
            DecentroLocker
          </span>
        </div>
        <div>
          <User className="w-6 h-6 text-gray-900 cursor-pointer" />
        </div>
      
      </div>
    </div>
  </nav>
  )
}

export default Navbar
