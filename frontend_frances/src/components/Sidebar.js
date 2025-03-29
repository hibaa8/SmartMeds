"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Activity, MessageSquare, Navigation, User, LogOut } from "react-feather"
import Logo from "./ui/Logo"

const navItems = [
  {
    name: "Medication",
    href: "/home",
    icon: Activity,
  },
  {
    name: "AI Assistant",
    href: "/chatbot",
    icon: MessageSquare,
  },
  {
    name: "Travel",
    href: "/travel",
    icon: Navigation,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

const Sidebar = () => {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-6">
        <Link to="/home" className="flex items-center space-x-2">
          <Logo size="small" />
          <span className="text-xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>Smart Med</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href 
                    ? "text-white" 
                    : "text-gray-700 hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor: location.pathname === item.href ? 'var(--color-primary)' : 'transparent',
                  ['--tw-hover-bg-opacity']: '0.1',
                  ['--tw-hover-bg']: 'var(--color-primary)',
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors w-full hover:bg-opacity-10"
          style={{
            ['--tw-hover-bg-opacity']: '0.1',
            ['--tw-hover-bg']: 'var(--color-primary)',
          }}
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

