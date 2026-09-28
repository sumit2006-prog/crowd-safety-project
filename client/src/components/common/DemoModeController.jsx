import React, { useState } from 'react';
import { Play, SkipForward, RotateCcw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { DEMO_STEPS } from '../../services/demoSimulator';
import { useEventData } from '../../context/EventDataContext';

export const DemoModeController = () => {
  const { currentDemoStep, executeDemoStep, showToast } = useEventData();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleNextStep = () => {
    const nextStep = currentDemoStep >= 8 ? 1 : currentDemoStep + 1;
    executeDemoStep(nextStep);
  };

  const currentObj = DEMO_STEPS.find(s => s.step === currentDemoStep);

  return (
    <div className="fixed bottom-4 left-4 z-40 w-80 md:w-96 bg-slate-900/95 border border-purple-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              LIVE DEMO SIMULATOR
              <span className="px-2 py-0.5 text-[10px] bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-full font-mono">
                Judge Presentation
              </span>
            </h4>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-slate-400 hover:text-white"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
          {currentObj ? (
            <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-500/20 space-y-1">
              <div className="text-xs font-bold text-purple-400">{currentObj.title}</div>
              <p className="text-xs text-slate-300 leading-snug">{currentObj.description}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Click "Next Step" to simulate a real-time event emergency workflow.</p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleNextStep}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <SkipForward className="w-4 h-4" />
              <span>Step {currentDemoStep > 0 ? `${currentDemoStep}/8` : '1'} Next</span>
            </button>

            <button
              onClick={() => {
                executeDemoStep(1);
                showToast('Demo Simulator Reset to Step 1', 'info');
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              title="Reset Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
