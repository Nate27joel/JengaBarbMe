import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, ArrowRight, ShieldCheck, Landmark, CheckCircle, AlertCircle } from 'lucide-react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { User as UserType } from '../../types';

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  availableBalance: number;
  onSuccess: () => void;
}

const NIGERIAN_BANKS = [
  'Access Bank',
  'Guaranty Trust Bank (GTB)',
  'Zenith Bank',
  'United Bank for Africa (UBA)',
  'Kuda Bank',
  'Stanbic IBTC Bank',
  'First Bank of Nigeria',
  'Wema Bank',
  'Sterling Bank',
  'Fidelity Bank',
  'Opay',
  'Palmpay'
];

export const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  isOpen,
  onClose,
  user,
  availableBalance,
  onSuccess
}) => {
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');
  const [amount, setAmount] = useState<string>('');
  const [bankName, setBankName] = useState<string>(NIGERIAN_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numericAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than zero.');
      return;
    }

    if (numericAmount > availableBalance) {
      setErrorMessage(`Insufficient funds. Your available balance is ₦${availableBalance.toLocaleString()}.`);
      return;
    }

    if (!accountNumber || accountNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Nigerian bank account number.');
      return;
    }

    if (!accountName.trim()) {
      setErrorMessage('Please enter your account name exactly as registered with your bank.');
      return;
    }

    setStep('confirm');
  };

  const handleConfirmPayout = async () => {
    if (!user) {
      setErrorMessage('You must be logged in to request a payout.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payoutsPath = 'payouts';
    try {
      // 1. Generate a secure custom document reference to get a random ID
      const payoutRef = doc(collection(db, payoutsPath));
      const payoutId = payoutRef.id;

      // 2. Build the secure payload precisely conforming to the firestore.rules Schema and the firebase-blueprint
      const payload = {
        id: payoutId,
        professionalId: user.id,
        professionalName: user.fullName || 'Verified Stylist',
        amount: numericAmount,
        status: 'pending',
        bankName,
        accountNumber,
        accountName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // 3. Write to Firestore
      await setDoc(payoutRef, payload);

      // 4. Update state to success step
      setStep('success');
      onSuccess();
    } catch (err) {
      console.error('Failed to submit payout request:', err);
      // Ensure we catch and serialize Firestore permission errors precisely as requested in the Firebase skill
      try {
        handleFirestoreError(err, OperationType.CREATE, payoutsPath);
      } catch (serializedError: any) {
        setErrorMessage(serializedError.message || 'An error occurred while creating payout request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep('details');
    setAmount('');
    setAccountNumber('');
    setAccountName('');
    setBankName(NIGERIAN_BANKS[0]);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetAndClose}
        className="absolute inset-0 bg-bg-deep/90 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-bg-surface rounded-3xl border border-border-muted overflow-hidden shadow-2xl p-8"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-light text-white tracking-tight italic font-serif">
              Request <span className="text-brand">Payout</span>
            </h3>
            <p className="text-[9px] text-[#555] font-black uppercase tracking-widest mt-1">
              Transfer your balance directly to your bank
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 text-[#444] hover:text-white transition-colors bg-bg-deep/50 rounded-full backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 leading-normal">
              {errorMessage}
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.form
              key="details-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleNextStep}
              className="space-y-5"
            >
              {/* Balance display info box */}
              <div className="bg-brand/5 border border-brand/10 p-4 rounded-xl flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">Available Balance</span>
                <span className="text-sm font-black text-brand font-mono">₦{availableBalance.toLocaleString()}</span>
              </div>

              {/* Amount input */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">
                  Payout Amount (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-xs text-[#555] font-mono">₦</span>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="Enter amount to withdraw"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              {/* Bank Name Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">
                  Select Nigerian Bank
                </label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-3.5 w-4 h-4 text-brand" />
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl outline-none text-white text-xs font-medium appearance-none"
                  >
                    {NIGERIAN_BANKS.map((bank) => (
                      <option key={bank} value={bank} className="bg-bg-surface text-white">
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Account Number Input */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">
                  Account Number (10 digits)
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  pattern="\d{10}"
                  placeholder="e.g. 0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-xs font-mono font-bold"
                />
              </div>

              {/* Account Name Input (must match NIN or registered bank records exactly) */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#555] uppercase tracking-[0.2em] ml-1">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adeyemi Boluwatife"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-deep border border-white/[0.05] focus:border-brand rounded-xl transition-all outline-none text-white text-xs font-medium"
                />
              </div>

              {/* Info text */}
              <p className="text-[8px] text-[#444] font-semibold leading-relaxed">
                Payouts are securely processed within 24 hours. Your bank country must be Nigeria. Service fees may apply.
              </p>

              <button
                type="submit"
                className="w-full py-4 bg-brand text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
              >
                Continue to Confirm <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="text-center p-6 bg-brand/5 border border-brand/10 rounded-2xl">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#888] block mb-2">
                  CONFIRM PAYOUT AMOUNT
                </span>
                <span className="text-4xl font-light text-brand font-serif italic block">
                  ₦{numericAmount.toLocaleString()}
                </span>
                <span className="text-[8px] text-[#444] font-black uppercase tracking-widest block mt-2">
                  TO BE SECURED & SENT
                </span>
              </div>

              <div className="space-y-4 bg-bg-deep border border-border-muted p-5 rounded-xl">
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest border-b border-border-muted pb-3">
                  <span className="text-[#555]">Beneficiary Name</span>
                  <span className="text-white tracking-tight">{accountName}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest border-b border-border-muted pb-3">
                  <span className="text-[#555]">Bank Name</span>
                  <span className="text-white tracking-tight">{bankName}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest pb-1">
                  <span className="text-[#555]">Account Number</span>
                  <span className="text-white font-mono">{accountNumber}</span>
                </div>
              </div>

              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand shrink-0" />
                <p className="text-[8px] text-brand uppercase font-black tracking-widest leading-loose">
                  Secured Transaction. The payout system verifies the account details before final settlement.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 py-4 bg-bg-deep border border-border-muted text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-brand/40 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmPayout}
                  className="flex-1 py-4 bg-brand text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Authorizing...' : 'Confirm & Request'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-6"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-brand" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-light text-white tracking-tight italic font-serif">
                  Payout Request <span className="text-brand">Received</span>
                </h4>
                <p className="text-[9px] text-[#888] uppercase font-black tracking-widest max-w-[280px] mx-auto leading-relaxed">
                  Your request for <span className="text-brand font-mono">₦{numericAmount.toLocaleString()}</span> has been securely entered in our payouts processing system.
                </p>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-4 bg-brand text-bg-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
              >
                Close Panel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
