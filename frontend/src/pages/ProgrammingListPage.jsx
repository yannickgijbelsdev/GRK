import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Repeat, ChevronDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { schedule, weekdays, broadcasts } from '../mock';

const getCurrentDayId = () => {
  // 0 = Sunday, 1 = Monday
  const map = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  return map[new Date().getDay()];
};

const ProgrammingListPage = () => {
  const [activeDay, setActiveDay] = useState(getCurrentDayId());
  const day = weekdays.find((d) => d.id === activeDay);
  const items = schedule[activeDay] || [];

  // Slug helper: try to match against broadcasts ids for navigation
  const slugFor = (title) => {
    const found = broadcasts.find((b) => b.title.toLowerCase() === title.toLowerCase());
    return found ? `/programmering/${found.id}` : null;
  };

  return (
    <>
      <PageHeader title="Programmering" subtitle="Hier vind je de hele programmatie terug." />
      <section className="py-12 md:py-16 page-pad-bottom bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          {/* Day tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
            {weekdays.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                className={`px-4 md:px-5 py-2.5 rounded-2xl font-bold text-sm md:text-base transition-all duration-200 ${
                  activeDay === d.id
                    ? 'bg-white shadow-md text-[#062a4a] scale-105'
                    : 'text-[#4a6480] hover:text-[#062a4a] hover:bg-[#f0f4fa]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Day title */}
          <h2 className="text-[#062a4a] text-3xl md:text-5xl font-black tracking-tight mb-8 mt-12">{day.long}</h2>

          {/* Schedule cards */}
          <div className="space-y-4">
            {items.map((s) => {
              const link = !s.nonstop ? slugFor(s.title) : null;
              const Wrapper = link ? Link : 'div';
              const wrapperProps = link ? { to: link } : {};
              return (
                <Wrapper
                  key={s.id}
                  {...wrapperProps}
                  className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-[#e4ecf5]"
                >
                  <div className="flex items-center gap-4 md:gap-6 p-4 md:p-5">
                    <div className="flex-shrink-0 w-10 flex items-center justify-center text-[#2a5d99]">
                      {s.nonstop ? <Repeat size={22} /> : <ChevronDown size={22} className="text-[#4b8fcc]" />}
                    </div>
                    <div className="flex-shrink-0 w-24 md:w-32 text-[#4a6480] font-semibold text-sm md:text-base">{s.time}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#062a4a] text-lg md:text-xl font-bold leading-tight truncate">{s.title}</div>
                      {!s.nonstop && (
                        <div className="text-[#4a6480] text-sm md:text-base mt-0.5 truncate">{s.host}</div>
                      )}
                    </div>
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden" style={{ background: s.nonstop ? 'linear-gradient(135deg,#062a4a,#2a5d99)' : 'linear-gradient(135deg,#0a3a6b,#4b8fcc)' }}>
                      {s.nonstop ? (
                        <div className="w-full h-full flex items-center justify-center text-white font-black text-[10px] md:text-xs tracking-wider px-1 text-center">NON-STOP</div>
                      ) : (
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProgrammingListPage;
