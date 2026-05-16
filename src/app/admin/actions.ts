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
  const supabase = await createSupabaseServerClient();
  const { data: story, error } = await supabase
    .from('stories')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  revalidatePath('/admin/stories');
  return story;
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
