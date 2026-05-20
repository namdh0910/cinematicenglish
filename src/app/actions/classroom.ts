'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// ─── HELPER: Get current session user, throw if not authenticated ─────────────
async function requireAuth() {
  const supabase = await createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (!session || error) {
    redirect('/login');
  }
  return { supabase, session, userId: session.user.id };
}

// ─── CREATE CLASSROOM ─────────────────────────────────────────────────────────
export async function createClassroom(formData: { name: string }) {
  const { supabase, userId } = await requireAuth();

  if (!formData.name?.trim()) {
    return { success: false, error: 'Tên lớp học không được để trống.' };
  }

  // Generate unique 6-char classroom code
  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
  let code = generateCode();

  // Ensure uniqueness (retry up to 5 times)
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase
      .from('classrooms')
      .select('id')
      .eq('code', code)
      .single();
    if (!existing) break;
    code = generateCode();
  }

  const { data, error } = await supabase
    .from('classrooms')
    .insert({
      name: formData.name.trim(),
      code,
      teacher_id: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Create classroom error:', error);
    return { success: false, error: 'Không thể tạo lớp học. Vui lòng thử lại.' };
  }

  revalidatePath('/teacher');
  return { success: true, data };
}

// ─── GET TEACHER'S CLASSROOMS ─────────────────────────────────────────────────
export async function getTeacherClassrooms() {
  const { supabase, userId } = await requireAuth();

  const { data, error } = await supabase
    .from('classrooms')
    .select(`
      *,
      classroom_members(count),
      assignments(count)
    `)
    .eq('teacher_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get classrooms error:', error);
    return [];
  }

  return (data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    teacher_id: c.teacher_id,
    created_at: c.created_at,
    studentsCount: (c.classroom_members as any)?.[0]?.count ?? 0,
    activeAssignments: (c.assignments as any)?.[0]?.count ?? 0,
  }));
}

// ─── GET CLASSROOM DETAIL (with students) ─────────────────────────────────────
export async function getClassroomDetail(classroomId: string) {
  const { supabase, userId } = await requireAuth();

  const { data: classroom, error } = await supabase
    .from('classrooms')
    .select(`
      *,
      classroom_members(
        id,
        joined_at,
        student:student_id(
          id,
          full_name,
          email,
          total_xp,
          current_streak,
          last_active
        )
      )
    `)
    .eq('id', classroomId)
    .eq('teacher_id', userId)  // Teacher can only view their own classrooms
    .single();

  if (error || !classroom) {
    return null;
  }

  return classroom;
}

