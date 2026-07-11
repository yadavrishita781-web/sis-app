import { useState, useMemo } from 'react';
import { useMockDB } from '../../context/MockDB';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Faculty } from '../../types';
import { Plus, Pencil, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';

const BLANK: Omit<Faculty, 'id'> = {
  name: '', email: '', phone: '', department: 'Computer Science',
  designation: 'Assistant Professor', experience: '0 years', subjects: [],
};
const PAGE_SIZE = 8;

export function AdminFaculty() {
  const { state, addFaculty, updateFaculty, deleteFaculty } = useMockDB();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Faculty>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Faculty | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Faculty | null>(null);
  const [form, setForm] = useState<Omit<Faculty, 'id'>>(BLANK);
  const [subjectInput, setSubjectInput] = useState('');
  const [newCredentials, setNewCredentials] = useState<{email: string, password: string, id: string} | null>(null);

  const sorted = useMemo(() => {
    const q = search.toLowerCase();
    return [...state.faculty]
      .filter(f => f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q) || f.email.toLowerCase().includes(q))
      .sort((a, b) => {
        const av = String(a[sortKey] ?? ''), bv = String(b[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  }, [state.faculty, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sort = (key: keyof Faculty) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const SortIcon = ({ k }: { k: keyof Faculty }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />)
    : null;

  const openAdd = () => { setForm(BLANK); setSubjectInput(''); setModal('add'); };
  const openEdit = (f: Faculty) => { setSelected(f); setForm({ ...f }); setSubjectInput(f.subjects.join(', ')); setModal('edit'); };
  const openView = (f: Faculty) => { setSelected(f); setModal('view'); };

  const handleSave = () => {
    const withSubjects = { ...form, subjects: subjectInput.split(',').map(s => s.trim()).filter(Boolean) };
    if (modal === 'add') {
      const generatedId = 'F' + Math.random().toString(36).slice(2, 8).toUpperCase();
      const generatedPassword = Math.random().toString(36).slice(2, 10);
      const email = form.email || `${form.name.split(' ')[0].replace(/[^a-zA-Z]/g, '').toLowerCase()}.${generatedId.toLowerCase()}@sis.edu`;
      
      const newFaculty = { ...withSubjects, email };
      addFaculty(newFaculty, generatedId, generatedPassword);
      setNewCredentials({ email, password: generatedPassword, id: generatedId });
    }
    else if (modal === 'edit' && selected) {
      updateFaculty({ ...withSubjects, id: selected.id });
    }
    setModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Management</h1>
          <p className="page-subtitle">View, add, edit, or remove faculty members ({state.faculty.length} total)</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search faculty..." />
          <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Add Faculty</button>
        </div>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 cursor-pointer" onClick={() => sort('name')}>Faculty <SortIcon k="name" /></th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => sort('department')}>Department <SortIcon k="department" /></th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => sort('designation')}>Designation <SortIcon k="designation" /></th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {paged.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">No faculty found</td></tr>
              ) : paged.map(f => (
                <tr key={f.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      {f.avatar
                        ? <img src={f.avatar} className="h-8 w-8 rounded-full object-cover" alt={f.name} />
                        : <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-sm font-semibold text-emerald-700">{f.name.charAt(0)}</div>
                      }
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{f.name}</p>
                        <p className="text-xs text-slate-400">{f.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{f.department}</td>
                  <td className="table-cell">{f.designation}</td>
                  <td className="table-cell">{f.experience}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openView(f)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Eye className="h-4 w-4 text-slate-500" /></button>
                      <button onClick={() => openEdit(f)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="h-4 w-4 text-slate-500" /></button>
                      <button onClick={() => setConfirmDelete(f)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Showing {Math.min((page-1)*PAGE_SIZE+1, sorted.length)}–{Math.min(page*PAGE_SIZE, sorted.length)} of {sorted.length}</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded-lg text-sm transition-colors ${page === i+1 ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>{i+1}</button>
            ))}
          </div>
        </div>
      </div>

      <Modal open={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Faculty' : 'Edit Faculty'} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handleSave}>{modal === 'add' ? 'Add Faculty' : 'Save Changes'}</button></>}
      >
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div><label className="label">Email (Optional)</label><input type="email" className="input" placeholder="Leave blank to auto-generate" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div>
            <label className="label">Department</label>
            <select className="input" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
              {state.departments.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div><label className="label">Designation</label><input className="input" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} /></div>
          <div><label className="label">Experience</label><input className="input" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} /></div>
          <div className="col-span-2"><label className="label">Subjects (comma-separated)</label><input className="input" value={subjectInput} onChange={e => setSubjectInput(e.target.value)} placeholder="e.g. Data Structures, Algorithms" /></div>
        </div>
      </Modal>

      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Faculty Details" size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Close</button><button className="btn-primary" onClick={() => { setModal('edit'); setForm({...selected!}); setSubjectInput(selected!.subjects.join(', ')); }}>Edit</button></>}
      >
        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {([['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone], ['Department', selected.department], ['Designation', selected.designation], ['Experience', selected.experience], ['Subjects', selected.subjects.join(', ')]] as [string,string][]).map(([k,v]) => (
              <div key={k} className={k === 'Subjects' ? 'col-span-2' : ''}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{k}</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{v || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Faculty" message={`Delete "${confirmDelete?.name}"? This cannot be undone.`} confirmLabel="Delete"
        onConfirm={() => { deleteFaculty(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />

      {/* Success Dialog */}
      <Modal open={!!newCredentials} onClose={() => setNewCredentials(null)} title="Faculty Account Created" size="md"
        footer={<button className="btn-primary w-full" onClick={() => setNewCredentials(null)}>Done</button>}
      >
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
            <Eye className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-sm text-slate-500 mb-2">The new faculty account has been created successfully. Please copy the credentials below. The faculty member can use these to log in immediately.</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Faculty ID:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{newCredentials?.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Email/Username:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{newCredentials?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Temp Password:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{newCredentials?.password}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
