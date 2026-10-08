import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubjects } from '../context/SubjectsContext';
import SEO from './common/SEO';
import Pagination from './common/Pagination';

const ITEMS_PER_PAGE = 12;

// Domain taxonomy matching backend apps/subjects/models.py DOMAINS
const DOMAIN_TAXONOMY = {
  all: { code: 'all', label: 'All' },
  DSA: { code: 'DSA', label: 'DSA' },
  'Web Development': { code: 'Web Development', label: 'Web Development' },
  'Machine Learning': { code: 'Machine Learning', label: 'Machine Learning' },
  Systems: { code: 'Systems', label: 'Systems' },
  Programming: { code: 'Programming', label: 'Programming' },
};

function SubjectCatalog() {
  const { isAuthenticated } = useAuth();
  const { subjects, loading, error } = useSubjects();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();
  const [pageState, setPageState] = useState({ query: searchQuery, page: 1 });
  const [selectedDomain, setSelectedDomain] = useState('all');
  const currentPage = pageState.query === searchQuery ? pageState.page : 1;

  const filteredSubjects = useMemo(() => {
    let result = subjects;

    // Apply domain filter
    if (selectedDomain !== 'all') {
      result = result.filter((subject) => subject.domain === selectedDomain);
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter((subject) => (
        subject.name.toLowerCase().includes(searchQuery)
        || subject.description.toLowerCase().includes(searchQuery)
      ));
    }

    return result;
  }, [subjects, searchQuery, selectedDomain]);

  const visibleSubjects = filteredSubjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <SEO
        title="Subject Catalog | Computer Science Courses"
        description="Browse the subjects available in CSEHub."
        keywords="computer science, subjects, courses"
        canonicalUrl="https://yoursite.com/"
      />

      <section id="subjects" className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">Repository Access</span>
            <h2 className="text-3xl font-black text-on-surface">Subject Catalog</h2>
            {searchQuery && (
              <p className="mt-2 text-sm text-on-surface-variant">
                Showing results for "{searchQuery}" ({filteredSubjects.length} found)
              </p>
            )}
            {/* Domain Taxonomy Filter Tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.values(DOMAIN_TAXONOMY).map((domain) => (
                <button
                  key={domain.code}
                  onClick={() => {
                    setSelectedDomain(domain.code);
                    setPageState({ query: searchQuery, page: 1 });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${
                    selectedDomain === domain.code
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-[#0b1426] text-slate-400 border-[#22314c] hover:text-cyan-400 hover:border-cyan-400/40'
                  }`}
                >
                  {domain.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && <p className="py-12 text-center text-on-surface-variant">Loading subjects...</p>}
        {!loading && error && <p role="alert" className="py-12 text-center text-rose-300">{error}</p>}
        {!loading && !error && filteredSubjects.length === 0 && (
          <p className="py-16 text-center text-on-surface-variant">
            {searchQuery ? `No subjects found matching "${searchQuery}".` : 'No subjects have been added yet.'}
          </p>
        )}

        {!loading && !error && visibleSubjects.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="group relative flex min-h-[310px] flex-col overflow-hidden rounded-2xl border border-[#22314c] bg-[linear-gradient(145deg,#142139_0%,#0b1426_100%)] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_45px_rgba(6,182,212,0.08)]"
                >
                  <div className="mb-7 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-[#0b1426]/80 px-2.5 py-1 font-mono text-[9px] text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                      Learning Module Verified
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-500">CSE-2026</span>
                    </span>
                  </div>

                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/70 bg-[#18253c]">
                      <span className="material-symbols-outlined text-xl text-cyan-400">
                        {subject.icon || 'school'}
                      </span>
                    </div>
                    <span className="mt-2 rounded border border-slate-700/60 bg-[#101b30] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-slate-400">
                      Core Unit
                    </span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-extrabold uppercase leading-tight tracking-tight text-white">
                    {subject.name}
                  </h3>
                  <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {subject.domain}
                  </p>
                  {subject.description && (
                    <p className="mb-5 w-fit max-w-full truncate rounded border border-slate-700/60 bg-[#101b30] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                      <span className="mr-2 text-cyan-400">&gt;</span>{subject.description}
                    </p>
                  )}

                  <div className="mt-auto mb-5 flex items-center justify-between gap-2 border-t border-slate-700/60 pt-4 text-[10px] text-slate-300">
                    <span className="flex min-w-0 items-center gap-1.5 truncate">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/20 font-mono text-[9px] text-indigo-200">
                        {(subject.author || 'A').charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">By <strong className="text-white">{subject.author}</strong></span>
                    </span>
                    <time dateTime={subject.publish_date} className="flex shrink-0 items-center gap-1 rounded border border-slate-700/60 bg-[#101b30] px-2 py-1 font-mono text-[9px] text-slate-400">
                      <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                      {subject.publish_date}
                    </time>
                  </div>

                  <Link
                    to={isAuthenticated ? `/subjects/${subject.id}` : '/signup'}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#17243a] py-3 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:border-cyan-400/40 hover:bg-[#1c2b44]"
                  >
                    Subject <span className="text-sm text-cyan-400">→</span>
                  </Link>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredSubjects.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={(page) => setPageState({ query: searchQuery, page })}
            />
          </>
        )}
      </section>
    </>
  );
}

export default SubjectCatalog;
