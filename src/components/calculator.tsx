"use client";

import React, { useState, type FC } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Divide, Minus, Percent, Plus, X, PlusSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorButtonProps extends ButtonProps {
  label?: string | React.ReactNode;
  tip?: string;
}

const CalculatorButton: FC<CalculatorButtonProps> = ({ className, children, ...props }) => (
  <Button
    variant="outline"
    className={cn(
      "h-20 text-2xl font-bold transition-transform active:scale-95 rounded-xl shadow-md border-primary/10 hover:bg-primary/5 active:bg-primary/10",
      className
    )}
    {...props}
  >
    {children}
  </Button>
);

const CalculatorOperations = {
  '/': (firstOperand: number, secondOperand: number) => firstOperand / secondOperand,
  '*': (firstOperand: number, secondOperand: number) => firstOperand * secondOperand,
  '+': (firstOperand: number, secondOperand: number) => firstOperand + secondOperand,
  '-': (firstOperand: number, secondOperand: number) => firstOperand - secondOperand,
  '=': (_: number, secondOperand: number) => secondOperand,
};

export function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<keyof typeof CalculatorOperations | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDot = () => {
    if (!/\./.test(displayValue)) {
      setDisplayValue(displayValue + '.');
      setWaitingForSecondOperand(false);
    }
  };

  const toggleSign = () => {
    setDisplayValue(String(parseFloat(displayValue) * -1));
  };
  
  const inputPercent = () => {
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0) return;
    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
    setDisplayValue(String(currentValue / 100).slice(0, 15 - fixedDigits.length));
  };

  const applyTrigFunction = (func: (x: number) => number) => {
    const currentValue = parseFloat(displayValue);
    const result = func(currentValue * (Math.PI / 180)); // Convert degrees to radians
    setDisplayValue(String(result).slice(0, 15));
  };

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: keyof typeof CalculatorOperations) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = CalculatorOperations[operator](firstOperand, inputValue);
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  return (
    <>
      <Card className="w-full max-w-sm mx-auto shadow-2xl bg-card/80 backdrop-blur-sm border-primary/20 p-2">
        <div className="bg-primary/90 rounded-lg p-4 mb-4 text-right">
          <p
            className="text-5xl font-mono text-primary-foreground break-all"
            style={{ minHeight: '3.75rem' }}
          >
            {displayValue}
          </p>
        </div>
        <CardContent className="p-1">
          <div className="grid grid-cols-4 gap-2">
            <CalculatorButton onClick={() => applyTrigFunction(Math.sin)} className="bg-secondary text-secondary-foreground">sin</CalculatorButton>
            <CalculatorButton onClick={() => applyTrigFunction(Math.cos)} className="bg-secondary text-secondary-foreground">cos</CalculatorButton>
            <CalculatorButton onClick={() => applyTrigFunction(Math.tan)} className="bg-secondary text-secondary-foreground">tan</CalculatorButton>
            
            <CalculatorButton onClick={clearAll} className="bg-secondary text-secondary-foreground col-start-1">AC</CalculatorButton>
            <CalculatorButton onClick={toggleSign} className="bg-secondary text-secondary-foreground"><PlusSquare /></CalculatorButton>
            <CalculatorButton onClick={inputPercent} className="bg-secondary text-secondary-foreground"><Percent /></CalculatorButton>
            <CalculatorButton onClick={() => performOperation('/')} className="bg-accent text-accent-foreground hover:bg-accent/90"><Divide /></CalculatorButton>
            
            <CalculatorButton onClick={() => inputDigit('7')}>7</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit('8')}>8</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit('9')}>9</CalculatorButton>
            <CalculatorButton onClick={() => performOperation('*')} className="bg-accent text-accent-foreground hover:bg-accent/90"><X /></CalculatorButton>

            <CalculatorButton onClick={() => inputDigit('4')}>4</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit('5')}>5</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit('6')}>6</CalculatorButton>
            <CalculatorButton onClick={() => performOperation('-')} className="bg-accent text-accent-foreground hover:bg-accent/90"><Minus /></CalculatorButton>
            
            <CalculatorButton onClick={() => inputDigit('1')}>1</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit('2')}>2</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit('3')}>3</CalculatorButton>
            <CalculatorButton onClick={() => performOperation('+')} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus /></CalculatorButton>

            <CalculatorButton onClick={() => inputDigit('0')} className="col-span-2">0</CalculatorButton>
            <CalculatorButton onClick={inputDot}>.</CalculatorButton>
            <CalculatorButton onClick={() => performOperation('=')} className="bg-accent text-accent-foreground hover:bg-accent/90">=</CalculatorButton>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
