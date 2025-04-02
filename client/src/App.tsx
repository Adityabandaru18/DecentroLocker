import React, {useState} from 'react';
import { Shield, Lock, Share2, Database, Server, UserCircle, ChevronRight } from 'lucide-react';
import { Link } from "react-scroll";
import { Modal } from './components/Modal';
import { ChatBot } from './components/ChatBot';
import { Link as RouterLink } from "react-router-dom";
import { SpeedInsights } from '@vercel/speed-insights/react';

function Feature({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <Icon className="w-12 h-12 text-indigo-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-2">
              <Lock className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                DecentroLocker
              </span>
            </div>
          
          </div>
        </div>
      </nav>

      {/* Main Content with padding-top to account for fixed header */}
      <div className="pt-16">
        {/* Hero Section */}
        <header className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-12 md:mb-0">
                <p className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Secure Your Digital Assets with Blockchain
                </p>
                <p className="text-xl text-gray-600 mb-8">
                  Store, manage, and share your important documents securely using our decentralized DigiLocker platform authorised <br></br>by UIDAI officials.
                </p>
                <div className="flex gap-4">
                  <Link to="section" smooth={true} duration={700} className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center">
                    Get Started <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=800&q=80" 
                  alt="Secure Digital Storage"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-20 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DecentroLocker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature 
              icon={Shield}
              title="Enhanced Security"
              description="Military-grade encryption and blockchain technology ensure your documents are safe and tamper-proof."
            />
            <Feature 
              icon={Database}
              title="Decentralized Storage"
              description="Your documents are stored across a distributed network, eliminating single points of failure."
            />
            <Feature 
              icon={Share2}
              title="Easy Sharing"
              description="Share documents securely with selected individuals or organizations with granular access control."
            />
            <Feature 
              icon={Server}
              title="Always Available"
              description="Access your documents 24/7 from anywhere in the world with guaranteed uptime."
            />
            <Feature 
              icon={Lock}
              title="Complete Privacy"
              description="Zero-knowledge proofs ensure that only you have access to your sensitive information."
            />
            <Feature 
              icon={UserCircle}
              title="User Control"
              description="Maintain full control over your documents with cryptographic ownership proof."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20" id='section'>
          <div className="bg-indigo-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join Decentralised India!
            </h2>

            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Why carry your documents everywhere when all your government-verified records are securely stored in one place? Simplify your life with a single, trusted solution!     
           </p>

            <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"  onClick={() => setIsModalOpen(true)}>
              Sign Up Now
            </button>


            <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Remember !"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
          Make sure to remember your wallet password. If you forget it, you'll need to create a new account, which will result in the loss of your existing data.          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <RouterLink to="/login">Proceed</RouterLink>
            </button>
          </div>
        </div>
      </Modal>


          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Lock className="w-8 h-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold">DecentroLocker</span>
            </div>
            <div className="text-gray-600">
              © {new Date().getFullYear()} DecentroLocker. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      <ChatBot />
      <SpeedInsights />
    </div>
  );
}

export default App;