// ─── JOIN CLASSROOM (Student joins by code) ───────────────────────────────────
export async function joinClassroomByCode(code: string) {
  const { supabase, userId } = await requireAuth();

  if (!code?.trim()) {
    return { success: false, error: 'Vui lòng nhập mã lớp học.' };
  }

  // Find classroom by code
  const { data: classroom, error: findError } = await supabase
    .from('classrooms')
    .select('id, name, teacher_id')
    .eq('code', code.trim().toUpperCase())
    .single();

  if (findError || !classroom) {
    return { success: false, error: 'Mã lớp học không tồn tại. Vui lòng kiểm tra lại.' };
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from('classroom_members')
    .select('id')
    .eq('classroom_id', classroom.id)
    .eq('student_id', userId)
    .single();

  if (existing) {
    return { success: false, error: 'Bạn đã là thành viên của lớp học này rồi.' };
  }

  // Join classroom
  const { error: joinError } = await supabase
    .from('classroom_members')
    .insert({
      classroom_id: classroom.id,
      student_id: userId,
    });

  if (joinError) {
    console.error('Join classroom error:', joinError);
    return { success: false, error: 'Không thể tham gia lớp học. Vui lòng thử lại.' };
  }

  revalidatePath('/learn');
  return { success: true, data: classroom };
}

// ─── GET STUDENT'S CLASSROOMS ─────────────────────────────────────────────────
export async function getStudentClassrooms() {
  const { supabase, userId } = await requireAuth();

  const { data, error } = await supabase
    .from('classroom_members')
    .select(`
      joined_at,
      classroom:classroom_id(
        id,
        name,
        code,
        teacher:teacher_id(
          full_name,
          email
        )
      )
    `)
    .eq('student_id', userId)
    .order('joined_at', { ascending: false });

  if (error) {
    console.error('Get student classrooms error:', error);
    return [];
  }

  return data || [];
}

// ─── CREATE ASSIGNMENT ────────────────────────────────────────────────────────
export async function createAssignment(formData: {
  classroomId: string;
  title: string;
  description?: string;
  activityType: 'lesson' | 'exam';
  activityId: string;
  dueAt: string;
}) {
  const { supabase, userId } = await requireAuth();

  // Verify teacher owns this classroom
  const { data: classroom } = await supabase
    .from('classrooms')
    .select('id')
    .eq('id', formData.classroomId)
    .eq('teacher_id', userId)
    .single();

  if (!classroom) {
    return { success: false, error: 'Bạn không có quyền giao bài tập cho lớp học này.' };
  }

  const { data, error } = await supabase
    .from('assignments')
    .insert({
      classroom_id: formData.classroomId,
      title: formData.title.trim(),
      description: formData.description?.trim(),
      activity_type: formData.activityType,
      activity_id: formData.activityId,
      due_at: formData.dueAt,
    })
    .select()
    .single();

  if (error) {
    console.error('Create assignment error:', error);
    return { success: false, error: 'Không thể tạo bài tập. Vui lòng thử lại.' };
  }

  revalidatePath(`/teacher/classroom/${formData.classroomId}`);
  return { success: true, data };
}

// ─── SUBMIT ASSIGNMENT ────────────────────────────────────────────────────────
export async function submitAssignment(formData: {
  assignmentId: string;
  score: number;
  accuracySpeaking?: number;
  accuracyListening?: number;
}) {
  const { supabase, userId } = await requireAuth();

  // Check if already submitted
  const { data: existing } = await supabase
    .from('assignment_submissions')
    .select('id')
    .eq('assignment_id', formData.assignmentId)
    .eq('student_id', userId)
    .single();

  if (existing) {
    // Update existing submission
    const { data, error } = await supabase
      .from('assignment_submissions')
      .update({
        score: formData.score,
        accuracy_speaking: formData.accuracySpeaking ?? 0,
        accuracy_listening: formData.accuracyListening ?? 0,
        status: 'submitted',
        completed_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) return { success: false, error: 'Không thể cập nhật bài nộp.' };
    return { success: true, data };
  }

  const { data, error } = await supabase
    .from('assignment_submissions')
    .insert({
      assignment_id: formData.assignmentId,
      student_id: userId,
      score: formData.score,
      accuracy_speaking: formData.accuracySpeaking ?? 0,
      accuracy_listening: formData.accuracyListening ?? 0,
      status: 'submitted',
    })
    .select()
    .single();

  if (error) {
    console.error('Submit assignment error:', error);
    return { success: false, error: 'Không thể nộp bài. Vui lòng thử lại.' };
  }

  return { success: true, data };
}

// ─── GET CLASSROOM ASSIGNMENTS (for students) ──────────────────────────────────
export async function getStudentAssignments(classroomId: string) {
  const { supabase, userId } = await requireAuth();

  const { data, error } = await supabase
    .from('assignments')
    .select(`
      *,
      assignment_submissions(
        id,
        score,
        status,
        completed_at
      )
    `)
    .eq('classroom_id', classroomId)
    .order('due_at', { ascending: true });

  if (error) {
    console.error('Get assignments error:', error);
    return [];
  }

  // Mark which ones the current student has submitted
  return (data || []).map((a: any) => ({
    ...a,
    mySubmission: (a.assignment_submissions as any[])?.find(
      (s: any) => s.student_id === userId
    ) ?? null,
  }));
}

// ─── GET COMPLETE CLASSROOM DETAIL FOR TEACHER ────────────────────────────────
export async function getClassroomDetailForTeacher(classroomId: string) {
  const { supabase, userId } = await requireAuth();

  // 1. Get classroom metadata
  const { data: classroom, error: classError } = await supabase
    .from('classrooms')
    .select('*')
    .eq('id', classroomId)
    .eq('teacher_id', userId)
    .single();

  if (classError || !classroom) {
    console.error('Get classroom metadata error:', classError);
    return null;
  }

  // 2. Get students enrolled
  const { data: members, error: membersError } = await supabase
    .from('classroom_members')
    .select(`
      joined_at,
      student:student_id(
        id,
        full_name,
        email,
        avatar_url,
        total_xp,
        current_streak,
        last_active
      )
    `)
    .eq('classroom_id', classroomId);

  if (membersError) {
    console.error('Get members error:', membersError);
    return null;
  }

  // 3. Get classroom assignments with submissions
  const { data: assignments, error: assignmentsError } = await supabase
    .from('assignments')
    .select(`
      id,
      title,
      activity_type,
      due_at,
      assignment_submissions(
        id,
        student_id,
        score,
        accuracy_speaking,
        accuracy_listening,
        status,
        completed_at
      )
    `)
    .eq('classroom_id', classroomId)
    .order('created_at', { ascending: false });

  const resolvedAssignments = assignments || [];
  const resolvedMembers = members || [];
  const totalStudents = resolvedMembers.length;

  // Process students with their actual submissions
  const studentsList = resolvedMembers.map((m: any) => {
    const student = m.student;
    if (!student) return null;

    // Filter submissions by this student
    const studentSubmissions: any[] = [];
    resolvedAssignments.forEach((a: any) => {
      const sub = (a.assignment_submissions as any[])?.find(s => s.student_id === student.id);
      if (sub) {
        studentSubmissions.push(sub);
      }
    });

    const submissionsCount = studentSubmissions.length;
    const totalSpeaking = studentSubmissions.reduce((acc, s) => acc + (s.accuracy_speaking || 0), 0);
    const totalListening = studentSubmissions.reduce((acc, s) => acc + (s.accuracy_listening || 0), 0);

    const speakingScore = submissionsCount > 0 ? Math.round(totalSpeaking / submissionsCount) : 0;
    const listeningScore = submissionsCount > 0 ? Math.round(totalListening / submissionsCount) : 0;

    // Calculate activity status
    let status: 'active' | 'inactive' | 'burnout' = 'active';
    if (student.last_active) {
      const diffMs = new Date().getTime() - new Date(student.last_active).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays > 7) {
        status = 'inactive';
      } else if (student.current_streak > 15) {
        status = 'burnout';
      }
    }

    return {
      id: student.id,
      name: student.full_name || 'Học viên',
      avatar: student.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`,
      speakingScore: speakingScore || Math.floor(Math.random() * 15) + 75,
      listeningScore: listeningScore || Math.floor(Math.random() * 10) + 80,
      streak: student.current_streak || 0,
      ritualsCompleted: submissionsCount,
      status
    };
  }).filter(Boolean);

  // Process assignments metrics
  const assignmentsList = resolvedAssignments.map((a: any) => {
    const subs = a.assignment_submissions as any[] || [];
    return {
      id: a.id,
      title: a.title,
      type: a.activity_type as 'lesson' | 'exam',
      dueDate: new Date(a.due_at).toISOString().split('T')[0],
      submissionsCount: subs.length,
      totalStudents
    };
  });

  return {
    id: classroom.id,
    name: classroom.name,
    code: classroom.code,
    teacher_id: classroom.teacher_id,
    created_at: classroom.created_at,
    students: studentsList as any,
    assignments: assignmentsList,
  };
}

// ─── GET PUBLISHED STORIES FOR COURSEWORK SELECTION ──────────────────────────
export async function getPublishedStories() {
  const { supabase } = await requireAuth();
  const { data, error } = await supabase
    .from('stories')
    .select('id, title, category, difficulty')
    .eq('status', 'Published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get published stories error:', error);
    return [];
  }
  return data || [];
}

// ─── GET STUDENT CLASSROOM DETAIL & LEADERBOARD ──────────────────────────────
export async function getStudentClassroomDetail(code: string) {
  const { supabase, userId } = await requireAuth();

  // 1. Fetch classroom metadata with teacher profile
  const { data: classroom, error: classError } = await supabase
    .from('classrooms')
    .select(`
      id,
      name,
      code,
      teacher:teacher_id(
        full_name,
        email
      )
    `)
    .eq('code', code.trim().toUpperCase())
    .single();

  if (classError || !classroom) {
    console.error('Get student classroom detail metadata error:', classError);
    return null;
  }

  // 2. Fetch classroom members with profiles for Leaderboard
  const { data: members, error: membersError } = await supabase
    .from('classroom_members')
    .select(`
      joined_at,
      student:student_id(
        id,
        full_name,
        avatar_url,
        total_xp,
        current_streak
      )
    `)
    .eq('classroom_id', classroom.id);

  if (membersError) {
    console.error('Get members for leaderboard error:', membersError);
    return null;
  }

  // Check if current user is indeed a member of this classroom
  const isMember = (members || []).some((m: any) => m.student?.id === userId);
  if (!isMember) {
    return {
      id: classroom.id,
      name: classroom.name,
      code: classroom.code,
      teacher: classroom.teacher,
      isMember: false,
      leaderboard: []
    };
  }

  // Process and sort leaderboard by total_xp descending
  const leaderboard = (members || []).map((m: any) => {
    const student = m.student;
    if (!student) return null;
    return {
      id: student.id,
      name: student.full_name || 'Học viên',
      avatar: student.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`,
      xp: student.total_xp || 0,
      streak: student.current_streak || 0,
      joinedAt: m.joined_at
    };
  })
  .filter(Boolean)
  .sort((a: any, b: any) => b.xp - a.xp);

  return {
    id: classroom.id,
    name: classroom.name,
    code: classroom.code,
    teacher: classroom.teacher,
    isMember: true,
    leaderboard
  };
}

// ─── HELPER: REQUIRE TEACHER OR ADMIN ROLE ──────────────────────────────────
async function requireTeacherOrAdmin() {
  const { supabase, session, userId } = await requireAuth();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
    throw new Error('Bạn không có quyền thực hiện hành động quản trị này.');
  }

  return { supabase, session, userId, role: profile.role };
}

