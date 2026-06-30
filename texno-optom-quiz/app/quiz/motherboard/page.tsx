import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function MotherboardPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="motherboard"
      title="Qaysi ona platani tanlaymiz?"
      subtitle="Faqat protsessoringizga mos variantlarni ko‘rsatamiz."
      allProducts={products}
      stepIndex={3}
      nextSegment="ram"
      prevSegment="cpu"
    />
  );
}
