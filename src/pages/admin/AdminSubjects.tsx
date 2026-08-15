import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicService } from '../../services/academicService';
import { facultyService } from '../../services/facultyService';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, SUBJECT_CREDITS } from '../../constants';

const BLANK = { name: '', code: '', credits: 3, department: 'Computer Science & Engineering', semester: 3, facultyId: '', facultyName: '' };

export function AdminSubjects() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState<{ name: string; code: string; credits: number; department: string; semester: number; facultyId: string; facultyName: string }>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicService.getSubjects()
  });

  const { data: departments = [], isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => academicService.getDepartments()
  });

  const { data: faculty = [], isLoading: loadingFaculty } = useQuery({
    queryKey: ['adminFaculty'],
    queryFn: () => facultyService.getFaculty()
  });

  const createMutation = useMutation({
    mutationFn: (newSubject: any) => academicService.createSubject(newSubject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setModal(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedSubject: any) => {
      const { id, ...data } = updatedSubject;
      return academicService.updateSubject(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setModal(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academicService.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    }
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return subjects.filter((s: any) => 
      (s.name || '').toLowerCase().includes(q) || 
      (s.code || '').toLowerCase().includes(q) || 
      (s.department || '').toLowerCase().includes(q)
    );
  }, [subjects, search]);

  const openAdd = () => { 
    setForm({ 
      ...BLANK, 
      department: departments[0]?.name || 'Computer Science & Engineering', 
      facultyId: faculty[0]?.id || '', 
      facultyName: faculty[0]?.name || '' 
    }); 
    setModal('add'); 
  };

  const openEdit = (s: any) => { 
    setSelected(s); 
    setForm({ 
      name: s.name, 
      code: s.code, 
      credits: s.credits, 
      department: s.department || departments[0]?.name || '', 
      semester: s.semester, 
      facultyId: s.facultyId || s.faculty_id || '', 
      facultyName: s.facultyName || s.faculty_name || '' 
    }); 
    setModal('edit'); 
  };

  const handleFacultyChange = (facultyId: string) => {
    const fac = faculty.find((f: any) => f.id === facultyId || f.user_id === facultyId);
    setForm(prev => ({ ...prev, facultyId, facultyName: fac?.name || '' }));
  };

  const handleSave = () => {
    const payload = {
      name: form.name,
      code: form.code,
      credits: form.credits,
      department: form.department,
      semester: form.semester,
      facultyId: form.facultyId,
      facultyName: form.facultyName
    };

    if (modal === 'add') {
      createMutation.mutate(payload);
    } else if (modal === 'edit' && selected) {
      updateMutation.mutate({ ...payload, id: selected.id });
    }
  };


  if (loadingSubjects || loadingDepartments || loadingFaculty) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subject Management</h1>
          <p className="page-subtitle">Manage subjects and assign faculty ({subjects.length} subjects)</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search subjects..." />
          <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Add Subject</button>
        </div>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Department / Sem</th>
                <th className="px-4 py-3">Assigned Faculty</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No subjects found</td></tr>
              ) : filtered.map((s: any) => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-medium">{s.name}</td>
                  <td className="table-cell font-mono text-sm">{s.code}</td>
                  <td className="table-cell">{s.credits}</td>
                  <td className="table-cell">{s.department} · Sem {s.semester}</td>
                  <td className="table-cell">{s.facultyName || (s as any).faculty_name || 'Unassigned'}</td>

                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="h-4 w-4 text-slate-500" /></button>
                      <button onClick={() => setConfirmDelete(s)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Subject' : 'Edit Subject'} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending} onClick={handleSave}>Save</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Subject Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Subject Code</label><input className="input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required /></div>
            <div>
              <label className="label">Credits</label>
              <select className="input" value={form.credits} onChange={e => setForm({...form, credits: +e.target.value})}>
                {SUBJECT_CREDITS.map(c => <option key={c} value={c}>{c} Credit{c > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <select className="input" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Semester</label>
              <select className="input" value={form.semester} onChange={e => setForm({...form, semester: +e.target.value})}>
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Assign Faculty</label>
            <select className="input" value={form.facultyId} onChange={e => handleFacultyChange(e.target.value)}>
              <option value="">Select Faculty...</option>
              {faculty.map((f: any) => <option key={f.id || f.user_id} value={f.id || f.user_id}>{f.name}</option>)}
            </select>
          </div>
        </div>

      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Subject" message={`Delete "${confirmDelete?.name}"? This cannot be undone.`} confirmLabel="Delete"
        onConfirm={() => { deleteMutation.mutate(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
