import React from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import TableHeader from "@/components/molecules/TableHeader";
import { format } from "date-fns";

const StudentTable = ({
  students,
  loading,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "enrollmentDate", label: "Enrollment", sortable: true },
    { key: "classes", label: "Classes", sortable: false },
    { key: "status", label: "Status", sortable: true },
    { key: "actions", label: "Actions", sortable: false }
  ];

  const handleDelete = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      onDelete(student.Id);
      toast.success("Student deleted successfully");
    }
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-16"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 p-4">
              <div className="flex space-x-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader
            columns={columns}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr
                key={student.Id}
                className="hover:bg-gradient-to-r hover:from-primary-25 hover:to-primary-50 transition-all duration-200 cursor-pointer"
                onClick={() => onViewDetails(student)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-primary-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-secondary-400">
                        Student #{student.Id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-primary-900">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-primary-900">
                    {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-primary-900">
                    {student.classIds?.length || 0} classes
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={student.status === "active" ? "success" : "secondary"}>
                    {student.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Edit"
                      onClick={() => onEdit(student)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Trash2"
                      onClick={() => handleDelete(student)}
                      className="text-error hover:text-error hover:bg-error/10"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StudentTable;