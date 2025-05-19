// supabaseDataProvider.js
import { supabase } from './supabaseClient';

const supabaseDataProvider = {
  getList: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .select('*');

    if (error) throw new Error(error.message);

    return {
      data,
      total: data.length,
    };
  },

  getOne: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw new Error(error.message);

    return { data };
  },

  create: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .insert([params.data])
      .select();

    if (error) throw new Error(error.message);
    
    if (!data || data.length === 0) {
      throw new Error('Failed to create resource: no data returned');
    }
    
    return { data: data[0] };
  },

  update: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .update(params.data)
      .eq('id', params.id)
      .select();

    if (error) throw new Error(error.message);
    
    if (!data || data.length === 0) {
      throw new Error('No data returned from update');
    }
    
    return { data: data[0] };
  },

  delete: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .delete()
      .eq('id', params.id);

    if (error) throw new Error(error.message);
    return { data };
  },

  // add more methods as needed: getMany, create, update, delete, etc.
};

export default supabaseDataProvider;
