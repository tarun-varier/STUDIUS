"use client";

import { useState } from "react";
import { useQuestionBanks } from "@/hooks/useQuestionBanks";
import { FileUploadCard } from "@/components/shared/FileUploadCard";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { ResourceGridSkeleton } from "@/components/shared/ResourceCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileQuestion, Plus } from "lucide-react";
import { toast } from "sonner";

export default function QuestionBanksPage() {
  const { questionBanks, isLoading, error, refetch, createQuestionBank } =
    useQuestionBanks();
  const [showUpload, setShowUpload] = useState(false);

  const handleUpload = async (formData: FormData) => {
    try {
      await createQuestionBank(formData);
      toast.success("Question bank uploaded successfully!");
      setShowUpload(false);
      refetch();
    } catch (error) {
      toast.error("Failed to upload question bank");
      throw error;
    }
  };

  const processedBanks = questionBanks.filter((bank) => bank.is_processed);
  const pendingBanks = questionBanks.filter((bank) => !bank.is_processed);

  return (
    <div className="h-full p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Banks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your question bank collections
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Question Bank
        </Button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
          <FileUploadCard
            title="Upload Question Bank"
            description="Upload PDF, DOC, or TXT files containing questions"
            acceptedFileTypes=".pdf,.doc,.docx,.txt"
            onUpload={handleUpload}
            maxFileSize={50}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Banks"
          value={questionBanks.length}
          icon={FileQuestion}
          color="text-pink-600 dark:text-pink-400"
          description="All question collections"
          borderColor="#db2777"
        />
        <StatsCard
          title="Processed"
          value={processedBanks.length}
          icon={FileQuestion}
          color="text-emerald-600 dark:text-emerald-400"
          description="Ready to use"
          borderColor="#059669"
        />
        <StatsCard
          title="Pending"
          value={pendingBanks.length}
          icon={FileQuestion}
          color="text-orange-600 dark:text-orange-400"
          description="Generating questions..."
          borderColor="#ea580c"
        />
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({questionBanks.length})</TabsTrigger>
          <TabsTrigger value="processed">Processed ({processedBanks.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingBanks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
            <ResourceGridSkeleton count={6} />
          ) : error ? (
            <EmptyState
              type="error"
              title="Failed to load question banks"
              description={error}
              action={
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              }
            />
          ) : questionBanks.length === 0 ? (
            <EmptyState
              icon={<FileQuestion className="h-8 w-8" />}
              title="No question banks yet"
              description="Get started by uploading your first question bank"
              action={
                <Button onClick={() => setShowUpload(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Question Bank
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questionBanks.map((bank) => (
                <ResourceCard
                  key={bank.id}
                  id={bank.id}
                  title={bank.title}
                  description={bank.description}
                  createdAt={bank.created_at}
                  isProcessed={bank.is_processed}

                  fileType="Question Bank"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-6">
          {processedBanks.length === 0 ? (
            <EmptyState
              title="No processed question banks"
              description="Question banks will appear here once they are processed"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedBanks.map((bank) => (
                <ResourceCard
                  key={bank.id}
                  id={bank.id}
                  title={bank.title}
                  description={bank.description}
                  createdAt={bank.created_at}
                  isProcessed={bank.is_processed}

                  fileType="Question Bank"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {pendingBanks.length === 0 ? (
            <EmptyState
              title="No pending question banks"
              description="All question banks have been processed"
              type="success"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingBanks.map((bank) => (
                <ResourceCard
                  key={bank.id}
                  id={bank.id}
                  title={bank.title}
                  description={bank.description}
                  createdAt={bank.created_at}
                  isProcessed={bank.is_processed}

                  fileType="Question Bank"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
