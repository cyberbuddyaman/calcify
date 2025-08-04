'use client';

import React, { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { getSimplifiedEquation, type EquationSimplifierState } from '@/app/actions';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2 } from 'lucide-react';
import { Label } from './ui/label';

interface EquationSimplifierProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: EquationSimplifierState = {};

export function EquationSimplifier({ open, onOpenChange }: EquationSimplifierProps) {
  const [state, formAction, isPending] = useActionState(getSimplifiedEquation, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
    if (state?.result) {
        formRef.current?.reset();
    }
  }, [state, toast]);
  
  const handleOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
        // Reset state when sheet is closed
        state.result = undefined;
        state.error = undefined;
    }
    onOpenChange(newOpenState);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Wand2 className="text-accent" />
            AI Equation Simplifier
          </SheetTitle>
          <SheetDescription>
            Enter a complex equation and let AI simplify it for you, with a step-by-step explanation.
          </SheetDescription>
        </SheetHeader>
        <form action={formAction} ref={formRef} className="flex-grow flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="equation-input">Equation</Label>
            <Textarea
              id="equation-input"
              name="equation"
              placeholder="e.g., (2x + 5)(x - 3) + 4x^2 - 7"
              className="min-h-[100px] text-base"
              required
            />
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simplifying...
                </>
              ) : (
                'Simplify Equation'
              )}
            </Button>
          </SheetFooter>
        </form>

        {state?.result && (
          <div className="flex-grow overflow-y-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Simplified Equation</CardTitle>
              </CardHeader>
              <CardContent className="bg-muted p-4 rounded-lg font-mono text-lg">
                {state.result.simplifiedEquation}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Explanation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert">
                <p>{state.result.explanation}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
