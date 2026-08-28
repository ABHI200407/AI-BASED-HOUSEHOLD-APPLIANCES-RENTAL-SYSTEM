import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const columns = [
    {
      title: "Bedroom",
      items: ["Beds", "Kids Crib", "Queen Beds", "Storage Beds", "King Beds", "Single Beds", "Bedside Tables", "Mattress", "Bedroom Combos", "Kids Bed", "Compact Double Bed"]
    },
    {
      title: "Living Room",
      items: ["Sofas", "Kids Seating", "3 Seater", "Sofa Sets", "2 Seater", "1 Seater", "Recliner", "L Shape", "Sofa Cum Bed", "Multifunctional", "Centre Tables", "Living Room Combos"]
    },
    {
      title: "Appliances",
      items: ["Washing machines", "Refrigerators", "TV", "Microwave", "Water Purifier", "Appliance Combos", "AC"]
    },
    {
      title: "Storage",
      items: ["Wardrobes", "Chest of Drawers", "Entertainment Units", "Dressing Table", "Bookshelves", "Shoe Racks", "Storage Combos"]
    },
    {
      title: "Study",
      items: ["Workstations", "Study Tables", "Office Chairs", "Study Combos"]
    }
  ];

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 font-bold text-slate-700 hover:text-teal-600 transition-colors py-6">
        RENT <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mega Menu Dropdown */}
      <div 
        className={`absolute top-full -left-20 w-[900px] bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 origin-top ${
          isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
        <div className="p-8 grid grid-cols-5 gap-8">
          {columns.map((col, idx) => (
            <div key={idx}>
              <h3 className="font-extrabold text-teal-700 mb-4 pb-2 border-b border-teal-50">{col.title}</h3>
              <ul className="space-y-3">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <Link to="/category/all" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors inline-block w-full">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center px-8">
          <div className="text-sm text-slate-500 font-medium">Looking for complete room setups?</div>
          <Link to="/category/all" className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group/link">
            Explore Curated Combos <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
