import { Calendar, Option, PersonStanding, Store } from 'lucide-react';

const Navbar = () => {
  return (
    <nav
      className="flex items-center justify-between px-8 py-4 border-b font-sans"
      style={{
        backgroundColor: '#040D12', // colors.background
        borderColor: '#5C8374', // colors.border
      }}
    >
      <div>
        <a
          href="/"
          className="text-xl font-bold"
          style={{ color: '#ffffff' }} // colors.textWhite
        >
          SlotSwapper
        </a>
      </div>

      <div className="flex items-center gap-8">
        <a
          href="/marketplace"
          className="flex items-center gap-2 transition-colors duration-300"
          style={{ color: '#93B1A6' }} // colors.textLight
          onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#93B1A6')}
        >
          <Store />
          <span>Marketplace</span>
        </a>

        <a
          href="/dashboard"
          className="flex items-center gap-2 transition-colors duration-300"
          style={{ color: '#93B1A6' }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#93B1A6')}
        >
          <Calendar />
          <span>Calendar</span>
        </a>

        <a
          href="#options"
          className="flex items-center gap-2 transition-colors duration-300"
          style={{ color: '#93B1A6' }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#93B1A6')}
        >
          <Option />
          <span>Options</span>
        </a>
      </div>

      <div>
        <a
          href="#profile"
          className="text-2xl transition-colors duration-300"
          style={{ color: '#A27B5C' }} // colors.primary
          onMouseOver={(e) => (e.currentTarget.style.color = '#b58e70')} // colors.primaryHover
          onMouseOut={(e) => (e.currentTarget.style.color = '#A27B5C')}
        >
          <PersonStanding />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
