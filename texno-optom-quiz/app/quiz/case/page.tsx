import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function CasePage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="case"
      title="Qanday korpus sizga yoqadi?"
      subtitle="Tashqi ko‘rinish — birinchi taassurot."
      allProducts={products}
      stepIndex={9}
      nextSegment="monitor"
      prevSegment="cooler"
    />
  );
}
