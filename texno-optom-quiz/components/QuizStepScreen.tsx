'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Product, Platform, CPUProduct, MotherboardProduct, RAMProduct, GPUProduct, SSDProduct, PSUProduct, CoolerProduct, CaseProduct, MonitorProduct } from '@/types';
import { useBuildStore } from '@/store/useBuildStore';
import { getCompatibleOptions } from '@/lib/compatibility';
import QuestionHeader from './QuestionHeader';
import QuizGrid from './QuizGrid';
import QuizCard from './QuizCard';
import QuizNav from './QuizNav';

interface QuizStepScreenProps {
  category: Category;
  title: string;
  subtitle: string;
  allProducts: Product[];
  stepIndex: number; // 1 to 10
  nextSegment: string; // e.g. 'cpu' or 'summary'
  prevSegment: string; // e.g. 'platform' or '/'
  optional?: boolean; // If true, user can skip this step without selecting
}

export default function QuizStepScreen({
  category,
  title,
  subtitle,
  allProducts,
  stepIndex,
  nextSegment,
  prevSegment,
  optional = false,
}: QuizStepScreenProps) {
  const router = useRouter();
  const build = useBuildStore((s) => s.build);
  
  // Store setters
  const setPlatform = useBuildStore((s) => s.setPlatform);
  const setCpu = useBuildStore((s) => s.setCpu);
  const setMotherboard = useBuildStore((s) => s.setMotherboard);
  const setRam = useBuildStore((s) => s.setRam);
  const setGpu = useBuildStore((s) => s.setGpu);
  const setSsd = useBuildStore((s) => s.setSsd);
  const setPsu = useBuildStore((s) => s.setPsu);
  const setCooler = useBuildStore((s) => s.setCooler);
  const setCase = useBuildStore((s) => s.setCase);
  const setMonitor = useBuildStore((s) => s.setMonitor);

  // Get compatible candidates dynamically based on current build state
  const candidates = getCompatibleOptions(category, build, allProducts);

  // Determine currently selected item ID for this category
  let selectedId = '';
  if (category === 'platform' && build.platform) {
    // Platform items have IDs like 'plat-amd' or 'plat-intel'
    const found = candidates.find((p) => p.category === 'platform' && p.platform_code === build.platform);
    if (found) selectedId = found.id;
  } else {
    const selectedObj = build[category as keyof typeof build] as Product | undefined;
    if (selectedObj) selectedId = selectedObj.id;
  }

  // Handle Select
  const handleSelect = (product: Product) => {
    if (category === 'platform') {
      setPlatform((product as any).platform_code as Platform);
    } else if (category === 'cpu') {
      setCpu(product as CPUProduct);
    } else if (category === 'motherboard') {
      setMotherboard(product as MotherboardProduct);
    } else if (category === 'ram') {
      setRam(product as RAMProduct);
    } else if (category === 'gpu') {
      setGpu(product as GPUProduct);
    } else if (category === 'ssd') {
      setSsd(product as SSDProduct);
    } else if (category === 'psu') {
      setPsu(product as PSUProduct);
    } else if (category === 'cooler') {
      setCooler(product as CoolerProduct);
    } else if (category === 'case') {
      setCase(product as CaseProduct);
    } else if (category === 'monitor') {
      setMonitor(product as MonitorProduct);
    }
  };

  const handleNext = () => {
    router.push(`/quiz/${nextSegment}`);
  };

  const backUrl = prevSegment === '/' ? '/' : `/quiz/${prevSegment}`;
  const nextLabel = stepIndex === 10 ? "Xulosani ko'rish →" : "Keyingisi →";

  // If optional, allow proceeding even without a selection
  const isNextDisabled = optional ? false : !selectedId;

  return (
    <div className="flex-1 flex flex-col justify-between w-full">
      <div>
        <QuestionHeader title={title} subtitle={subtitle} />

        {/* Skip button for optional steps */}
        {optional && !selectedId && (
          <div className="max-w-3xl mx-auto px-4 mb-4">
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-btn border-2 border-dashed border-gray-700 text-gray-400 hover:border-brand-accent hover:text-brand-accent font-semibold text-sm transition-all"
            >
              Monitorsiz davom etish →
            </button>
          </div>
        )}

        {candidates.length > 0 ? (
          <QuizGrid>
            {candidates.map((product) => (
              <QuizCard
                key={product.id}
                product={product}
                isSelected={selectedId === product.id}
                onSelect={() => handleSelect(product)}
              />
            ))}
          </QuizGrid>
        ) : (
          <div className="w-full max-w-md mx-auto p-6 bg-brand-error/10 border border-brand-error/20 rounded-card text-center my-8">
            <p className="text-sm text-brand-error font-medium leading-relaxed">
              Ushbu konfiguratsiya uchun mos variantlar topilmadi. Iltimos, oldingi qadamlarda boshqa tanlov qiling yoki menejer bilan to&apos;g&apos;ri-dan-to&apos;g&apos;ri bog&apos;laning.
            </p>
          </div>
        )}
      </div>

      <QuizNav
        onNext={handleNext}
        nextDisabled={isNextDisabled}
        backUrl={backUrl}
        nextLabel={nextLabel}
        stepIndex={stepIndex}
        category={category}
      />
    </div>
  );
}
