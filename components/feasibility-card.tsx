"use client";

import type { FeasibilityResponse } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    TrendingUp,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { useState } from "react";

interface FeasibilityCardProps {
    feasibility: FeasibilityResponse;
    onViewDetails?: () => void;
}

export function FeasibilityCard({ feasibility, onViewDetails }: FeasibilityCardProps) {
    const [expanded, setExpanded] = useState(false);

    const getStatusConfig = () => {
        if (feasibility.status === "feasible") {
            return {
                icon: CheckCircle2,
                label: "Feasible",
                color: "text-green-600",
                bgColor: "bg-green-100",
                borderColor: "border-green-200",
            };
        }
        return {
            icon: XCircle,
            label: "Not Feasible",
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-200",
        };
    };

    const getRiskConfig = () => {
        const configs = {
            low: { color: "bg-green-500", label: "Low Risk" },
            medium: { color: "bg-yellow-500", label: "Medium Risk" },
            high: { color: "bg-red-500", label: "High Risk" },
        };
        return configs[feasibility.risk_level];
    };

    const getMarketConfig = () => {
        const configs = {
            low: { color: "text-gray-600", label: "Low", width: "w-1/3" },
            medium: { color: "text-yellow-600", label: "Medium", width: "w-2/3" },
            high: { color: "text-green-600", label: "High", width: "w-full" },
        };
        return configs[feasibility.market_potential];
    };

    const statusConfig = getStatusConfig();
    const riskConfig = getRiskConfig();
    const marketConfig = getMarketConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <Card className={`border-2 ${statusConfig.borderColor}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${statusConfig.bgColor}`}>
                            <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{statusConfig.label}</CardTitle>
                            <CardDescription>Feasibility Analysis Result</CardDescription>
                        </div>
                    </div>
                    <Badge variant={feasibility.status === "feasible" ? "default" : "destructive"} className="text-sm px-4 py-2">
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Risk Level */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Risk Level</span>
                        <span className="text-sm text-muted-foreground">{riskConfig.label}</span>
                    </div>
                    <div className="flex gap-1">
                        {["low", "medium", "high"].map((level, index) => (
                            <div
                                key={level}
                                className={`h-2 flex-1 rounded ${index <= ["low", "medium", "high"].indexOf(feasibility.risk_level)
                                    ? riskConfig.color
                                    : "bg-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Market Potential */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Market Potential
                        </span>
                        <span className={`text-sm font-medium ${marketConfig.color}`}>
                            {marketConfig.label}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${marketConfig.width} bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all`} />
                    </div>
                </div>

                {/* Strengths */}
                {feasibility.strengths.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Key Strengths
                        </h4>
                        <ul className="space-y-2">
                            {feasibility.strengths.slice(0, expanded ? undefined : 3).map((strength, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                        {feasibility.strengths.length > 3 && !expanded && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpanded(true)}
                                className="mt-2 text-xs"
                            >
                                Show {feasibility.strengths.length - 3} more
                                <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Weaknesses */}
                {feasibility.weaknesses.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            Areas of Concern
                        </h4>
                        <ul className="space-y-2">
                            {feasibility.weaknesses.slice(0, expanded ? undefined : 3).map((weakness, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <span>{weakness}</span>
                                </li>
                            ))}
                        </ul>
                        {feasibility.weaknesses.length > 3 && !expanded && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpanded(true)}
                                className="mt-2 text-xs"
                            >
                                Show {feasibility.weaknesses.length - 3} more
                                <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Recommendations */}
                {feasibility.recommendations.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Recommendations</h4>
                        <ul className="space-y-2">
                            {feasibility.recommendations.slice(0, expanded ? undefined : 3).map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="text-[#ff36a2] font-bold">→</span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                        {feasibility.recommendations.length > 3 && !expanded && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpanded(true)}
                                className="mt-2 text-xs"
                            >
                                Show {feasibility.recommendations.length - 3} more
                                <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                        )}
                    </div>
                )}

                {expanded && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(false)}
                        className="w-full text-xs"
                    >
                        Show Less
                        <ChevronUp className="w-3 h-3 ml-1" />
                    </Button>
                )}

                {/* View Details Button */}
                {onViewDetails && (
                    <Button
                        onClick={onViewDetails}
                        variant="outline"
                        className="w-full mt-4"
                    >
                        View Detailed Analysis
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
