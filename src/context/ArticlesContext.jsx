/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';

const ArticlesContext = createContext(null);
const STORAGE_KEY = 'csehub-articles';

export const selectionSortArticle = {
  id: 'selection-sort-algorithm',
  category: 'DSA',
  date: 'Oct 3, 2026',
  authorName: 'Alex Morgan',
  title: 'Selection Sort Algorithm',
  subtitle: 'A simple comparison sort that builds the ordered list one item at a time.',
  content: `1. Introduction\n\nSelection sort is an in-place comparison algorithm. It repeatedly finds the smallest value in the unsorted region and moves it to the end of the sorted region.\n\n2. Core Principles\n\n- Sorted region: the prefix at the start of the array.\n- Unsorted region: the remaining values that still need to be examined.\n- Each pass selects the minimum value and swaps it into its final position.\n\n3. Complexity\n\nSelection sort takes O(n²) comparisons in the best, average, and worst cases. It uses O(1) additional space.`,
  codeBlocks: [
    {
      language: 'Python',
      code: `def selection_sort(values):\n    for start in range(len(values)):\n        minimum = start\n        for current in range(start + 1, len(values)):\n            if values[current] < values[minimum]:\n                minimum = current\n        values[start], values[minimum] = values[minimum], values[start]\n    return values\n\nprint(selection_sort([64, 25, 12, 22, 11]))`,
    },
  ],
};

function readStoredArticles() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [selectionSortArticle];
    const articles = JSON.parse(stored);
    return Array.isArray(articles) ? articles : [selectionSortArticle];
  } catch {
    return [selectionSortArticle];
  }
}

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState(readStoredArticles);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const saveArticle = (article) => {
    setArticles((current) => {
      const exists = current.some((item) => item.id === article.id);
      return exists
        ? current.map((item) => (item.id === article.id ? article : item))
        : [article, ...current];
    });
  };

  const deleteArticle = (id) => {
    setArticles((current) => current.filter((article) => article.id !== id));
  };

  return (
    <ArticlesContext.Provider value={{ articles, saveArticle, deleteArticle }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) throw new Error('useArticles must be used within ArticlesProvider');
  return context;
}