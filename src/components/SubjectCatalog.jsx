import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from './common/SEO';
import Pagination from './common/Pagination';

function SubjectCatalog() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subjects = useMemo(
    () => [
      { name: 'Algorithms', icon: 'mediation', desc: 'Complex problem solving and efficiency analysis.' },
      { name: 'Compiler Design', icon: 'settings_ethernet', desc: 'Lexical analysis and code generation techniques.' },
      { name: 'Computer Architecture', icon: 'memory', desc: 'Instruction sets, pipelining, and hardware logic.' },
      { name: 'Data Structures', icon: 'account_tree', desc: 'Linear and non-linear data organization models.' },
      { name: 'Frontend Dev', icon: 'devices', desc: 'Modern UI engineering with React and Frameworks.' },
      { name: 'Backend Systems', icon: 'dns', desc: 'Distributed server-side logic and scalability.' },
      { name: 'Discrete Maths', icon: 'function', desc: 'Logic, set theory, and computational foundations.' },
      { name: 'Robotics', icon: 'smart_toy', desc: 'Control systems and machine automation.' },
      { name: 'Software Testing', icon: 'bug_report', desc: 'QA protocols and automated test suites.' },
      { name: 'Web Assembly', icon: 'web_asset', desc: 'High-performance web execution via WASM.' },
      { name: 'Blockchain', icon: 'hub', desc: 'Decentralized ledgers and smart contracts.' },
      { name: 'UI/UX Design', icon: 'design_services', desc: 'User-centric interaction and visual design.' },
      { name: 'Edge Computing', icon: 'cloud_sync', desc: 'Low-latency processing at network edges.' },
      { name: 'System Design', icon: 'architecture', desc: 'Large scale infrastructure and microservices.' },
      { name: 'Bioinformatics', icon: 'biotech', desc: 'Computational biology and genomic analysis.' },
      { name: 'Quantum Computing', icon: 'flare', desc: 'Qubits, superposition, and quantum logic.' },
      { name: 'Big Data', icon: 'analytics', desc: 'Processing massive datasets with Hadoop/Spark.' },
      { name: 'High Perf Computing', icon: 'rocket_launch', desc: 'Parallel processing and cluster optimization.' },
      { name: 'Cryptography', icon: 'enhanced_encryption', desc: 'Secure communication and encryption algorithms.' },
      { name: 'Distributed Systems', icon: 'lan', desc: 'Consensus protocols and distributed state.' },
      { name: 'Natural Language Processing', icon: 'translate', desc: 'Text analysis, sentiment detection, and language models.' },
      { name: 'Cloud Computing', icon: 'cloud_queue', desc: 'AWS, Azure, GCP services and serverless architectures.' },
      { name: 'DevOps', icon: 'build_circle', desc: 'CI/CD pipelines, containerization, and infrastructure as code.' },
      { name: 'Mobile Development', icon: 'phone_android', desc: 'React Native, Flutter, and native iOS/Android apps.' },
      { name: 'Game Development', icon: 'gamepad', desc: 'Unity, Unreal Engine, and real-time interactive systems.' },
      { name: 'Computer Vision', icon: 'visibility', desc: 'Image recognition, object detection, and video analysis.' },
      { name: 'Reinforcement Learning', icon: 'switch_access', desc: 'Agent-based learning through rewards and environments.' },
      { name: 'Data Engineering', icon: 'transfer_within_a_station', desc: 'Data pipelines, ETL processes, and warehousing.' }
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

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);
  const infiniteLoaderRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(8);
    setLoadingMore(false);
  }, [isAuthenticated]);

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
    ? subjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : Array.from({ length: visibleCount }, (_, i) => subjects[i % subjects.length]);

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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isAuthenticated && currentPage === 1 && prioritySubjects.map((sub, index) => {
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
            totalItems={subjects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </>
  );
}

export default SubjectCatalog;