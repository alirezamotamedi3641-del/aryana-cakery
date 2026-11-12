'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { InteractiveOrderPreview } from './InteractiveOrderPreview';

const ACCESS_PIN = '0000';
const SESSION_KEY = 'aryana_cake_preview_unlocked';

export function PinGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
        setUnlocked(true);
      }
    } catch {
      // Ignore sessionStorage errors in restricted contexts
    }
  }, []);

  const unlockPreview = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Ignore storage errors
    }
    setError('');
    setPin('');
    setUnlocked(true);
  };

  const verifyPin = (candidate?: string) => {
    const cleaned = (candidate ?? pin).trim();
    if (!cleaned) {
      setError('Please enter the 4-digit access PIN.');
      inputRef.current?.focus();
      return;
    }

    if (cleaned === ACCESS_PIN) {
      unlockPreview();
    } else {
      setError('Incorrect PIN. Please check and try again.');
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    verifyPin();
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(digitsOnly);
    if (error) setError('');
    if (digitsOnly === ACCESS_PIN) {
      unlockPreview();
    }
  };

  const handleLock = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
    setUnlocked(false);
    setPin('');
    setError('');
  };

  if (unlocked) {
    return (
      <div className="preview-scope">
        <InteractiveOrderPreview onLock={handleLock} />
      </div>
    );
  }

  return (
    <div className="preview-scope">
      <header className="top">
        <div className="topin">
          <div className="wordmark">
            aryana<small>C A K E R Y</small>
          </div>
          <div className="preview-pill">
            <i /> Private owner preview
          </div>
        </div>
      </header>

      <main className="pin-shell">
        <section className="pin-card fade-up" aria-label="Preview PIN entry">
          <div className="pin-badge" aria-hidden="true">
            <Lock size={23} />
          </div>
          <div className="eyebrow">Private Preview</div>
          <h1>Owner preview access</h1>
          <p className="pin-sub">
            Enter your 4-digit access PIN to view the interactive cake order form
            demonstration.
          </p>

          <form onSubmit={handleSubmit} action="javascript:void(0)" noValidate>
            <div className="pin-input-wrap">
              <label htmlFor="preview-pin-input" className="sr-only">
                4-digit access PIN
              </label>
              <input
                ref={inputRef}
                id="preview-pin-input"
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoComplete="off"
                autoFocus
                className="pin-input"
                placeholder="Enter PIN"
                value={pin}
                onChange={handlePinChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    verifyPin();
                  }
                }}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'pin-error-message' : undefined}
              />
              <button
                type="button"
                className="pin-toggle"
                onClick={() => setShowPin((prev) => !prev)}
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {error && (
              <div className="error" id="pin-error-message" role="alert">
                {error}
              </div>
            )}

            <button
              type="button"
              className="btn primary pin-submit"
              style={{ marginTop: error ? '14px' : '6px' }}
              onClick={() => verifyPin()}
            >
              <span>Unlock preview</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <p className="pin-foot">
            This preview page is private and unlisted. No real customer orders or
            enquiries are transmitted.
          </p>
        </section>
      </main>
    </div>
  );
}
