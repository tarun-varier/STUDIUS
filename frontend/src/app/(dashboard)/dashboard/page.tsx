"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudyMaterials } from "@/hooks/useStudyMaterials";
import { useQuestionBanks } from "@/hooks/useQuestionBanks";
import { StatsCard } from "@/components/shared/StatsCard";
import { BookOpen, FileQuestion, GraduationCap, ArrowUpRight, Plus, Rocket, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { studyMaterials, isLoading: isLoadingMaterials } = useStudyMaterials();
  const { questionBanks, isLoading: isLoadingBanks } = useQuestionBanks();
  
  const isLoading = isLoadingMaterials || isLoadingBanks;

  const stats = [
    {
      title: "Study Materials",
      value: studyMaterials?.length || 0,
      icon: BookOpen,
      href: "/study-materials",
      color: "text-violet-600 dark:text-violet-400",
      description: "Documents & Notes"
    },
    {
      title: "Question Banks",
      value: questionBanks?.length || 0,
      icon: FileQuestion,
      href: "/question-banks",
      color: "text-pink-600 dark:text-pink-400",
      description: "Practice Sets"
    },
    {
        title: "Total Resources",
        value: (studyMaterials?.length || 0) + (questionBanks?.length || 0),
        icon: GraduationCap,
        href: "/dashboard",
        color: "text-emerald-600 dark:text-emerald-400",
        description: "Knowledge Base"
    }
  ];

  const allRecentItems = [
    ...(studyMaterials || []).map(m => ({ ...m, type: 'Study Material', icon: BookOpen, iconColor: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-100 dark:bg-violet-900/20' })),
    ...(questionBanks || []).map(m => ({ ...m, type: 'Question Bank', icon: FileQuestion, iconColor: 'text-pink-600 dark:text-pink-400', iconBg: 'bg-pink-100 dark:bg-pink-900/20' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 5);

  return (
    <div className="h-full p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">Overview of your learning progress</p>
        </div>
        <div className="flex gap-3">
             <Link href="/chat">
                <Button variant="outline" className="hidden sm:flex">
                    <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                    Ask AI
                </Button>
            </Link>
            <Link href="/study-materials">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Upload
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={isLoading ? <Skeleton className="h-8 w-20" /> : stat.value}
            icon={stat.icon}
            color={stat.color}
            description={stat.description}
            borderColor={i === 0 ? '#7c3aed' : i === 1 ? '#db2777' : '#059669'}
            action={
                <Link href={stat.href}>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs hover:bg-transparent hover:underline group-hover:translate-x-1 transition-transform">
                        View <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                </Link>
            }
          />
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                Recent Activity
            </CardTitle>
            <CardDescription>
              Your most recent additions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-3 w-[150px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : allRecentItems.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Rocket className="h-10 w-10 mb-4 opacity-20" />
                    <p>No activity yet.</p>
                    <Link href="/study-materials" className="mt-2 text-sm text-primary hover:underline">Get stated by uploading a file</Link>
                 </div>
            ) : (
                <div className="space-y-4">
                    {allRecentItems.map((item) => (
                        <div key={item.id} className="flex items-center group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className={`w-9 h-9 rounded-full ${item.iconBg} flex items-center justify-center mr-4 shadow-sm`}>
                                <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{item.title}</p>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    {item.type} • {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>
        
        <div className="col-span-3 space-y-4">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Quick Actions
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                        Jump start your learning session
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <Link href="/chat">
                        <Button variant="secondary" className="w-full justify-start hover:bg-slate-700 text-slate-900 border-none transition-colors">
                            <Rocket className="mr-2 h-4 w-4" /> Start AI Quiz
                        </Button>
                    </Link>
                    <Link href="/study-materials">
                        <Button variant="ghost" className="w-full justify-start hover:bg-white/10 text-white transition-colors">
                            <Plus className="mr-2 h-4 w-4" /> Upload New Material
                        </Button>
                    </Link>
                     <Link href="/question-banks">
                        <Button variant="ghost" className="w-full justify-start hover:bg-white/10 text-white transition-colors">
                            <FileQuestion className="mr-2 h-4 w-4" /> Create Question Bank
                        </Button>
                    </Link>
                </CardContent>
            </Card>

             <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Upload your study materials first, then generate a question bank to test your knowledge!
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
