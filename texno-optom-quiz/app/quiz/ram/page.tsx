import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function RamPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="ram"
      title="Qancha operativ xotira kerak?"
      subtitle="Gaming uchun minimal 16GB, optimal 32GB."
      allProducts={products}
      stepIndex={4}
      nextSegment="gpu"
      prevSegment="motherboard"
    />
  );
}
