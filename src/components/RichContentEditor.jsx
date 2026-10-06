import ReactQuill from 'react-quill-new';
import katex from 'katex';
import 'react-quill-new/dist/quill.snow.css';
import 'katex/dist/katex.min.css';

if (typeof window !== 'undefined') window.katex = katex;

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block', 'formula', 'link'],
    ['clean'],
  ],
  clipboard: { matchVisual: false },
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet',
  'script', 'blockquote', 'code-block', 'formula', 'link',
];

function RichContentEditor({ value, onChange }) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder="Paste or write your subject content here..."
      className="min-h-[40rem] bg-white text-slate-900"
    />
  );
}

export default RichContentEditor;
