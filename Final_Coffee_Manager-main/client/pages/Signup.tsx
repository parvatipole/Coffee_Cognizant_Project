import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Coffee,
  User,
  Building,
  Lock,
  Eye,
  EyeOff,
  MapPin,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "",
    city: "",
    officeName: "",
  });

  // Office options based on city - matching admin dashboard offices only
  const officeOptions = {
    pune: [
      "Hinjewadi IT Park",
      "Koregaon Park Corporate",
      "Viman Nagar Tech Hub",
    ],
    mumbai: [
      "Bandra Kurla Complex",
      "Lower Parel Financial",
      "Andheri Tech Center",
    ],
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    // Only require city and office for technicians, not admins
    if (formData.role === "technician") {
      if (!formData.city) {
        setError("Please select a city");
        return;
      }

      if (!formData.officeName) {
        setError("Please select an office");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    // Simple registration - save to localStorage
    try {
      const userData = {
        username: formData.username,
        name: formData.name,
        password: formData.password,
        role: formData.role,
        city: formData.role === "admin" ? null : formData.city,
        officeName: formData.role === "admin" ? null : formData.officeName,
        registeredAt: new Date().toISOString(),
      };

      // Check if username already exists
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );
      if (
        existingUsers.find((user: any) => user.username === formData.username)
      ) {
        setError("Username already exists. Please choose a different one.");
        setIsLoading(false);
        return;
      }

      // Save user
      existingUsers.push(userData);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

      setSuccess("Registration successful! You can now login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleCityChange = (city: string) => {
    setFormData((prev) => ({ ...prev, city, officeName: "" })); // Reset office when city changes
    if (error) setError("");
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role,
      // Clear city and office when admin is selected
      city: role === "admin" ? "" : prev.city,
      officeName: role === "admin" ? "" : prev.officeName,
    }));
    if (error) setError("");
  };

  const handleOfficeChange = (officeName: string) => {
    setFormData((prev) => ({ ...prev, officeName }));
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
            <Coffee className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Join CoffeeFlow
          </CardTitle>
          <CardDescription className="text-gray-600">
            Register to access the CoffeeFlow management system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Only show city and office fields for technicians */}
            {formData.role === "technician" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select
                      value={formData.city}
                      onValueChange={handleCityChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeName">Office</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <Select
                      value={formData.officeName}
                      onValueChange={handleOfficeChange}
                      disabled={isLoading || !formData.city}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue
                          placeholder={
                            formData.city
                              ? "Select your office"
                              : "Select city first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.city &&
                          officeOptions[
                            formData.city as keyof typeof officeOptions
                          ]?.map((office) => (
                            <SelectItem key={office} value={office}>
                              {office}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
