import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Calendar } from 'lucide-react';

interface BrewTypeData {
  name: string;
  icon: string;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

interface BrewTypeAnalyticsProps {
  machineId?: string;
  className?: string;
}

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function BrewTypeAnalytics({ machineId, className }: BrewTypeAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');

  // Sample data - in real app, this would come from API
  const brewTypesData: BrewTypeData[] = [
    {
      name: 'Espresso',
      icon: '☕',
      daily: 89,
      weekly: 623,
      monthly: 2687,
      yearly: 32244
    },
    {
      name: 'Americano', 
      icon: '🇺🇸',
      daily: 67,
      weekly: 469,
      monthly: 2012,
      yearly: 24144
    },
    {
      name: 'Cappuccino',
      icon: '🥛',
      daily: 54,
      weekly: 378,
      monthly: 1620,
      yearly: 19440
    },
    {
      name: 'Latte',
      icon: '🍼',
      daily: 32,
      weekly: 224,
      monthly: 960,
      yearly: 11520
    },
    {
      name: 'Mocha',
      icon: '🍫',
      daily: 12,
      weekly: 84,
      monthly: 360,
      yearly: 4320
    }
  ];

  const getCurrentCount = (brew: BrewTypeData): number => {
    switch (selectedPeriod) {
      case 'daily': return brew.daily;
      case 'weekly': return brew.weekly;
      case 'monthly': return brew.monthly;
      case 'yearly': return brew.yearly;
      default: return brew.daily;
    }
  };

  const getPeriodLabel = (): string => {
    switch (selectedPeriod) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'Today';
    }
  };

  const getTotalCups = (): number => {
    return brewTypesData.reduce((sum, brew) => sum + getCurrentCount(brew), 0);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <Card className={`animate-fadeIn ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-primary" />
          Brew Type Consumption
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {getPeriodLabel()} - {formatNumber(getTotalCups())} total cups
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Period Selection */}
        <div className="flex flex-wrap gap-2">
          {(['daily', 'weekly', 'monthly', 'yearly'] as Period[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Consumption Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-3">{getPeriodLabel()}'s Summary</h4>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{formatNumber(getTotalCups())}</div>
            <div className="text-sm text-muted-foreground">Total Cups Served</div>
          </div>
        </div>

        {/* Brew Types List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Consumption by Type ({getPeriodLabel()})
          </h4>
          
          <div className="space-y-3">
            {brewTypesData
              .sort((a, b) => getCurrentCount(b) - getCurrentCount(a))
              .map((brew, index) => (
              <div 
                key={brew.name} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-gray-100 transition-colors border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{brew.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{brew.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(getCurrentCount(brew))} cups
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-2xl text-primary">{formatNumber(getCurrentCount(brew))}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xl font-bold text-blue-700">{brewTypesData[0].name}</div>
            <div className="text-sm text-blue-600">Most Popular</div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatNumber(getCurrentCount(brewTypesData[0]))} cups
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xl font-bold text-green-700">
              {brewTypesData.length}
            </div>
            <div className="text-sm text-green-600">Brew Types</div>
            <div className="text-xs text-muted-foreground mt-1">Available</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
