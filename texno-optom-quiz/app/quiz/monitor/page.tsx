import React from 'react';
import { getProducts } from '@/lib/products';
import QuizStepScreen from '@/components/QuizStepScreen';

export const dynamic = 'force-dynamic';

export default async function MonitorPage() {
  const products = await getProducts();

  return (
    <QuizStepScreen
      category="monitor"
      title="Qaysi monitorda o'ynaysiz?"
      subtitle="Monitor shart emas — tanlamasangiz ham davom etishingiz mumkin."
      allProducts={products}
      stepIndex={10}
      nextSegment="summary"
      prevSegment="case"
      optional
    />
  );
}
