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
    query = query.eq('subscription_plan', filters.plan.toLowerCase());
  }
  if (filters?.status && filters.status !== 'All Status') {
    query = query.eq('subscription_status', filters.status.toLowerCase());
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  
  // Map database profiles to the UserDetail format expected by UI components
  return (data || []).map(p => ({
    id: p.id,
    name: p.full_name || 'Học viên',
    email: p.email,
    avatar: p.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.email}`,
    plan: p.subscription_plan === 'pro' ? 'Pro' : p.subscription_plan === 'team' || p.subscription_plan === 'school' ? 'Group' : 'Free',
    status: p.subscription_status === 'active' || p.subscription_status === 'trialing' ? 'Active' : p.subscription_status === 'canceled' ? 'Inactive' : 'Banned',
    joinDate: new Date(p.created_at).toLocaleDateString('vi-VN'),
    lastActive: p.updated_at ? new Date(p.updated_at).toLocaleDateString('vi-VN') : 'Gần đây',
    totalXP: p.xp_score || 0,
    storiesCompleted: 0,
    quizzesCompleted: 0,
    avgQuizScore: 0,
    streak: 0,
    subscription: {
      startDate: new Date(p.created_at).toLocaleDateString('vi-VN'),
      expiryDate: 'Không giới hạn',
      amountPaid: p.subscription_plan === 'pro' ? '299,000đ' : '0đ'
    },
    recentActivity: [],
    xpHistory: []
  }));
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
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (isMockMode) {
    return [
      { id: "grade-10", title: "Lớp 10 - Global Success", description: "Chương trình Tiếng Anh lớp 10 theo chuẩn GD&ĐT mới.", order_index: 1 },
      { id: "grade-11", title: "Lớp 11 - Global Success", description: "Chương trình Tiếng Anh lớp 11 theo chuẩn GD&ĐT mới.", order_index: 2 },
      { id: "grade-12", title: "Lớp 12 - Global Success", description: "Chương trình Tiếng Anh lớp 12 theo chuẩn GD&ĐT mới.", order_index: 3 }
    ];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .order('order_index', { ascending: true });

  if (error || !data || data.length === 0) {
    console.error("Error fetching grades or empty data, using fallback:", error);
    return [
      { id: "grade-10", title: "Lớp 10 - Global Success", description: "Chương trình Tiếng Anh lớp 10 theo chuẩn GD&ĐT mới.", order_index: 1 },
      { id: "grade-11", title: "Lớp 11 - Global Success", description: "Chương trình Tiếng Anh lớp 11 theo chuẩn GD&ĐT mới.", order_index: 2 },
      { id: "grade-12", title: "Lớp 12 - Global Success", description: "Chương trình Tiếng Anh lớp 12 theo chuẩn GD&ĐT mới.", order_index: 3 }
    ];
  }
  return data;
}

export async function getGradeWithDetails(gradeId: string) {
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const mockGrade = {
    id: gradeId,
    title: gradeId === "grade-10" ? "Lớp 10 - Global Success" : gradeId === "grade-11" ? "Lớp 11 - Global Success" : "Lớp 12 - Global Success",
    description: "Chương trình Tiếng Anh theo chuẩn GD&ĐT mới.",
    semesters: [
      {
        id: "semester-1",
        title: "Học kỳ I",
        order_index: 1,
        units: [
          {
            id: "unit-1",
            title: "Unit 1: Family Life",
            description: "Đời sống gia đình và trách nhiệm của thành viên.",
            order_index: 1,
            lessons: [
              { id: "lesson-1", title: "Getting Started - Family responsibilities", type: "Getting Started", order_index: 1 },
              { id: "lesson-u1l2", title: "Unit 1 Lesson 2: Speaking & Shadowing Practice", type: "Speaking", order_index: 2 },
              { id: "lesson-3", title: "Listening - Family value reflections", type: "Listening", order_index: 3 }
            ]
          },
          {
            id: "unit-2",
            title: "Unit 2: Humans and the Environment",
            description: "Con người và môi trường xung quanh.",
            order_index: 2,
            lessons: [
              { id: "lesson-4", title: "Getting Started - Eco-friendly lifestyle", type: "Getting Started", order_index: 1 },
              { id: "lesson-5", title: "Speaking - Environmental protection suggestions", type: "Speaking", order_index: 2 }
            ]
          }
        ]
      }
    ]
  };

  if (isMockMode) {
    return mockGrade;
  }

  const supabase = await createSupabaseServerClient();
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

  if (error || !grade) {
    console.error("Error fetching grade details, using fallback:", error);
    return mockGrade;
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
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const mockUnit = {
    id: unitId,
    title: "Unit 1: Family Life",
    description: "Đời sống gia đình và trách nhiệm của thành viên.",
    lessons: [
      {
        id: "lesson-u1l2",
        title: "Unit 1 Lesson 2: Speaking & Shadowing Practice",
        type: "Speaking",
        order_index: 1,
        activities: [
          { id: "act-1", title: "Luyện phát âm & Nghe chính tả", type: "dictation", order_index: 1 },
          { id: "act-2", title: "Luyện nói Shadowing", type: "shadowing", order_index: 2 }
        ]
      }
    ]
  };

  if (isMockMode) {
    return mockUnit;
  }

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

  if (error || !unit) {
    console.error("Error fetching unit details, using fallback:", error);
    return mockUnit;
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
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const mockLesson = {
    id: lessonId,
    title: "Unit 1 Lesson 2: Speaking & Shadowing Practice",
    type: "Speaking",
    unit: {
      id: "unit-1",
      title: "Unit 1: Family Life",
      grade: {
        id: "grade-10",
        title: "Lớp 10"
      }
    },
    activities: [
      {
        id: "act-1",
        title: "Luyện phát âm & Nghe chính tả",
        type: "dictation",
        instructions: "Nghe kỹ đoạn băng và điền lại các từ bạn nghe được bên dưới.",
        order_index: 1,
        content: {
          audioUrl: "", 
          transcript: "doing household chores helps children learn to take responsibility"
        }
      },
      {
        id: "act-2",
        title: "Luyện nói Shadowing",
        type: "shadowing",
        instructions: "Nhấn nút ghi âm và bắt chước phát âm cụm từ dưới đây với ngữ điệu tự nhiên nhất.",
        order_index: 2,
        content: {
          transcript: "doing household chores helps children learn to take responsibility"
        }
      },
      {
        id: "act-3",
        title: "Chọn đáp án đúng",
        type: "multiple_choice",
        instructions: "Chọn từ/cụm từ đúng nhất để hoàn thành câu.",
        order_index: 3,
        content: {
          questions: [
            {
              id: "q-1",
              question: "Children should participate in household tasks to _______ responsibility.",
              options: ["develop", "destroy", "neglect", "postpone"],
              answer: "develop"
            }
          ]
        }
      }
    ]
  };

  if (isMockMode) {
    return mockLesson;
  }

  try {
    const supabase = await createSupabaseServerClient();
    
    // 1. Fetch lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      console.error("Error fetching lesson:", lessonError);
      return mockLesson;
    }

    // 2. Fetch lesson sentences (which represent activities in the frontend model)
    const { data: sentences, error: sentencesError } = await supabase
      .from('lesson_sentences')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (sentencesError) {
      console.error("Error fetching lesson sentences:", sentencesError);
      return {
        ...lesson,
        activities: []
      };
    }

    // 3. Map sentences to frontend activities structure
    const activities = (sentences || []).map((sentence) => ({
      id: sentence.id,
      title: "Luyện nói",
      type: "shadowing",
      instructions: "Nhấn nút ghi âm và bắt chước phát âm cụm từ dưới đây với ngữ điệu tự nhiên nhất.",
      order_index: sentence.order_index,
      content: {
        transcript: sentence.transcript,
        translation: sentence.translation,
        thumbnailUrl: sentence.thumbnail_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
        audioUrl: sentence.audio_url || '',
      }
    }));

    return {
      ...lesson,
      activities
    };
  } catch (err) {
    console.error("Error inside getLessonWithDetails server action:", err);
    return mockLesson;
  }
}

// --- REAL-TIME DASHBOARD ANALYTICS ---

export async function getDashboardStats() {
  const supabase = await createSupabaseServerClient();
  
  try {
    // 1. Get counts
    const { count: storiesCount } = await supabase
      .from('stories')
      .select('id', { count: 'exact', head: true });
      
    const { count: lessonsCount } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true });
      
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });
      
    const { count: proUsersCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('plan', 'Pro');
      
    // 2. Fetch plays from stories
    const { data: playsData } = await supabase
      .from('stories')
      .select('plays');
    const totalPlays = playsData?.reduce((acc: number, curr: any) => acc + (curr.plays || 0), 0) || 0;

    // 3. Fetch latest 5 registered users
    const { data: latestUsers } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, created_at, role')
      .order('created_at', { ascending: false })
      .limit(5);

    // 4. Fetch top 5 popular stories
    const { data: popularStories } = await supabase
      .from('stories')
      .select('id, title, category, plays, difficulty')
      .order('plays', { ascending: false })
      .limit(5);

    return {
      success: true,
      stats: {
        totalStories: storiesCount || 0,
        totalLessons: lessonsCount || 0,
        totalUsers: usersCount || 0,
        totalProUsers: proUsersCount || 0,
        totalPlays,
      },
      latestUsers: latestUsers || [],
      popularStories: popularStories || [],
    };
  } catch (err: any) {
    console.error("Error fetching dashboard stats:", err);
    return {
      success: false,
      error: err.message || "Unknown error"
    };
  }
}

// --- STORY SCENES ACTIONS ---

export async function getStoryScenes(storyId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('story_scenes')
    .select('*')
    .eq('story_id', storyId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error("Error fetching story scenes:", error);
    return [];
  }
  return data || [];
}

export async function createStoryScene(data: { story_id: string, order_index: number, video_url: string, thumbnail_url?: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: scene, error } = await supabase
    .from('story_scenes')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating story scene:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data: scene };
}

export async function updateStoryScene(id: string, data: any) {
  const supabase = await createSupabaseServerClient();
  const { data: scene, error } = await supabase
    .from('story_scenes')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating story scene:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data: scene };
}

export async function deleteStoryScene(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('story_scenes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting story scene:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

// --- LESSON SENTENCE ACTIONS ---

export async function getLessonForStory(storyTitle: string) {
  const supabase = await createSupabaseServerClient();
  
  // Try to find a lesson with a matching title
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .ilike('title', `%${storyTitle}%`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error finding lesson for story:", error);
    return null;
  }
  return lesson;
}

export async function createLessonForStory(storyTitle: string, description: string) {
  const supabase = await createSupabaseServerClient();
  
  // Default values for speaking lessons
  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert([{
      title: `${storyTitle}: Luyện nói`,
      description: description || `Bài học luyện nói trích đoạn phim ${storyTitle}.`,
      type: 'Speaking',
      order_index: 1,
      is_published: true
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating lesson for story:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data: lesson };
}

export async function getLessonSentences(lessonId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('lesson_sentences')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error("Error fetching lesson sentences:", error);
    return [];
  }
  return data || [];
}

export async function createLessonSentence(data: { 
  lesson_id: string, 
  order_index: number, 
  transcript: string, 
  translation: string, 
  audio_url?: string, 
  thumbnail_url?: string,
  start_time?: number,
  end_time?: number,
  metadata?: any
}) {
  const supabase = await createSupabaseServerClient();
  const { data: sentence, error } = await supabase
    .from('lesson_sentences')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating lesson sentence:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data: sentence };
}

export async function updateLessonSentence(id: string, data: any) {
  const supabase = await createSupabaseServerClient();
  const { data: sentence, error } = await supabase
    .from('lesson_sentences')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating lesson sentence:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data: sentence };
}

export async function deleteLessonSentence(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('lesson_sentences')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting lesson sentence:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function updateLessonFields(id: string, data: any) {
  const supabase = await createSupabaseServerClient();
  const { data: lesson, error } = await supabase
    .from('lessons')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating lesson:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data: lesson };
}

export async function saveAIComposedStory(payload: {
  story: {
    title: string;
    synopsis: string;
    difficulty: string;
    thumbnail_url: string;
  };
  scene: {
    video_url: string;
    thumbnail_url: string;
  };
  lesson: {
    title: string;
    description: string;
  };
  sentences: Array<{
    transcript: string;
    translation_only: string;
    ipa: string;
    target_score: number;
    start_time: number;
    end_time: number;
    metadata: {
      pacing_type: string;
      speech_speed: string;
      emotion_type: string;
      pronunciation_difficulty: string;
      shadowing_priority: string;
      replay_priority: string;
      accent_type: string;
      dopamine_score: number;
      difficulty_score: number;
    };
  }>;
}) {
  const supabase = await createSupabaseServerClient();

  try {
    // Map difficulty standard matching CHECK constraint: 'easy', 'medium', 'hard'
    const rawDiff = (payload.story.difficulty || 'medium').toLowerCase();
    const cleanDifficulty = rawDiff === 'intermediate' ? 'medium' : 
                            (rawDiff === 'easy' || rawDiff === 'medium' || rawDiff === 'hard') ? rawDiff : 'medium';

    // 1. Insert Story (only actual columns existing in stories table)
    const { data: story, error: storyErr } = await supabase
      .from('stories')
      .insert([{
        title: payload.story.title,
        description: payload.story.synopsis || `Trải nghiệm học nói tiếng Anh điện ảnh với ${payload.story.title}.`,
        thumbnail_url: payload.story.thumbnail_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
        difficulty: cleanDifficulty,
        is_published: false
      }])
      .select()
      .single();

    if (storyErr) throw storyErr;

    // 2. Insert Scene
    const { data: scene, error: sceneErr } = await supabase
      .from('story_scenes')
      .insert([{
        story_id: story.id,
        order_index: 1,
        video_url: payload.scene.video_url || 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        thumbnail_url: payload.scene.thumbnail_url || story.thumbnail_url
      }])
      .select()
      .single();

    if (sceneErr) throw sceneErr;

    // 3. Insert Lesson (using standard 'Speaking' and status matching content_intelligence migration)
    const { data: lesson, error: lessonErr } = await supabase
      .from('lessons')
      .insert([{
        title: `${payload.story.title}: Luyện nói`, // Key link to connect story and lesson implicitly by title
        description: payload.lesson.description || `Bài học luyện nói từ trích đoạn phim ${payload.story.title}.`,
        type: 'Speaking', // CAPITAL 'S' matching schema CHECK constraint
        status: 'draft',
        is_published: false
      }])
      .select()
      .single();

    if (lessonErr) throw lessonErr;

    // 4. Insert Lesson Sentences
    const sentencesToInsert = payload.sentences.map((s, idx) => {
      const bundledTranslation = `${s.translation_only.trim()} [Phiên âm: ${s.ipa.trim()} | Phổ điểm đạt: ${s.target_score}]`;
      return {
        lesson_id: lesson.id,
        order_index: idx + 1,
        transcript: s.transcript,
        translation: bundledTranslation,
        start_time: s.start_time,
        end_time: s.end_time,
        thumbnail_url: story.thumbnail_url,
        metadata: s.metadata
      };
    });

    const { error: sentsErr } = await supabase
      .from('lesson_sentences')
      .insert(sentencesToInsert);

    if (sentsErr) throw sentsErr;

    // Revalidate Next.js cache paths
    revalidatePath('/admin/stories');
    revalidatePath('/stories');

    return { success: true, storyId: story.id };
  } catch (err: any) {
    console.error("Error saving AI Composed story:", err);
    return { success: false, error: err.message || "Unknown database error" };
  }
}


