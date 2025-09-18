<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Admin;
use App\Models\Teacher;
use App\Models\Student;

class AuthenticationController extends Controller
{
    /**
     * Register a new account.
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'     => 'required|string|min:4',
                'email'    => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role'     => 'required|string',
            ], [
                'name.required'     => '⚠️ Name is required.',
                'name.min'          => '⚠️ Name must be at least 4 characters.',
                'email.required'    => '⚠️ Email is required.',
                'email.email'       => '⚠️ Please enter a valid email address.',
                'email.unique'      => '⚠️ This email is already registered.',
                'password.required' => '⚠️ Password is required.',
                'password.min'      => '⚠️ Password must be at least 8 characters.',
                'role.required'     => '⚠️ Role is required.',
            ]);

            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role'     => $validated['role']
            ]);
            if($validated['role'] == 'admin'){
                Admin::create([
                    'user_id' => $user->id
                ]);
            }else if($validated['role'] == 'teacher'){
                // ✅ Dynamic prefix based on current year
                $prefix = date('Y'); // e.g. 2025

                // ✅ Find last employee ID for this year
                $lastEmployee = Teacher::where('employee_id', 'like', $prefix . '%')
                                    ->orderBy('employee_id', 'desc')
                                    ->first();

                if ($lastEmployee) {
                    // Get numeric part after the year prefix
                    $lastNumber = intval(substr($lastEmployee->employee_id, 4));
                    $nextNumber = $lastNumber + 1;
                } else {
                    // Start fresh at 1000 for each new year
                    $nextNumber = 1000;
                }

                // ✅ Build employee ID (e.g., 20251000, 20251001…)
                $employeeId = $prefix . $nextNumber;
                Teacher::create([
                    'user_id' => $user->id,
                    'employee_id' => $employeeId,
                    'department' => 'English Department',
                    'specialization' => 'English'
                ]);
            }else if($validated['role'] == 'student'){
                // ✅ Dynamic prefix based on current year
                $stud_prefix = date('Y'); // e.g. 2025

                // ✅ Find last employee ID for this year
                $lastStudent = Student::where('student_id', 'like', $stud_prefix . '%')
                                    ->orderBy('student_id', 'desc')
                                    ->first();

                if ($lastStudent) {
                    // Get numeric part after the year prefix
                    $lastStudNumber = intval(substr($lastStudent->student_id, 4));
                    $nextStudNumber = $lastStudNumber + 1;
                } else {
                    // Start fresh at 1000 for each new year
                    $nextStudNumber = 1000;
                }

                // ✅ Build employee ID (e.g., 20251000, 20251001…)
                $studentId = $stud_prefix . $nextStudNumber;
                Student::create([
                    'user_id' => $user->id,
                    'student_id' => $studentId,
                    'course' => 'BSIT',
                    'year_level' => '1st Year'
                ]);
            }

            return response()->json([
                'response_code' => 201,
                'status'        => 'success',
                'message'       => '✅ Successfully registered',
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status'        => 'error',
                'message'       => '⚠️ Please fix the errors below.',
                'errors'        => $e->errors(), // <-- each field has its own messages
            ], 422);
        } catch (\Exception $e) {
            Log::error('Registration Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status'        => 'error',
                'message'       => '❌ Registration failed. Please try again later.',
            ], 500);
        }
    }


    /**
     * Login and return auth token.
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email'    => 'required|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'response_code' => 401,
                    'status'        => 'error',
                    'message'       => 'Unauthorized',
                ], 401);
            }

            $user = Auth::user();
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'response_code' => 200,
                'status'        => 'success',
                'message'       => 'Login successful',
                'user_info'     => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
                'token'       => $token,
                'token_type'  => 'Bearer',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status'        => 'error',
                'message'       => 'Validation failed',
                'errors'        => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status'        => 'error',
                'message'       => 'Login failed',
            ], 500);
        }
    }

    public function changePassword(Request $request)
    {
        $user = Auth::user(); // returns null if not authenticated

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => '❌ User not authenticated.'
            ], 401);
        }

        // Check if current password matches
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
            ], 400);
        }

        $request->validate([
            'new_password' => 'required|min:8'
        ]);

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
        ]);
    }

    public function profile(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'response_code' => 401,
                    'status'        => 'error',
                    'message'       => 'User not authenticated',
                ], 401);
            }

            return response()->json([
                'response_code' => 200,
                'status'        => 'success',
                'message'       => 'Fetched profile successfully',
                'data_user'     => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Profile Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status'        => 'error',
                'message'       => 'Failed to fetch profile',
            ], 500);
        }
    }


    /**
     * Get list of users (paginated) — protected route.
     */
    public function userInfo(Request $request)
    {
        try {
            $query = User::query();

            // Filter by role if provided in query
            if ($request->has('role')) {
                $role = $request->query('role');
                $query->where('role', $role);
            }

            // Get all users matching the query
            $users = $query->latest()->get();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    // Update user
    public function update(Request $request)
    {
        $user = Auth::user(); // returns null if not authenticated

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => '❌ User not authenticated.'
            ], 401);
        }
        $updatedUser = User::find($request->id);

        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $request->id,
            'role' => 'sometimes|string', // ⚠️ only if you allow role changes
        ]);

        $updatedUser->name = $request->name ?? $user->name;
        $updatedUser->email = $request->email ?? $user->email;


        if ($request->filled('role')) {
            $updatedUser->role = $request->role;
        }

        $updatedUser->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user(); // only the logged-in user

        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|string', // ⚠️ only if you allow role changes
            'password' => 'nullable|string|min:6'
        ]);

        $user->name = $request->name ?? $user->name;
        $user->email = $request->email ?? $user->email;


        if ($request->filled('role')) {
            $user->role = $request->role;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }


    // Delete user
    public function destroy(Request $request)
    {
        $user = $request->user(); // returns null if not authenticated

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => '❌ User not authenticated.'
            ], 401);
        }else{
            $deleteUser = User::find($request->id);
            if (!$deleteUser) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $deleteUser->delete();

            return response()->json(['message' => 'User deleted']);
        }

    }



    /**
     * Logout user and revoke tokens — protected route.
     */
    public function logOut(Request $request)
    {
        try {
            $user = $request->user();

            if ($user) {
                $user->tokens()->delete();

                return response()->json([
                    'response_code' => 200,
                    'status'        => 'success',
                    'message'       => 'Successfully logged out',
                ]);
            }

            return response()->json([
                'response_code' => 401,
                'status'        => 'error',
                'message'       => 'User not authenticated',
            ], 401);
        } catch (\Exception $e) {
            Log::error('Logout Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status'        => 'error',
                'message'       => 'An error occurred during logout',
            ], 500);
        }
    }
}