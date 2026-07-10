import React, { useState, useEffect, useCallback } from 'react';
import maintenanceService from '../../../services/maintenanceService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Table from '../../../components/Table/Table.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import Button from '../../../components/Button/Button.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import Input from '../../../components/Input/Input.jsx';
import { PAYMENT_STATUS, PAYMENT_STATUS_VARIANT } from '../../../utils/constants.js';
import { formatDate, formatCurrency } from '../../../utils/formatters.js';
import './MaintenanceBills.css';

const MaintenanceBills = () => {
  const { showToast } = useToast();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payTarget, setPayTarget] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const loadBills = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await maintenanceService.getMyBills();
      setBills(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await maintenanceService.payBill(payTarget._id, { paymentMethod, transactionId });
      showToast('Payment recorded successfully', 'success');
      setPayTarget(null);
      setTransactionId('');
      loadBills();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = async (bill) => {
    setDownloadingId(bill._id);
    try {
      const response = await maintenanceService.downloadReceipt(bill._id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${bill.receiptNumber || bill._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showToast(err.message || 'Failed to download receipt', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = [
    { key: 'billMonth', header: 'Bill Month' },
    { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'dueDate', header: 'Due Date', render: (row) => formatDate(row.dueDate) },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: (row) => <Badge variant={PAYMENT_STATUS_VARIANT[row.paymentStatus]}>{row.paymentStatus}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) =>
        row.paymentStatus === PAYMENT_STATUS.PAID ? (
          <Button size="sm" variant="outline" isLoading={downloadingId === row._id} onClick={() => handleDownloadReceipt(row)}>
            Download Receipt
          </Button>
        ) : (
          <Button size="sm" onClick={() => setPayTarget(row)}>
            Pay Now
          </Button>
        ),
    },
  ];

  return (
    <div className="maintenance-page">
      <h1 className="maintenance-page__title">Maintenance Bills</h1>

      <Card padded={false}>
        <Table columns={columns} data={bills} isLoading={isLoading} emptyMessage="No maintenance bills yet" />
      </Card>

      <Modal
        isOpen={!!payTarget}
        onClose={() => setPayTarget(null)}
        title={`Pay ${payTarget?.billMonth || ''} Maintenance`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPayTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handlePay} isLoading={isSubmitting}>
              Confirm Payment
            </Button>
          </>
        }
      >
        {payTarget && (
          <form className="pay-form" onSubmit={handlePay}>
            <p className="pay-form__amount">{formatCurrency(payTarget.amount)}</p>
            <div className="field">
              <label className="field__label" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                className="pay-form__select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="online">Net Banking</option>
                <option value="cheque">Cheque</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <Input
              label="Transaction ID (optional)"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. UPI reference number"
            />
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MaintenanceBills;
