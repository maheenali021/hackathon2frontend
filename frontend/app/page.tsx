import Link from 'next/link';
import { ArrowRight, CheckSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1F1B24] flex flex-col items-center justify-center text-white relative overflow-hidden">

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 text-center max-w-2xl px-6">
        <div className="mb-6 flex justify-center text-purple-400">
          <CheckSquare size={64} />
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
          TaskEvo
        </h1>
        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
          The evolution of task management. <br />
          Experience a calm, focus-driven environment designed for productivity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="neu-btn-primary px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 text-lg w-full sm:w-auto justify-center"
          >
            <span>Get Started</span>
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/auth/login"
            className="neu-btn px-8 py-4 rounded-xl font-semibold text-gray-300 hover:text-white flex items-center justify-center w-full sm:w-auto"
          >
            <span>Login</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 text-gray-600 text-sm">
        © 2026 TaskEvo. Built for calmness.
      </div>
    </div>
  );
}
