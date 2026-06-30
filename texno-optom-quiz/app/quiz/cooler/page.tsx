import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function CoolerPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="cooler"
      title="Qaysi sovutgichni tanlaymiz?"
      subtitle="Protsessoringiz sovuq va tinch ishlashi uchun."
      allProducts={products}
      stepIndex={8}
      nextSegment="case"
      prevSegment="psu"
    />
  );
}
