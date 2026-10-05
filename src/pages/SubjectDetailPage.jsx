import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSubjects } from '../context/SubjectsContext';
import SubjectMarkdown from '../components/SubjectMarkdown';
import { getMarkdownHeadings } from '../utils/subjectContentUtils';

function SubjectDetailPage() {
  const { subjectId } = useParams();
  const { subjects, loading, error } = useSubjects();
  const [activeLanguage, setActiveLanguage] = useState('');
  const [copyError, setCopyError] = useState('');
  const subject = subjects.find((item) => String(item.id) === subjectId);
  const snippets = (subject?.code_snippets || []).filter((snippet) => snippet.code.trim());
  const selectedLanguage = snippets.some((snippet) => snippet.language === activeLanguage)
    ? activeLanguage
    : snippets[0]?.language;
  const selectedSnippet = snippets.find((snippet) => snippet.language === selectedLanguage);
  const outline = getMarkdownHeadings(subject?.content_markdown || '');
  const allSubjects = [...subjects].sort((a, b) => a.name.localeCompare(b.name));
  const subjectIndex = allSubjects.findIndex((item) => String(item.id) === subjectId);
  const previousSubject = allSubjects[subjectIndex - 1];
  const nextSubject = allSubjects[subjectIndex + 1];
  const readingMinutes = Math.max(
    1,
    Math.ceil((subject?.content_markdown || '').trim().split(/\s+/).filter(Boolean).length / 200)
  );

  const copySnippet = async () => {
    if (!selectedSnippet) return;
    try {
      await navigator.clipboard.writeText(selectedSnippet.code);
      setCopyError('');
    } catch (clipboardError) {
      setCopyError(`Could not copy the snippet: ${clipboardError.message}`);
    }
  };

  if (loading) return <p className="mx-auto max-w-6xl px-6 py-16 text-slate-500">Loading subject...</p>;
  if (error) return <p role="alert" className="mx-auto max-w-6xl px-6 py-16 text-rose-600">{error}</p>;
  if (!subject) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Subject not found</h1>
        <p className="mt-2 text-slate-500">This subject may be unpublished or no longer available.</p>
        <Link to="/#subjects" className="mt-6 inline-block text-emerald-700 hover:text-emerald-800">Back to subjects</Link>
      </section>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f9fc] text-slate-800">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[235px_minmax(0,1fr)] lg:gap-8">
        <aside className="hidden lg:block">
          <Link to="/#subjects" className="flex items-center gap-2 border-b border-slate-200 pb-5 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Subject Catalog
          </Link>
          <nav aria-label="Subject contents" className="sticky top-24 pt-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{subject.name} basics</p>
            <a href="#subject-overview" className="mb-1 block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-800">
              Overview
            </a>
            {outline.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`mb-1 block rounded-md px-3 py-2 text-sm transition hover:bg-emerald-50 hover:text-emerald-800 ${heading.level > 2 ? 'pl-6 text-slate-500' : 'text-slate-600'}`}
              >
                {heading.title}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="mb-4 flex items-center gap-2 overflow-hidden text-[11px] text-slate-400">
            <Link to="/" className="shrink-0 hover:text-emerald-700">⌂ Catalog</Link>
            <span>/</span>
            <span className="truncate">{subject.domain}</span>
            <span>/</span>
            <span className="truncate font-semibold text-slate-700">{subject.name}</span>
          </div>

          <header id="subject-overview" className="mb-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-emerald-50 p-5 shadow-sm sm:p-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {subject.domain}
            </span>
            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-4xl">{subject.name}</h1>
            {subject.description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{subject.description}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">account_circle</span>By <strong className="text-slate-700">{subject.author}</strong></span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">calendar_today</span>Published <time dateTime={subject.publish_date} className="text-slate-700">{subject.publish_date}</time></span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">schedule</span>{readingMinutes} min read</span>
            </div>
          </header>

          {subject.content_markdown && (
            <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SubjectMarkdown content={subject.content_markdown} />
            </section>
          )}

          {snippets.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xs font-bold text-slate-800">Code examples</h2>
                  <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">{selectedLanguage}</span>
                </div>
                <button type="button" onClick={copySnippet} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700">
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy
                </button>
              </div>
              {snippets.length > 1 && (
                <div className="flex gap-1 overflow-x-auto border-b border-slate-800 bg-[#10192c] px-4">
                  {snippets.map((snippet) => (
                    <button
                      key={snippet.language}
                      type="button"
                      onClick={() => setActiveLanguage(snippet.language)}
                      className={`shrink-0 border-b-2 px-3 py-2.5 font-mono text-[11px] ${selectedLanguage === snippet.language ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                      {snippet.language}
                    </button>
                  ))}
                </div>
              )}
              <pre className="max-h-[520px] min-h-40 overflow-auto bg-[#10192c] p-5 text-xs leading-6 text-emerald-200 sm:p-6">
                <code>{selectedSnippet?.code}</code>
              </pre>
              {copyError && <p role="alert" className="border-t border-slate-100 px-4 py-2 text-xs text-rose-600">{copyError}</p>}
            </section>
          )}

          <nav aria-label="Previous and next subjects" className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            {previousSubject ? (
              <Link to={`/subjects/${previousSubject.id}`} className="max-w-[48%] rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700">
                <span className="block text-[10px] font-normal text-slate-400">‹ Previous</span>
                <span className="block truncate">{previousSubject.name}</span>
              </Link>
            ) : <span />}
            {nextSubject && (
              <Link to={`/subjects/${nextSubject.id}`} className="ml-auto max-w-[48%] rounded-lg bg-emerald-600 px-4 py-2.5 text-right text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
                <span className="block text-[10px] font-medium text-emerald-100">Next ›</span>
                <span className="block truncate">{nextSubject.name}</span>
              </Link>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}

export default SubjectDetailPage;
