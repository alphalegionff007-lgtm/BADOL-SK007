import React, { useState } from 'react';
import { RefreshCw, ArrowRight, User } from 'lucide-react';

interface BMICalculatorProps {
  onJoinClick: () => void;
}

export default function BMICalculator({ onJoinClick }: BMICalculatorProps) {
  const [heightUnit, setHeightUnit] = useState<'ft' | 'cm'>('ft');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [cm, setCm] = useState('');
  const [weight, setWeight] = useState('');
  
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [advice, setAdvice] = useState('');
  const [colorClass, setColorClass] = useState('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();

    let heightInMeters = 0;
    const w = parseFloat(weight);

    if (isNaN(w) || w <= 0) return;

    if (heightUnit === 'ft') {
      const f = parseFloat(feet) || 0;
      const i = parseFloat(inches) || 0;
      const totalInches = (f * 12) + i;
      if (totalInches <= 0) return;
      heightInMeters = (totalInches * 2.54) / 100;
    } else {
      const c = parseFloat(cm);
      if (isNaN(c) || c <= 0) return;
      heightInMeters = c / 100;
    }

    const calculatedBmi = w / (heightInMeters * heightInMeters);
    const bmiVal = Math.round(calculatedBmi * 10) / 10;
    setBmi(bmiVal);

    // Determine category and custom local BD recommendations
    if (bmiVal < 18.5) {
      setCategory('Underweight');
      setAdvice('You should focus on muscle hypertrophy (gaining lean weight) through our strength training programs. Supplement your routine with our custom high-calorie nutrition charts and bKash personal training routines.');
      setColorClass('text-amber-400');
    } else if (bmiVal >= 18.5 && bmiVal < 25) {
      setCategory('Normal Weight');
      setAdvice('Fantastic! Your metabolic condition is ideal. We highly recommend our 3 Months Plan or Evening Powerlifting Clinics to solidify consistency and build deep core stamina.');
      setColorClass('text-emerald-400');
    } else if (bmiVal >= 25 && bmiVal < 30) {
      setCategory('Overweight');
      setAdvice('Your health would benefit from active cardio and strength circuits. Check out our high-intensity ladies batches or general fat loss barbell drills. Speed up your progress under our custom low-carb keto guides.');
      setColorClass('text-orange-400');
    } else {
      setCategory('Obese');
      setAdvice('Core metabolic support is needed. Consistently join our general cardio zone combined with certified 1-on-1 Personal Training to safely burn fat and protect joint structures.');
      setColorClass('text-rose-500');
    }
  };

  const resetForm = () => {
    setFeet('');
    setInches('');
    setCm('');
    setWeight('');
    setBmi(null);
    setCategory('');
    setAdvice('');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Input Pane */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Check Your Fitness Score</h3>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal mb-6">
            Input your measurements to immediately identify your Body Mass Index (BMI) and map your custom lifting charts.
          </p>

          <form onSubmit={calculateBMI} className="space-y-5">
            {/* Height Unit selection */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setHeightUnit('ft')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  heightUnit === 'ft'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Feet & Inches
              </button>
              <button
                type="button"
                onClick={() => setHeightUnit('cm')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  heightUnit === 'cm'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Centimeters
              </button>
            </div>

            {/* Height inputs */}
            {heightUnit === 'ft' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-2">Feet</label>
                  <input
                    type="number"
                    step="any"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    required
                    placeholder="5"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-2">Inches</label>
                  <input
                    type="number"
                    step="any"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    required
                    placeholder="6"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-zinc-400 text-xs font-semibold mb-2">Height (cm)</label>
                <input
                  type="number"
                  step="any"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  required
                  placeholder="172"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Weight input */}
            <div>
              <label className="block text-zinc-400 text-xs font-semibold mb-2">Weight (kg)</label>
              <input
                type="number"
                step="any"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                placeholder="70"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* CTA action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-grow bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all text-center cursor-pointer"
              >
                Calculate Now
              </button>
              {bmi !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-zinc-800 hover:bg-zinc-700/80 text-white rounded-xl p-3.5 border border-zinc-700 hover:border-zinc-500 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Pane */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 min-h-[320px] flex flex-col justify-center text-center relative overflow-hidden">
          {bmi === null ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <User className="w-8 h-8 text-amber-500" />
              </div>
              <h4 className="text-zinc-200 font-bold text-base">Your Diagnostic Awaits</h4>
              <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
                Click compute above to unlock body density metrics and custom dietary guidance directly from our certified instructors.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest leading-none mb-1">Your BMI</p>
                <h4 className="text-5xl font-extrabold text-white tracking-tight">{bmi}</h4>
                <p className={`text-sm font-bold mt-2 uppercase tracking-wide tracking-widest ${colorClass}`}>
                  Category: {category}
                </p>
              </div>

              {/* Slider Representation */}
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden flex relative border border-zinc-800 my-4">
                <div className="bg-amber-400 w-[18.5%]" />
                <div className="bg-emerald-400 w-[25%]" />
                <div className="bg-orange-400 w-[25%]" />
                <div className="bg-rose-500 w-[31.5%]" />
                {/* Pointer */}
                <div
                  className="absolute w-3 h-3 bg-white rounded-full border border-zinc-950 -top-[1.5px] transition-all duration-1000 shadow-lg"
                  style={{ left: `${Math.min(100, Math.max(5, (bmi / 40) * 100))}%` }}
                />
              </div>

              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/60 text-left">
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">{advice}</p>
              </div>

              <button
                onClick={onJoinClick}
                className="w-full bg-transparent hover:bg-amber-500 text-amber-500 hover:text-zinc-950 font-bold py-3.5 px-4 rounded-xl border border-amber-500/50 hover:border-amber-500 text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Discuss with Gym Lead <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
