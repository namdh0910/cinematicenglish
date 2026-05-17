"use server";

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// --- STORIES ACTIONS ---

export async function getStories(filters?: { 
  query?: string, 
  category?: string, 
  status?: string,
  sort?: string 
}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from('stories').select('*');

  if (filters?.query) {
    query = query.ilike('title', `%${filters.query}%`);
  }
  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }
  if (filters?.status && filters.status !== 'All') {
    query = query.eq('status', filters.status);
  }

  // Sorting
  const sort = filters?.sort || 'created_at.desc';
  const [column, order] = sort.split('.');
  query = query.order(column, { ascending: order === 'asc' });

  try {
    const { data, error } = await query;
    if (error) {
      console.error("Supabase error fetching stories:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Failed to fetch stories:", err);
    return [];
  }
}

export async function createStory(data: any) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: story, error } = await supabase
      .from('stories')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/admin/stories');
    return { success: true, data: story };
  } catch (err: any) {
    console.error("Server Action Error:", err);
    return { success: false, error: err.message || "Unknown server error" };
  }
}

export async function getStoryById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching story:", error);
    return null;
  }
  return data;
}

export async function updateStory(id: string, data: any) {
  const supabase = await createSupabaseServerClient();
  const { data: story, error } = await supabase
    .from('stories')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath('/admin/stories');
  return story;
}

export async function deleteStory(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  revalidatePath('/admin/stories');
  return true;
}

// --- USERS ACTIONS ---

export async function getUsers(filters?: { query?: string, plan?: string, status?: string }) {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from('profiles').select('*');

  if (filters?.query) {
    query = query.or(`full_name.ilike.%${filters.query}%,email.ilike.%${filters.query}%`);
  }
  if (filters?.plan && filters.plan !== 'All Plans') {
    query = query.eq('plan', filters.plan);
  }
  if (filters?.status && filters.status !== 'All Status') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// --- ANALYTICS ACTIONS ---

export async function getAnalytics(dateRange: string = '30') {
  const supabase = await createSupabaseServerClient();
  
  // Aggregate stats using SQL functions or multiple queries
  // For simplicity, we fetch totals
  const [storiesCount, usersCount, playsSum, proUsers] = await Promise.all([
    supabase.from('stories').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('stories').select('plays'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('plan', 'Pro')
  ]);

  const totalPlays = playsSum.data?.reduce((acc: number, curr: any) => acc + (curr.plays || 0), 0) || 0;

  // Mocking time-series data for the dashboard charts
  // In real implementation, these would be separate aggregation queries
  return {
    totals: {
      plays: totalPlays,
      users: usersCount.count || 0,
      stories: storiesCount.count || 0,
      proUsers: proUsers.count || 0
    },
    dau: [
      { name: "Mon", users: 4200 },
      { name: "Tue", users: 5100 },
      { name: "Wed", users: 4800 },
      { name: "Thu", users: 6200 },
      { name: "Fri", users: 5800 },
      { name: "Sat", users: 7500 },
      { name: "Sun", users: 8400 },
    ]
  };
}

// --- CURRICULUM ACTIONS ---

export async function getGrades() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error("Error fetching grades:", error);
    return [];
  }
  return data || [];
}

export async function getGradeWithDetails(gradeId: string) {
  const supabase = await createSupabaseServerClient();
  
  // Lấy Grade kèm Semesters và Units và Lessons của nó
  const { data: grade, error } = await supabase
    .from('grades')
    .select(`
      *,
      semesters (
        *,
        units (
          *,
          lessons (
            *
          )
        )
      )
    `)
    .eq('id', gradeId)
    .single();

  if (error) {
    console.error("Error fetching grade details:", error);
    return null;
  }
  return grade;
}

export async function createGrade(data: { title: string, description: string, order_index: number }) {
  const supabase = await createSupabaseServerClient();
  const { data: grade, error } = await supabase
    .from('grades')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  revalidatePath('/admin/curriculum');
  return grade;
}

export async function createUnit(data: { semester_id: string, title: string, description: string, order_index: number }) {
  const supabase = await createSupabaseServerClient();
  const { data: unit, error } = await supabase
    .from('units')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/admin/curriculum`);
  return unit;
}

export async function getUnitWithDetails(unitId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data: unit, error } = await supabase
    .from('units')
    .select(`
      *,
      lessons (
        *,
        activities (
          *
        )
      )
    `)
    .eq('id', unitId)
    .single();

  if (error) {
    console.error("Error fetching unit details:", error);
    return null;
  }
  return unit;
}

export async function createLesson(data: { unit_id: string, title: string, type: string, order_index: number }) {
  const supabase = await createSupabaseServerClient();
  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/admin/curriculum/unit/${data.unit_id}`);
  return lesson;
}

export async function updateLesson(lessonId: string, unitId: string, data: any) {
  const supabase = await createSupabaseServerClient();
  const { data: lesson, error } = await supabase
    .from('lessons')
    .update(data)
    .eq('id', lessonId)
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/admin/curriculum/unit/${unitId}`);
  return lesson;
}

export async function deleteLesson(lessonId: string, unitId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId);

  if (error) throw error;
  revalidatePath(`/admin/curriculum/unit/${unitId}`);
  return true;
}

export async function createActivity(data: { lesson_id: string, title: string, type: string, instructions: string, content: any, order_index: number }) {
  const supabase = await createSupabaseServerClient();
  const { data: activity, error } = await supabase
    .from('activities')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return activity;
}

export async function updateActivity(activityId: string, lessonId: string, data: any) {
  const supabase = await createSupabaseServerClient();
  const { data: activity, error } = await supabase
    .from('activities')
    .update(data)
    .eq('id', activityId)
    .select()
    .single();

  if (error) throw error;
  return activity;
}

export async function deleteActivity(activityId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', activityId);

  if (error) throw error;
  return true;
}

export async function createSemester(data: { grade_id: string, title: string, order_index: number }) {
  const supabase = await createSupabaseServerClient();
  const { data: semester, error } = await supabase
    .from('semesters')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/admin/curriculum`);
  return semester;
}

export async function deleteUnit(unitId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('units')
    .delete()
    .eq('id', unitId);

  if (error) throw error;
  revalidatePath(`/admin/curriculum`);
  return true;
}

export async function getLessonWithDetails(lessonId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select(`
      *,
      unit:unit_id (
        *,
        semester:semester_id (
          *,
          grade:grade_id (
            *
          )
        )
      ),
      activities (
        *
      )
    `)
    .eq('id', lessonId)
    .single();

  if (error) {
    console.error("Error fetching lesson details:", error);
    return null;
  }
  return lesson;
}
