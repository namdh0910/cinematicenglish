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

  revalidatePath('/dashboard');
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
