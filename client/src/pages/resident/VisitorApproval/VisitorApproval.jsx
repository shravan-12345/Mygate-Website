import React, { useState, useEffect, useCallback } from 'react';
import visitorService from '../../../services/visitorService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Table from '../../../components/Table/Table.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import Button from '../../../components/Button/Button.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import Input from '../../../components/Input/Input.jsx';
import { VISITOR_STATUS, VISITOR_STATUS_VARIANT } from '../../../utils/constants.js';
import { formatDateTime, titleCase } from '../../../utils/formatters.js';
import './VisitorApproval.css';

const VisitorApproval = () => {
  const { showToast } = useToast();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadVisitors = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await visitorService.getMyVisitors();
      setVisitors(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadVisitors();
  }, [loadVisitors]);

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await visitorService.approve(id);
      showToast('Visitor approved', 'success');
      loadVisitors();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    setActioningId(rejectTarget._id);
    try {
      await visitorService.reject(rejectTarget._id, rejectReason);
      showToast('Visitor rejected', 'success');
      setRejectTarget(null);
      setRejectReason('');
      loadVisitors();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActioningId(null);
    }
  };

  const pending = visitors.filter((v) => v.approvalStatus === VISITOR_STATUS.PENDING_APPROVAL);

  const columns = [
    { key: 'visitorName', header: 'Visitor', render: (row) => row.visitorName },
    { key: 'purpose', header: 'Purpose' },
    { key: 'visitorType', header: 'Type', render: (row) => titleCase(row.visitorType) },
    {
      key: 'expectedVisitTime',
      header: 'Expected',
      render: (row) => formatDateTime(row.expectedVisitTime || row.createdAt),
    },
    {
      key: 'approvalStatus',
      header: 'Status',
      render: (row) => <Badge variant={VISITOR_STATUS_VARIANT[row.approvalStatus]}>{row.approvalStatus}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) =>
        row.approvalStatus === VISITOR_STATUS.PENDING_APPROVAL ? (
          <div className="visitor-approval__row-actions">
            <Button size="sm" isLoading={actioningId === row._id} onClick={() => handleApprove(row._id)}>
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => setRejectTarget(row)}>
              Reject
            </Button>
          </div>
        ) : (
          <span className="visitor-approval__dash">—</span>
        ),
    },
  ];

  return (
    <div className="visitor-approval">
      <div className="visitor-approval__header">
        <h1>Visitor Approval</h1>
        {pending.length > 0 && <Badge variant="warning">{pending.length} awaiting your response</Badge>}
      </div>

      <Card padded={false}>
        <Table columns={columns} data={visitors} isLoading={isLoading} emptyMessage="No visitors recorded yet" />
      </Card>

      <Modal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title={`Reject ${rejectTarget?.visitorName || 'visitor'}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} isLoading={actioningId === rejectTarget?._id}>
              Reject Visitor
            </Button>
          </>
        }
      >
        <form onSubmit={handleReject}>
          <Input
            label="Reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Not expecting anyone right now"
          />
        </form>
      </Modal>
    </div>
  );
};

export default VisitorApproval;
