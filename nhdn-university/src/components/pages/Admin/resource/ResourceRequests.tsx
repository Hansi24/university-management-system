import { useState } from "react";
// import TitleBar from "../../../layout/TitleBar";
// import ASideBar from "../ASideBar";

interface ResourceRequest {
  id: number;
  title: string;
  resource: string;
  date: string;
  time: string;
  duration: string;
  description: string;
  status: "pending" | "approved" | "returned";
}

const initialRequests: ResourceRequest[] = [
  { id: 1, title: "A - Room", resource: "Room A", date: "2024-03-10", time: "10:00 AM", duration: "2 Hours", description: "Meeting Room Booking", status: "pending" },
  { id: 2, title: "Speaker", resource: "Audio Speaker", date: "2024-03-11", time: "2:00 PM", duration: "3 Hours", description: "Seminar Speaker", status: "pending" },
  { id: 3, title: "C - Room", resource: "Room C", date: "2024-03-12", time: "1:00 PM", duration: "1 Hour", description: "Lecture Room", status: "pending" },
  { id: 4, title: "A - Room", resource: "Room A", date: "2024-03-13", time: "9:00 AM", duration: "4 Hours", description: "Conference Room", status: "approved" },
];

export default function ResourceRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);

  const handleApprove = (id: number) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)));
  };

  const handleReject = (id: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleReturn = (id: number) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "returned" } : req)));
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* <ASideBar /> */}
      <div className="flex flex-col flex-grow">
        {/* <TitleBar /> */}
        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Requested Resources</h2>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            {requests.map((request) => (
              <div key={request.id} className="flex justify-between items-center p-2 border-b">
                <span
                  className="font-semibold cursor-pointer hover:text-blue-500"
                  onClick={() => setSelectedRequest(request)}
                >
                  {request.title}
                </span>
                {request.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-md"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                ) : request.status === "approved" ? (
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded-md"
                    onClick={() => handleReturn(request.id)}
                  >
                    Return
                  </button>
                ) : (
                  <span className="text-gray-500">Returned</span>
                )}
              </div>
            ))}
          </div>

          {selectedRequest && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Request Details</h3>
              <p><strong>Title:</strong> {selectedRequest.title}</p>
              <p><strong>Resource:</strong> {selectedRequest.resource}</p>
              <p><strong>Date:</strong> {selectedRequest.date}</p>
              <p><strong>Time:</strong> {selectedRequest.time}</p>
              <p><strong>Duration:</strong> {selectedRequest.duration}</p>
              <p><strong>Description:</strong> {selectedRequest.description}</p>
              <div className="mt-4 flex gap-2">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      onClick={() => handleApprove(selectedRequest.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                      onClick={() => handleReject(selectedRequest.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedRequest.status === "approved" && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={() => handleReturn(selectedRequest.id)}
                  >
                    Return
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
