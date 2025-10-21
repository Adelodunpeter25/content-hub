interface NavbarProps {
  onLogin: () => void;
}

export default function Navbar({ onLogin }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-[70px] bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-b border-white/10 z-[1000] flex items-center">
      <div className="w-full max-w-[1600px] mx-auto px-20 flex justify-between items-center md:px-20 sm:px-5">
        <div className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Content Hub
        </div>
        <button
          onClick={onLogin}
          className="px-6 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(102,126,234,0.4)] transition-all"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
