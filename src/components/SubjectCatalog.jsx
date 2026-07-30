import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from './common/SEO';
import Pagination from './common/Pagination';

function SubjectCatalog() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

  const subjects = useMemo(
    () => [
      { name: 'Physics', icon: 'science', desc: 'Fundamentals of mechanics, waves, and thermodynamics.' },
      { name: 'Mathematics 1-A', icon: 'calculate', desc: 'Foundational calculus and algebra for engineering students.' },
      { name: 'Basic Electrical Engineering', icon: 'electrical_services', desc: 'Circuits, Ohm’s law, and basic power systems.' },
      { name: 'Chemistry', icon: 'science', desc: 'Chemical reactions, materials science, and experimental principles.' },
      { name: 'Mathenatics-II', icon: 'functions', desc: 'Integral calculus, differential equations, and vector analysis.' },
      { name: 'Programming for problem solving', icon: 'terminal', desc: 'Coding logic and algorithmic thinking for practical problems.' },
      { name: 'English', icon: 'language', desc: 'Communication, grammar, and technical writing skills.' },
      { name: 'Analog and Digital Electronics', icon: 'memory', desc: 'Analog circuits, digital logic, and electronic systems.' },
      { name: 'DSA', icon: 'account_tree', desc: 'Data structures and algorithms for efficient computing.' },
      { name: 'Computer Organisation', icon: 'computer', desc: 'CPU architecture, instruction cycles, and memory systems.' },
      { name: 'Mathematics-III', icon: 'grid_view', desc: 'Linear algebra, probability, and numerical methods.' },
      { name: 'AnalogAndDigital Electronics', icon: 'memory', desc: 'Combined analog and digital electronics theory and practice.' },
      { name: 'Discrete Mathematchics', icon: 'functions', desc: 'Logic, sets, combinatorics, and graph theory fundamentals.' },
      { name: 'Computer Architecture', icon: 'architecture', desc: 'Processor design, pipelining, and system performance.' },
      { name: 'Formal Language And Automata', icon: 'code', desc: 'Grammar theory, automata, and language recognition models.' },
      { name: 'Design and Analysis Algorithm', icon: 'precision_manufacturing', desc: 'Algorithm design strategies and complexity analysis.' },
      { name: 'Biology', icon: 'biotech', desc: 'Biological systems, cells, and introductory life sciences.' },
      { name: 'Environment Science', icon: 'eco', desc: 'Ecosystems, sustainability, and environmental studies.' },
      { name: 'Software Engineering', icon: 'engineering', desc: 'Software development life cycle and quality practices.' },
      { name: 'Compiler Design', icon: 'settings_ethernet', desc: 'Compiler architecture, parsing, and code generation.' },
      { name: 'Operating Systems', icon: 'terminal', desc: 'Process management, concurrency, and memory control.' },
      { name: 'OOP', icon: 'category', desc: 'Object-oriented programming and design principles.' },
      { name: 'Introduction to Industrial management', icon: 'business', desc: 'Basics of industrial planning and organizational management.' },
      { name: 'Artificial Intelligence', icon: 'smart_toy', desc: 'AI concepts, learning models, and intelligent systems.' },
      { name: 'DBMS', icon: 'storage', desc: 'Database design, SQL, and data management systems.' },
      { name: 'Computer Networks', icon: 'router', desc: 'Network protocols, OSI layers, and communication systems.' },
      { name: 'DWDM', icon: 'share', desc: 'Optical communication using wavelength division multiplexing.' },
      { name: 'Advanced Algorithm', icon: 'insights', desc: 'Advanced algorithm techniques and optimization strategies.' },
      { name: 'HRD', icon: 'people', desc: 'Human resource development and organizational skills.' },
      { name: 'Research Methodology', icon: 'psychology', desc: 'Research design, methods, and academic investigation.' }
    ],
    []
  );

  const prioritySubjects = useMemo(
    () => [
      { name: 'Computer Networks', icon: 'router', color: 'primary', desc: 'Master OSI layers, TCP/IP protocols, and network architecture.', progress: 65, buttonType: 'continue' },
      { name: 'Operating Systems', icon: 'terminal', color: 'tertiary', desc: 'Process management, memory allocation, and kernel internals.', progress: 40, buttonType: 'continue' },
      { name: 'OOPS', icon: 'category', color: 'secondary-fixed-dim', desc: 'Encapsulation, inheritance, and polymorphic systems design.', buttonType: 'start' },
      { name: 'Database Management', icon: 'database', color: 'blue-400', desc: 'Relational algebra, SQL optimization, and NoSQL scaling.', progress: 12, buttonType: 'continue' }
    ],
    []
  );

  const filteredSubjects = useMemo(() => {
    if (!searchQuery) return subjects;
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery) ||
        s.desc.toLowerCase().includes(searchQuery)
    );
  }, [subjects, searchQuery]);

  const filteredPrioritySubjects = useMemo(() => {
    if (!searchQuery) return prioritySubjects;
    return prioritySubjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery) ||
        s.desc.toLowerCase().includes(searchQuery)
    );
  }, [prioritySubjects, searchQuery]);

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);
  const infiniteLoaderRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(8);
    setLoadingMore(false);
  }, [isAuthenticated, searchQuery]);

  useEffect(() => {
    if (isAuthenticated || !infiniteLoaderRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || loadingMore) return;
      setLoadingMore(true);
      setVisibleCount(prev => prev + 4);
      window.setTimeout(() => setLoadingMore(false), 250);
    }, { root: null, rootMargin: '250px', threshold: 0.1 });

    observer.observe(infiniteLoaderRef.current);
    return () => observer.disconnect();
  }, [isAuthenticated, loadingMore]);

  const getColorClasses = (color) => {
    const colors = {
      primary: { bg: 'bg-primary-container', text: 'text-primary', progress: 'bg-primary' },
      tertiary: { bg: 'bg-tertiary-container', text: 'text-tertiary', progress: 'bg-tertiary' },
      'secondary-fixed-dim': { bg: 'bg-secondary-container', text: 'text-secondary-fixed-dim', progress: 'bg-secondary-fixed-dim' },
      'blue-400': { bg: 'bg-blue-500/20', text: 'text-blue-400', progress: 'bg-blue-400' }
    };
    return colors[color] || colors.primary;
  };

  const handleSubjectClick = () => {
    if (!isAuthenticated) navigate('/signup');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const baseSubjects = isAuthenticated
    ? filteredSubjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : (filteredSubjects.length > 0
        ? Array.from({ length: visibleCount }, (_, i) => filteredSubjects[i % filteredSubjects.length])
        : []);

  return (
    <>
      <SEO
        title="Subject Catalog | Computer Science Courses"
        description="Browse computer science courses including Algorithms, Data Structures, Cloud Computing, DevOps, Frontend Development, Backend Systems, and more."
        keywords="algorithms, data structures, cloud computing, devops, frontend development, backend systems, computer networks, operating systems, oops, database, computer science courses"
        canonicalUrl="https://yoursite.com/"
      />

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-primary uppercase mb-2 block tracking-widest">Repository Access</span>
            <h2 className="text-3xl font-black text-on-surface">Subject Catalog</h2>
            {searchQuery && (
              <p className="text-sm text-on-surface-variant mt-2">
                Showing results for "{searchQuery}" ({filteredSubjects.length} found)
              </p>
            )}
          </div>
        </div>

        {searchQuery && filteredSubjects.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            No subjects found matching "{searchQuery}".
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isAuthenticated && currentPage === 1 && filteredPrioritySubjects.map((sub, index) => {
                const colors = getColorClasses(sub.color);
                return (
                  <div key={index} onClick={handleSubjectClick} className="glass-panel p-6 rounded-xl group hover:border-primary/50 transition-all cursor-pointer reveal-item">
                    <div className={`w-12 h-12 rounded ${colors.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <span className={`material-symbols-outlined ${colors.text}`}>{sub.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-on-surface">{sub.name}</h3>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{sub.desc}</p>
                    {sub.progress !== undefined && (
                      <>
                        <div className="w-full bg-white/5 h-1 rounded-full mb-4">
                          <div className={`${colors.progress} h-full rounded-full`} style={{ width: `${sub.progress}%` }} />
                        </div>
                        <button className="w-full py-2 bg-white/5 hover:bg-primary hover:text-on-primary text-xs font-bold uppercase tracking-widest transition-all rounded text-on-surface">
                          Continue {sub.progress}%
                        </button>
                      </>
                    )}
                    {sub.buttonType === 'start' && (
                      <button className="w-full py-2 bg-primary text-on-primary text-xs font-bold uppercase tracking-widest transition-all rounded neon-glow">
                        Start Course
                      </button>
                    )}
                  </div>
                );
              })}

              {baseSubjects.map((sub, index) => (
                <div
                  key={`${sub.name}-${index}`}
                  onClick={handleSubjectClick}
                  className="glass-panel p-6 rounded-xl group hover:border-primary/30 transition-all cursor-pointer reveal-item"
                >
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-xl">
                      {sub.icon}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 text-on-surface">{sub.name}</h3>
                  <p className="text-xs text-on-surface-variant mb-6 line-clamp-2">{sub.desc}</p>
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-[0.15em] transition-all rounded border border-white/5 text-on-surface">
                    Access Module
                  </button>
                </div>
              ))}
            </div>

            {!isAuthenticated && <div ref={infiniteLoaderRef} className="h-20" />}

            {loadingMore && !isAuthenticated && (
              <div className="mt-8 text-center text-sm text-on-surface-variant">Loading more subjects...</div>
            )}

            {isAuthenticated && (
              <Pagination
                currentPage={currentPage}
                totalItems={filteredSubjects.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}

export default SubjectCatalog;