import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function CpuPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="cpu"
      title="Qaysi protsessor sizga ma‘qul?"
      subtitle="PC ning miyasi. CS2 da yuqori FPS asosan shu qism orqali."
      allProducts={products}
      stepIndex={2}
      nextSegment="motherboard"
      prevSegment="platform"
    />
  );
}