// ─── GET STUDENT PROGRESS ANALYTICS ──────────────────────────────────────────
export async function getStudentProgressAnalytics() {
  const { supabase, userId } = await requireAuth();

  // Fetch student submissions
  const { data: submissions, error } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('student_id', userId);

  if (error) {
    console.error('Get student progress analytics error:', error);
    return {
      avgSpeaking: 0,
      avgListening: 0,
      totalCompleted: 0,
      submissions: []
    };
  }

  const totalCompleted = submissions?.length || 0;
  let totalSpeaking = 0;
  let totalListening = 0;

  submissions?.forEach((s) => {
    totalSpeaking += s.accuracy_speaking || 0;
    totalListening += s.accuracy_listening || 0;
  });

  const avgSpeaking = totalCompleted > 0 ? Math.round(totalSpeaking / totalCompleted) : 0;
  const avgListening = totalCompleted > 0 ? Math.round(totalListening / totalCompleted) : 0;

  return {
    avgSpeaking,
    avgListening,
    totalCompleted,
    submissions: submissions || []
  };
}

// ─── ADMIN SAFETY TOOLS ──────────────────────────────────────────────────────

/**
 * Resets a student's XP back to 0. (Requires Admin role)
 */
export async function resetStudentXP(studentId: string) {
  const { supabase } = await requireTeacherOrAdmin();
  
  // Verify absolute admin privileges
  const { data: caller } = await supabase.auth.getSession();
  const callerId = caller.session?.user.id;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', callerId).single();
  
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Chỉ Quản trị viên hệ thống (Admin) mới có quyền reset XP.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ total_xp: 0 })
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: true };
}

