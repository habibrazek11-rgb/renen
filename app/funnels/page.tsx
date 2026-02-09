"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  Save,
  Settings,
  Trash2,
} from "lucide-react";
import type { Question, QuestionType } from "@/lib/types";

const questionTypes: { value: QuestionType; label: string; icon: string }[] = [
  { value: "single_choice", label: "Single Choice", icon: "○" },
  { value: "multi_choice", label: "Multiple Choice", icon: "☑" },
  { value: "scale", label: "Scale (1-10)", icon: "⚖" },
  { value: "short_text", label: "Short Text", icon: "T" },
  { value: "long_text", label: "Long Text", icon: "¶" },
  { value: "email", label: "Email", icon: "@" },
];

export default function FunnelsPage() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      type: "short_text",
      question: "What is your startup name?",
      required: true,
    },
    {
      id: "q2",
      type: "email",
      question: "Your email address",
      required: true,
    },
    {
      id: "q3",
      type: "long_text",
      question: "Describe your startup idea in detail",
      required: true,
    },
    {
      id: "q4",
      type: "single_choice",
      question: "What stage is your startup currently at?",
      required: true,
      options: ["Idea", "MVP", "Early Revenue", "Growth", "Scale"],
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: "short_text",
    question: "",
    required: true,
    options: [],
  });

  const handleAddQuestion = () => {
    if (!newQuestion.question) return;

    const question: Question = {
      id: `q${Date.now()}`,
      type: newQuestion.type || "short_text",
      question: newQuestion.question,
      required: newQuestion.required !== false,
      ...(newQuestion.options && newQuestion.options.length > 0
        ? { options: newQuestion.options }
        : {}),
      ...(newQuestion.scale_min !== undefined
        ? {
            scale_min: newQuestion.scale_min,
            scale_max: newQuestion.scale_max,
            scale_labels: newQuestion.scale_labels,
          }
        : {}),
    };

    setQuestions([...questions, question]);
    setNewQuestion({
      type: "short_text",
      question: "",
      required: true,
      options: [],
    });
    setIsAddDialogOpen(false);
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;

    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];

    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    return questionTypes.find((t) => t.value === type)?.label || type;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Assessment Builder</h1>
              <p className="text-sm text-muted-foreground">
                Create and customize your evaluation questionnaire
              </p>
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Assessment
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>
                      {questions.length} question{questions.length !== 1 ? "s" : ""} in
                      this assessment
                    </CardDescription>
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Question</DialogTitle>
                        <DialogDescription>
                          Create a new question for your assessment
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {questionTypes.map((type) => (
                              <Button
                                key={type.value}
                                variant={
                                  newQuestion.type === type.value ? "default" : "outline"
                                }
                                onClick={() =>
                                  setNewQuestion({ ...newQuestion, type: type.value })
                                }
                                className="justify-start"
                              >
                                <span className="mr-2 text-lg">{type.icon}</span>
                                {type.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="question">Question Text</Label>
                          <Textarea
                            id="question"
                            placeholder="Enter your question..."
                            value={newQuestion.question || ""}
                            onChange={(e) =>
                              setNewQuestion({ ...newQuestion, question: e.target.value })
                            }
                            rows={3}
                          />
                        </div>

                        {(newQuestion.type === "single_choice" ||
                          newQuestion.type === "multi_choice") && (
                          <div className="space-y-2">
                            <Label>Options (one per line)</Label>
                            <Textarea
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                              value={newQuestion.options?.join("\n") || ""}
                              onChange={(e) =>
                                setNewQuestion({
                                  ...newQuestion,
                                  options: e.target.value
                                    .split("\n")
                                    .filter((o) => o.trim()),
                                })
                              }
                              rows={5}
                            />
                          </div>
                        )}

                        {newQuestion.type === "scale" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="scale_min">Min Value</Label>
                              <Input
                                id="scale_min"
                                type="number"
                                value={newQuestion.scale_min || 1}
                                onChange={(e) =>
                                  setNewQuestion({
                                    ...newQuestion,
                                    scale_min: parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="scale_max">Max Value</Label>
                              <Input
                                id="scale_max"
                                type="number"
                                value={newQuestion.scale_max || 10}
                                onChange={(e) =>
                                  setNewQuestion({
                                    ...newQuestion,
                                    scale_max: parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="required"
                            checked={newQuestion.required !== false}
                            onChange={(e) =>
                              setNewQuestion({
                                ...newQuestion,
                                required: e.target.checked,
                              })
                            }
                            className="h-4 w-4"
                          />
                          <Label htmlFor="required" className="cursor-pointer">
                            Required question
                          </Label>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddQuestion}>Add Question</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions.map((question, index) => (
                  <Card key={question.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 pt-2">
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Question {index + 1}
                                </span>
                                <Badge variant="outline">
                                  {getQuestionTypeLabel(question.type)}
                                </Badge>
                                {question.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium">{question.question}</p>
                            </div>
                          </div>

                          {question.options && question.options.length > 0 && (
                            <div className="pl-4 space-y-1">
                              {question.options.map((option, i) => (
                                <div key={i} className="text-sm text-muted-foreground">
                                  {question.type === "single_choice" ? "○" : "☑"} {option}
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === "scale" && (
                            <div className="pl-4 text-sm text-muted-foreground">
                              Scale: {question.scale_min || 1} to {question.scale_max || 10}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveQuestion(index, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveQuestion(index, "down")}
                            disabled={index === questions.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteQuestion(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No questions yet. Click &quot;Add Question&quot; to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Assessment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment-name">Assessment Name</Label>
                  <Input
                    id="assessment-name"
                    defaultValue="Primary Evaluation"
                    placeholder="Enter assessment name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funnel">Associated Funnel</Label>
                  <select
                    id="funnel"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  >
                    <option>Default Funnel</option>
                    <option>Series A Funnel</option>
                    <option>Seed Funnel</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <p className="text-xs text-muted-foreground">
                    Test your assessment before publishing to ensure questions flow
                    correctly.
                  </p>
                  <Button variant="outline" className="w-full mt-2">
                    Preview Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Questions</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Required</span>
                  <span className="font-medium">
                    {questions.filter((q) => q.required).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Time</span>
                  <span className="font-medium">{Math.ceil(questions.length * 0.5)} min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
