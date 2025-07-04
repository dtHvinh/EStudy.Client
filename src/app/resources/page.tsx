"use client";

import MainLayout from "@/components/layouts/MainLayout";
import MediaRenderer from "@/components/resources/media-renderer";
import { ResourceType, useStorage } from "@/hooks/use-storage";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface GroupedResources {
  [date: string]: ResourceType[];
}

export default function MyResourcesPage() {
  const { getResources, deleteResource } = useStorage();
  const [hasMore, setHasMore] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(20); // Default page size
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [groupedResources, setGroupedResources] = useState<GroupedResources>(
    {},
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  const scrollNext = async () => {
    if (!hasMore) return;

    const newResources = await getResources(pageSize, pageSize * pageIndex);
    if (newResources.length < pageSize) {
      setHasMore(false);
    } else {
      setPageIndex((prev) => prev + 1);
    }

    setResources((prev) => [...prev, ...newResources]);
  };

  const handleDeleteResource = (resource: ResourceType) => {
    deleteResource(resource.path).then(() => {
      const updatedResources = resources.filter(
        (r) => r.path !== resource.path,
      );
      setResources(updatedResources);
      setGroupedResources(groupResourcesByDate(updatedResources));
    });
  };

  const groupResourcesByDate = (
    resources: ResourceType[],
  ): GroupedResources => {
    const grouped = resources.reduce((acc, resource) => {
      const date = new Date(resource.created_at);
      const dateKey = date.toDateString();

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(resource);
      return acc;
    }, {} as GroupedResources);

    const sortedGrouped: GroupedResources = {};
    Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .forEach((key) => {
        sortedGrouped[key] = grouped[key].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      });

    return sortedGrouped;
  };

  useEffect(() => {
    function fetchResources() {
      getResources()
        .then((res) => {
          setResources(res);
          setGroupedResources(groupResourcesByDate(res));
        })
        .catch((error) => {
          console.error("Failed to fetch resources:", error);
        });
    }

    fetchResources();
  }, []);

  return (
    <MainLayout>
      <div className="container px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Resources</h1>
        </div>

        {Object.keys(groupedResources).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedResources).map(
              ([dateKey, dateResources]) => (
                <div key={dateKey} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-foreground text-xl font-semibold">
                      {dayjs(dateKey).format("MMMM D, YYYY")}
                    </h2>
                    <div className="bg-border h-px flex-1" />
                    <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-sm">
                      {dateResources.length}{" "}
                      {dateResources.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
                    {dateResources.map((resource, index) => (
                      <div
                        className="break-inside-avoid"
                        key={`${dateKey}-${index}`}
                      >
                        <MediaRenderer
                          url={resource.url}
                          title={resource.name || `Resource ${index + 1}`}
                          description={`Uploaded ${new Date(resource.created_at).toLocaleTimeString()}`}
                          onDelete={() => handleDeleteResource(resource)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <NoResources />
        )}
        <div ref={ref}></div>
      </div>
    </MainLayout>
  );
}

const NoResources = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-3">
        <svg
          className="text-muted-foreground h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-foreground mb-2 text-lg font-medium">
        No resources found
      </h3>
      <p className="text-muted-foreground max-w-sm text-sm">
        Upload some files to get started with your resource library.
      </p>
    </div>
  );
};
