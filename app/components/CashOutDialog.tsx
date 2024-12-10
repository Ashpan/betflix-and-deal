"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CashOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (amount: number) => void;
}

export const CashOutDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: CashOutDialogProps) => {
  const [amount, setAmount] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cash Out</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cashout-amount" className="text-right">
              Final Stack
            </Label>
            <div className="col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="cashout-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              const numAmount = parseFloat(amount);
              if (!isNaN(numAmount) && numAmount >= 0) {
                onConfirm(numAmount);
              }
            }}
            disabled={!amount || parseFloat(amount) < 0}
          >
            Confirm Cash Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
