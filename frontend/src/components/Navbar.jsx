import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Navbar = ({ onLogout }) => {
  const navRef = useRef(null);
  const navigate = useNavigate()

  const handleLogout = ()=>{
    localStorage.removeItem('userAuth')
    navigate('/login', { replace: true })
  }

  useGSAP(() => {
    const showAnim = gsap.from(navRef.current, { 
      yPercent: -100,
      paused: true,
      duration: 0.3,
      ease: 'power2.out'
    }).progress(1);

    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        if (self.direction === 1) {
          showAnim.reverse();
        } else {
          showAnim.play();
        }
      }
    });
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full h-16 bg-[#0D1B1E] border-b border-[#846B8A] flex items-center justify-between px-6 z-[1000] box-border"
    >
      {/* Logo Name */}
      <div className="text-[#F4F7BE] text-xl font-bold tracking-wide">
        Workout Tracker
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-[#904C77] text-[#F4F7BE] border-none py-2 px-4 rounded-md font-semibold text-sm cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#846B8A] active:scale-95"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;