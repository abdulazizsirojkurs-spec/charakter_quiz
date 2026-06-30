import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function SsdPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="ssd"
      title="Qancha SSD xotira kerak?"
      subtitle="Windows va o‘yinlar tezda ochilishi uchun."
      allProducts={products}
      stepIndex={6}
      nextSegment="psu"
      prevSegment="gpu"
    />
  );
}
