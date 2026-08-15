import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicService } from '../../services/academicService';
import { studentService } from '../../services/studentService';
import { facultyService } from '../../services/facultyService';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

const BLANK = { name: '', code: '', hod: '' };

export function AdminDepartments() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState<{ name: string; code: string; hod: string }>(BLANK);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const { data: departments = [], isLoading: loadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => academicService.getDepartments()
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['adminStudents'],
    queryFn: () => studentService.getStudents()
  });

  const { data: faculty = [], isLoading: loadingFaculty } = useQuery({
    queryKey: ['adminFaculty'],
    queryFn: () => facultyService.getFaculty()
  });

  const createMutation = useMutation({
    mutationFn: (newDept: any) => academicService.createDepartment(newDept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setModal(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedDept: any) => {
      const { id, ...data } = updatedDept;
      return academicService.updateDepartment(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setModal(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academicService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    }
  });



  const openAdd = () => { setForm(BLANK); setModal('add'); };
  const openEdit = (d: any) => { setSelected(d); setForm({ name: d.name, code: d.code, hod: d.hod || d.hod_id || '' }); setModal('edit'); };
  const handleSave = () => {
    if (modal === 'add') createMutation.mutate({ name: form.name, code: form.code, hod: form.hod || 'TBD' });
    else if (modal === 'edit' && selected) updateMutation.mutate({ name: form.name, code: form.code, hod: form.hod || 'TBD', id: selected.id });
  };

  // Live counts from db
  const depts = departments.map((d: any) => ({
    ...d,
    liveStudents: students.filter((s: any) => s.department === d.name).length || d.totalStudents || 0,
    liveFaculty: faculty.filter((f: any) => f.department === d.name).length || d.totalFaculty || 0,
  }));

  if (loadingDepts || loadingStudents || loadingFaculty) {
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
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">Manage college departments</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus className="h-4 w-4" /> Add Department</button>
      </div>

      <div className="card p-0">
        <div className="table-wrapper border-0">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Department Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">HOD</th>
                <th className="px-4 py-3 text-right">Students</th>
                <th className="px-4 py-3 text-right">Faculty</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {depts.map((d: any) => (
                <tr key={d.id} className="table-row">
                  <td className="table-cell font-medium">{d.name}</td>
                  <td className="table-cell font-mono text-sm">{d.code}</td>
                  <td className="table-cell">{d.hod || d.hod_id || '—'}</td>
                  <td className="table-cell text-right">{d.liveStudents}</td>
                  <td className="table-cell text-right">{d.liveFaculty}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(d)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="h-4 w-4 text-slate-500" /></button>
                      <button onClick={() => setConfirmDelete(d)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Department' : 'Edit Department'}
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending} onClick={handleSave}>{modal === 'add' ? (createMutation.isPending ? 'Saving...' : 'Save') : 'Save Changes'}</button></>}
      >
        <div className="space-y-4">
          <div><label className="label">Department Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div><label className="label">Department Code</label><input className="input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required /></div>
          <div><label className="label">Head of Department (HOD)</label><input className="input" value={form.hod} onChange={e => setForm({...form, hod: e.target.value})} placeholder="e.g. Dr. Priya Mehta" /></div>
        </div>
      </Modal>


      <ConfirmDialog open={!!confirmDelete} title="Delete Department" message={`Delete "${confirmDelete?.name}" department? This cannot be undone.`} confirmLabel="Delete"
        onConfirm={() => { deleteMutation.mutate(confirmDelete!.id); setConfirmDelete(null); }} onClose={() => setConfirmDelete(null)} />
    </div>
  );
}
