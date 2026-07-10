import React, { useState, useEffect } from 'react';
import residentService from '../../../services/residentService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Button from '../../../components/Button/Button.jsx';
import Input from '../../../components/Input/Input.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal.jsx';
import Loader from '../../../components/Loader/Loader.jsx';
import './MyFamily.css';

const EMPTY_MEMBER = { name: '', relation: '', age: '', phone: '' };

const MyFamily = () => {
  const { showToast } = useToast();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadFamily = async () => {
    try {
      const { data } = await residentService.getMyProfile();
      setMembers(data.familyMembers || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFamily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_MEMBER);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    setForm({ name: member.name, relation: member.relation, age: member.age || '', phone: member.phone || '' });
    setIsModalOpen(true);
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.relation.trim()) {
      showToast('Name and relation are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : undefined };
      if (editingId) {
        await residentService.updateFamilyMember(editingId, payload);
        showToast('Family member updated', 'success');
      } else {
        await residentService.addFamilyMember(payload);
        showToast('Family member added', 'success');
      }
      setIsModalOpen(false);
      loadFamily();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await residentService.deleteFamilyMember(deleteTarget._id);
      showToast('Family member removed', 'success');
      setDeleteTarget(null);
      loadFamily();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (isLoading) return <Loader fullPage label="Loading family members..." />;

  return (
    <div className="my-family">
      <div className="my-family__header">
        <h1>My Family</h1>
        <Button onClick={openAddModal}>+ Add Family Member</Button>
      </div>

      {members.length === 0 ? (
        <Card>
          <p className="my-family__empty">No family members added yet.</p>
        </Card>
      ) : (
        <div className="my-family__grid">
          {members.map((member) => (
            <Card key={member._id} className="family-card">
              <div className="family-card__avatar">{member.name.charAt(0).toUpperCase()}</div>
              <div className="family-card__body">
                <span className="family-card__name">{member.name}</span>
                <span className="family-card__relation">{member.relation}</span>
                {member.age && <span className="family-card__meta">{member.age} years</span>}
                {member.phone && <span className="family-card__meta">{member.phone}</span>}
              </div>
              <div className="family-card__actions">
                <button className="family-card__action" onClick={() => openEditModal(member)}>
                  Edit
                </button>
                <button className="family-card__action family-card__action--danger" onClick={() => setDeleteTarget(member)}>
                  Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Family Member' : 'Add Family Member'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Save
            </Button>
          </>
        }
      >
        <form className="family-form" onSubmit={handleSubmit}>
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
          <Input
            label="Relation"
            name="relation"
            value={form.relation}
            onChange={handleChange}
            placeholder="e.g. Spouse, Son, Daughter"
            required
          />
          <Input label="Age" name="age" type="number" min="0" value={form.age} onChange={handleChange} />
          <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove family member?"
        message={`Are you sure you want to remove ${deleteTarget?.name} from your family list?`}
        confirmLabel="Remove"
      />
    </div>
  );
};

export default MyFamily;
