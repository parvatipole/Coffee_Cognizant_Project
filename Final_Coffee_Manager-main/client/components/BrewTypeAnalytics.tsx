import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coffee, TrendingUp, Clock, Users } from 'lucide-react';

interface BrewType {
  name: string;
  icon: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  color: string;
  popularity: 'high' | 'medium' | 'low';
}

interface BrewTypeAnalyticsProps {
  machineId?: string;
  className?: string;
}

export default function BrewTypeAnalytics({ machineId, className }: BrewTypeAnalyticsProps) {
  // Sample brew types data - in a real app, this would come from API
  const brewTypes: BrewType[] = [
    {
      name: 'Espresso',
      icon: '☕',
      count: 89,
      percentage: 35,
      trend: 'up',
      trendValue: 12,
      color: 'bg-amber-500',
      popularity: 'high'
    },
    {
      name: 'Americano', 
      icon: '🇺🇸',
      count: 67,
      percentage: 26,
      trend: 'up',
      trendValue: 8,
      color: 'bg-blue-500',
      popularity: 'high'
    },
    {
      name: 'Cappuccino',
      icon: '🥛',
      count: 54,
      percentage: 21,
      trend: 'stable',
      trendValue: 0,
      color: 'bg-purple-500',
      popularity: 'medium'
    },
    {
      name: 'Latte',
      icon: '🍼',
      count: 32,
      percentage: 13,
      trend: 'down',
      trendValue: -5,
      color: 'bg-green-500',
      popularity: 'medium'
    },
    {
      name: 'Mocha',
      icon: '🍫',
      count: 12,
      percentage: 5,
      trend: 'up',
      trendValue: 3,
      color: 'bg-orange-500',
      popularity: 'low'
    }
  ];

  const totalBrews = brewTypes.reduce((sum, brew) => sum + brew.count, 0);

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />;
    return <span className="w-3 h-3 text-gray-400">→</span>;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const getPopularityBadge = (popularity: string) => {
    switch (popularity) {
      case 'high':
        return <Badge variant="default" className="bg-green-100 text-green-800">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`animate-fadeIn ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-primary" />
          Brew Type Analytics
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {totalBrews} total brews today
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Updated 2 minutes ago
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalBrews}</div>
            <div className="text-sm text-muted-foreground">Total Brews</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{brewTypes[0].name}</div>
            <div className="text-sm text-muted-foreground">Most Popular</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {brewTypes.filter(b => b.trend === 'up').length}
            </div>
            <div className="text-sm text-muted-foreground">Trending Up</div>
          </div>
        </div>

        {/* Brew Types List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Brew Breakdown
          </h4>
          {brewTypes.map((brew, index) => (
            <div 
              key={brew.name} 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-gray-100 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">{brew.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{brew.name}</h4>
                    {getPopularityBadge(brew.popularity)}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <Progress value={brew.percentage} className="h-2 flex-1 max-w-[120px]" />
                    <span className="text-xs text-muted-foreground">
                      {brew.percentage}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="font-bold text-lg">{brew.count}</div>
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(brew.trend)}`}>
                  {getTrendIcon(brew.trend, brew.trendValue)}
                  {brew.trend !== 'stable' && (
                    <span>{Math.abs(brew.trendValue)}%</span>
                  )}
                  {brew.trend === 'stable' && <span>Stable</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">☕ Quick Insights</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>• <strong>Espresso</strong> remains the most popular choice (35% of all brews)</p>
            <p>• <strong>Americano</strong> usage is trending up by 8% this week</p>
            <p>• Morning hours see more <strong>strong coffee</strong> preferences</p>
            <p>• <strong>Mocha</strong> is gaining popularity among afternoon users</p>
          </div>
        </div>

        {/* Time-based Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-lg font-bold text-amber-700">Peak: 10-11 AM</div>
            <div className="text-xs text-amber-600">Highest brew activity</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-lg font-bold text-purple-700">43 brews/hour</div>
            <div className="text-xs text-purple-600">Average rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
