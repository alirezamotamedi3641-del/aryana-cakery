import type { Metadata } from 'next';
import './preview.css';
import { PinGate } from './PinGate';

export const metadata: Metadata = {
  title: 'Cake Order Form — Interactive Preview',
  description: 'Private interactive cake order form preview for Aryana Cakery.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CakeOrderPreviewPage() {
  return <PinGate />;
}
