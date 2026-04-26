"use client";

import React from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    console.error("ErrorBoundary captured:", error);
  }

  private reset = () => this.setState({ hasError: false, error: null });

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="max-w-lg space-y-3 p-6">
          <AlertTriangle className="h-10 w-10 text-red-400" />
          <h2 className="text-xl font-semibold">Произошла непредвиденная ошибка</h2>
          <p className="text-sm text-zinc-300">{this.state.error?.message ?? "Неизвестная ошибка"}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={this.reset}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Повторить
            </Button>
            <Button onClick={() => window.location.assign("/contacts")}>
              <Home className="mr-2 h-4 w-4" />К контактам
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}

