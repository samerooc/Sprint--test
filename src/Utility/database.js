import { supabase } from '../config/supabase'

// ===== USERS =====

export const createUser = async (email, name, role = 'student', phone = null) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name, role, phone }])
      .select()
    
    if (error) throw error
    console.log('✅ User created:', data[0].id)
    return data[0]
  } catch (error) {
    console.error('❌ Create user failed:', error.message)
    throw error
  }
}

export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('❌ Get user failed:', error.message)
    return null
  }
}

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('❌ Get users failed:', error.message)
    throw error
  }
}

// ===== TESTS =====

export const createTest = async (testData, createdBy) => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .insert([{
        title: testData.testTitle,
        duration: testData.duration,
        questions: testData.questions,
        created_by: createdBy
      }])
      .select()
    
    if (error) throw error
    console.log('✅ Test created:', data[0].id)
    return data[0]
  } catch (error) {
    console.error('❌ Create test failed:', error.message)
    throw error
  }
}

export const getAllTests = async () => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('❌ Get tests failed:', error.message)
    throw error
  }
}

export const getTestById = async (testId) => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('❌ Get test failed:', error.message)
    throw error
  }
}

// ===== RESULTS =====

export const submitResult = async (userId, testId, score, totalMarks, answers) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .insert([{
        user_id: userId,
        test_id: testId,
        score,
        total_marks: totalMarks,
        answers
      }])
      .select()
    
    if (error) throw error
    console.log('✅ Result submitted')
    return data[0]
  } catch (error) {
    console.error('❌ Submit failed:', error.message)
    throw error
  }
}

export const getUserResults = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('❌ Get results failed:', error.message)
    throw error
  }
}

export const getAllResults = async () => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('submitted_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('❌ Get all results failed:', error.message)
    throw error
  }
}