import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function PlatformPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="platform"
      title="Qaysi platformada yig‘amiz?"
      subtitle="AMD yoki Intel — tanlov sizdan, qolganini biz hal qilamiz."
      allProducts={products}
      stepIndex={1}
      nextSegment="cpu"
      prevSegment="/"
    />
  );
}
