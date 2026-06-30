import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function PsuPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="psu"
      title="Qaysi blok pitaniyani tanlaymiz?"
      subtitle="Komponentlaringizga mos quvvatlilik avtomatik hisoblangan."
      allProducts={products}
      stepIndex={7}
      nextSegment="cooler"
      prevSegment="ssd"
    />
  );
}
