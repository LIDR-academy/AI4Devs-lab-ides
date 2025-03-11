import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "./components/Layout";
import { StatCard } from "./components/StatCard";
import { CandidateTable } from "./components/CandidateTable";
import { Status, Candidate } from "./types";
import { api } from "./services/api";
import { CandidateForm } from "./components/CandidateForm";
import { StatusFilter } from "./components/StatusFilter";
import { Toast } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    waiting: 0,
    interview: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status | "ALL">("ALL");
  const [toast, setToast] = useState<{
    open: boolean;
    title: string;
    type: "success" | "error";
  }>({
    open: false,
    title: "",
    type: "success",
  });
  const [loadingStates, setLoadingStates] = useState({
    status: [] as number[],
    delete: [] as number[],
    download: [] as number[],
    addCandidate: false,
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesData, statsData] = await Promise.all([
        api.getAllCandidates(),
        api.getStatistics(),
      ]);
      setCandidates(candidatesData);
      setStatistics(statsData);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (title: string, type: "success" | "error") => {
    setToast({ open: true, title, type });
  };

  const handleStatusChange = async (id: number, status: Status) => {
    try {
      setLoadingStates((prev) => ({ ...prev, status: [...prev.status, id] }));
      await api.updateCandidateStatus(id, status);
      fetchData();
      showToast("Status updated successfully", "success");
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Failed to update status", "error");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        status: prev.status.filter((stateId) => stateId !== id),
      }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;

    try {
      setLoadingStates((prev) => ({ ...prev, delete: [...prev.delete, id] }));
      await api.deleteCandidate(id);
      fetchData();
      showToast("Candidate deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete candidate:", err);
      showToast("Failed to delete candidate", "error");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        delete: prev.delete.filter((stateId) => stateId !== id),
      }));
    }
  };

  const handleDownloadCV = async (id: number) => {
    try {
      await api.downloadCV(id);
    } catch (err) {
      console.error("Failed to download CV:", err);
    }
  };

  const handleAddCandidate = async (formData: FormData) => {
    try {
      setLoadingStates((prev) => ({ ...prev, addCandidate: true }));
      await api.createCandidate(formData);
      fetchData();
      setShowAddModal(false);
      showToast("Candidate added successfully", "success");
    } catch (err) {
      console.error("Failed to add candidate:", err);
      showToast("Failed to add candidate", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, addCandidate: false }));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      searchQuery === "" ||
      `${candidate.firstName} ${candidate.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" || candidate.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout searchValue={searchQuery} onSearchChange={handleSearchChange}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout searchValue={searchQuery} onSearchChange={handleSearchChange}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      searchValue={searchQuery}
      onSearchChange={handleSearchChange}
      isSearching={isSearching}
    >
      <div className="space-y-8">
        <ErrorBoundary
          fallback={
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
              Failed to load statistics
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Candidates"
              value={statistics.total}
              color="bg-primary"
            />
            <StatCard
              title="Waiting"
              value={statistics.waiting}
              color="bg-status-waiting"
            />
            <StatCard
              title="Interview"
              value={statistics.interview}
              color="bg-status-interview"
            />
            <StatCard
              title="Rejected"
              value={statistics.rejected}
              color="bg-status-rejected"
            />
          </div>
        </ErrorBoundary>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Candidates
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent 
                  rounded-lg shadow-sm text-sm font-medium text-white bg-secondary 
                  hover:bg-secondary/90 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
              >
                Add Candidate
              </button>
            </div>
            <div className="mt-4">
              <StatusFilter
                selectedStatus={selectedStatus}
                onChange={setSelectedStatus}
              />
            </div>
          </div>

          <CandidateTable
            candidates={filteredCandidates}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onDownloadCV={handleDownloadCV}
            loadingStates={loadingStates}
          />
        </div>
      </div>

      {showAddModal && (
        <ErrorBoundary
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <h2 className="text-red-600">Failed to load form</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          }
        >
          <CandidateForm
            onSubmit={handleAddCandidate}
            onClose={() => setShowAddModal(false)}
          />
        </ErrorBoundary>
      )}

      <Toast
        open={toast.open}
        setOpen={(open) => setToast((prev) => ({ ...prev, open }))}
        title={toast.title}
        type={toast.type}
      />
    </Layout>
  );
}

export default App;
