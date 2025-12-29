"use client";

import { useState } from "react";
import { useStudyMaterials } from "@/hooks/useStudyMaterials";
import { FileUploadCard } from "@/components/shared/FileUploadCard";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { ResourceGridSkeleton } from "@/components/shared/ResourceCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus } from "lucide-react";
import { toast } from "sonner";

export default function StudyMaterialsPage() {
  const { studyMaterials, isLoading, error, refetch, createStudyMaterial } =
    useStudyMaterials();
  const [showUpload, setShowUpload] = useState(false);

  const handleUpload = async (formData: FormData) => {
    try {
      await createStudyMaterial(formData);
      toast.success("Study material uploaded successfully!");
      setShowUpload(false);
      refetch();
    } catch (error) {
      toast.error("Failed to upload study material");
      throw error;
    }
  };

  const indexedMaterials = studyMaterials.filter((material) => material.is_indexed);
  const pendingMaterials = studyMaterials.filter((material) => !material.is_indexed);

  return (
    <div className="h-full p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
          <p className="text-muted-foreground mt-1">
            Organize and access your learning resources
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
          <FileUploadCard
            title="Upload Study Material"
            description="Upload PDF, DOC, or TXT files for your studies"
            acceptedFileTypes=".pdf,.doc,.docx,.txt"
            onUpload={handleUpload}
            maxFileSize={50}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Materials"
          value={studyMaterials.length}
          icon={BookOpen}
          color="text-violet-600 dark:text-violet-400"
          description="All uploaded documents"
          borderColor="#7c3aed"
        />
        <StatsCard
          title="Indexed"
          value={indexedMaterials.length}
          icon={BookOpen}
          color="text-emerald-600 dark:text-emerald-400"
          description="Ready for search"
          borderColor="#059669"
        />
        <StatsCard
          title="Pending"
          value={pendingMaterials.length}
          icon={BookOpen}
          color="text-orange-600 dark:text-orange-400"
          description="Processing..."
          borderColor="#ea580c"
        />
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({studyMaterials.length})</TabsTrigger>
          <TabsTrigger value="indexed">Indexed ({indexedMaterials.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingMaterials.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
            <ResourceGridSkeleton count={6} />
          ) : error ? (
            <EmptyState
              type="error"
              title="Failed to load study materials"
              description={error}
              action={
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              }
            />
          ) : studyMaterials.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-8 w-8" />}
              title="No study materials yet"
              description="Start building your knowledge base by uploading study materials"
              action={
                <Button onClick={() => setShowUpload(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Material
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyMaterials.map((material) => (
                <ResourceCard
                  key={material.id}
                  id={material.id}
                  title={material.title}
                  description={material.description}
                  createdAt={material.created_at}
                  isProcessed={material.is_indexed}
                  processedAt={material.indexed_at}
                  fileType="Study Material"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="indexed" className="space-y-6">
          {indexedMaterials.length === 0 ? (
            <EmptyState
              title="No indexed materials"
              description="Materials will appear here once they are indexed"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {indexedMaterials.map((material) => (
                <ResourceCard
                  key={material.id}
                  id={material.id}
                  title={material.title}
                  description={material.description}
                  createdAt={material.created_at}
                  isProcessed={material.is_indexed}
                  processedAt={material.indexed_at}
                  fileType="Study Material"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {pendingMaterials.length === 0 ? (
            <EmptyState
              title="No pending materials"
              description="All materials have been indexed"
              type="success"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingMaterials.map((material) => (
                <ResourceCard
                  key={material.id}
                  id={material.id}
                  title={material.title}
                  description={material.description}
                  createdAt={material.created_at}
                  isProcessed={material.is_indexed}
                  processedAt={material.indexed_at}
                  fileType="Study Material"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
