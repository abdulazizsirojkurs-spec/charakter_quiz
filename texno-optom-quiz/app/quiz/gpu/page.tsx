import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function GpuPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="gpu"
      title="Qaysi video karta sizga mos?"
      subtitle="Eng muhim qism — o‘yindagi FPS aynan shundan."
      allProducts={products}
      stepIndex={5}
      nextSegment="ssd"
      prevSegment="ram"
    />
  );
}
