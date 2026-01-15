import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "warden" | "student";
  password?: string;
  hostelId?: string;
  rollNumber?: string;
  guardianContact?: string;
}

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    role: "student",
    password: "",
    hostelId: "",
    rollNumber: "",
    guardianContact: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!isEditMode && !formData.password)
      newErrors.password = "Password is required for new users";
    if (formData.role === "student" && !formData.rollNumber)
      newErrors.rollNumber = "Roll number is required for students";
    if (formData.role === "warden" && !formData.hostelId)
      newErrors.hostelId = "Hostel assignment is required for wardens";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const endpoint = isEditMode ? `/api/users/${id}` : "/api/users";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} user`);
      }

      toast({
        title: "Success",
        description: `User ${isEditMode ? "updated" : "created"} successfully`,
      });

      navigate("/users");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/users")}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? "Edit User" : "Add New User"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? "Update user information"
              : "Create a new system user"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border border-border p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white ${
                    errors.name ? "border-red-500" : "border-border"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white ${
                    errors.email ? "border-red-500" : "border-border"
                  }`}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white ${
                    errors.phone ? "border-red-500" : "border-border"
                  }`}
                  placeholder="+91 9876543210"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role & Password */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Account Details
            </h3>
            <div className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  User Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserFormData["role"],
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                >
                  <option value="student">Student</option>
                  <option value="warden">Warden</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white ${
                      errors.password ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Set a secure password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Role-Specific Fields */}
          {formData.role === "student" && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Student Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    value={formData.rollNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, rollNumber: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white ${
                      errors.rollNumber ? "border-red-500" : "border-border"
                    }`}
                    placeholder="2021001"
                  />
                  {errors.rollNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rollNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Guardian Contact
                  </label>
                  <input
                    type="tel"
                    value={formData.guardianContact || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guardianContact: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                    placeholder="+91 9876543211"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.role === "warden" && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Warden Assignment
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assign to Hostel *
                </label>
                <select
                  value={formData.hostelId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, hostelId: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white ${
                    errors.hostelId ? "border-red-500" : "border-border"
                  }`}
                >
                  <option value="">Select a hostel...</option>
                  <option value="H1">Hostel A</option>
                  <option value="H2">Hostel B</option>
                  <option value="H3">Hostel C</option>
                </select>
                {errors.hostelId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.hostelId}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update User"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