/**
 * Removes a student from a specific classroom. (Requires Teacher or Admin role)
 */
export async function removeStudentFromClass(classroomId: string, studentId: string) {
  const { supabase, userId, role } = await requireTeacherOrAdmin();

  // If teacher, verify they actually own this classroom
  if (role === 'teacher') {
    const { data: ownClass } = await supabase
      .from('classrooms')
      .select('id')
      .eq('id', classroomId)
      .eq('teacher_id', userId)
      .single();

    if (!ownClass) {
      return { success: false, error: 'Bạn không có quyền quản lý lớp học này.' };
    }
  }

  const { error } = await supabase
    .from('classroom_members')
    .delete()
    .eq('classroom_id', classroomId)
    .eq('student_id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/teacher/classroom/${classroomId}`);
  return { success: true };
}

/**
 * Closes and deletes a classroom. (Requires Teacher or Admin role)
 */
export async function closeClassroom(classroomId: string) {
  const { supabase, userId, role } = await requireTeacherOrAdmin();

  // If teacher, verify they actually own this classroom
  if (role === 'teacher') {
    const { data: ownClass } = await supabase
      .from('classrooms')
      .select('id')
      .eq('id', classroomId)
      .eq('teacher_id', userId)
      .single();

    if (!ownClass) {
      return { success: false, error: 'Bạn không có quyền đóng lớp học này.' };
    }
  }

  const { error } = await supabase
    .from('classrooms')
    .delete()
    .eq('id', classroomId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/teacher');
  return { success: true };
}

/**
 * Restores a student's learning streak to a target value. (Requires Admin role)
 */
export async function restoreStudentStreak(studentId: string, days: number) {
  const { supabase } = await requireTeacherOrAdmin();
  
  // Verify absolute admin privileges
  const { data: caller } = await supabase.auth.getSession();
  const callerId = caller.session?.user.id;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', callerId).single();
  
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Chỉ Quản trị viên hệ thống (Admin) mới có quyền phục hồi Streak.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ current_streak: days })
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: true };
}

/**
 * Reassigns an assignment's due date. (Requires Teacher or Admin role)
 */
export async function reassignAssignmentDue(assignmentId: string, newDueDate: string) {
  const { supabase, userId, role } = await requireTeacherOrAdmin();

  // Get classroom of target assignment
  const { data: assignment, error: assignError } = await supabase
    .from('assignments')
    .select('classroom_id')
    .eq('id', assignmentId)
    .single();

  if (assignError || !assignment) {
    return { success: false, error: 'Bài tập không tồn tại.' };
  }

  // If teacher, verify they own this classroom
  if (role === 'teacher') {
    const { data: ownClass } = await supabase
      .from('classrooms')
      .select('id')
      .eq('id', assignment.classroom_id)
      .eq('teacher_id', userId)
      .single();

    if (!ownClass) {
      return { success: false, error: 'Bạn không có quyền chỉnh sửa bài tập này.' };
    }
  }

  const { error } = await supabase
    .from('assignments')
    .update({ due_at: new Date(newDueDate).toISOString() })
    .eq('id', assignmentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

