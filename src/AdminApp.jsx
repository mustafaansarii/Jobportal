import * as React from 'react';
import { supabase } from './supabaseClient';
import supabaseDataProvider from './supabaseDataProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { AuthProvider } from 'react-admin'; // No AuthProvider export
// import { LoginPage } from 'react-admin'; // Use Login component

// Create auth provider
const authProvider = {
  login: async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return Promise.resolve();
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return Promise.resolve();
  },
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? Promise.resolve() : Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
};

// Create custom login page
const MyLoginPage = () => (
  <Login
    backgroundImage="https://source.unsplash.com/random/1600x900/daily?technology"
  />
);

// Job List Component
const JobList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="role" />
      <TextField source="company" />
      <TextInput source="company_url" />
      <DateField source="created_at" showTime />
      <TextField source="heading" />
    </Datagrid>
  </List>
);

// Job Edit Component
const JobEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="role" />
      <TextInput source="company" />
      <TextInput source="company_url" />
      <TextInput source="desc" multiline fullWidth />
      <TextInput source="heading" />
      <TextInput source="applylink" />
    </SimpleForm>
  </Edit>
);

// Job Create Component
const JobCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="role" />
      <TextInput source="company" />
      <TextInput source="company_url" />
      <TextInput source="desc" multiline fullWidth />
      <TextInput source="heading" />
      <TextInput source="applylink" />
    </SimpleForm>
  </Create>
);

const AdminApp = () => {
  const [dataProvider, setDataProvider] = React.useState(null);
  const [authChecked, setAuthChecked] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          navigate('/login');
        } else {
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  React.useEffect(() => {
    const initDataProvider = async () => {
      const dp = await supabaseDataProvider;
      setDataProvider(() => dp);
    };
    
    if (authChecked) {
      initDataProvider();
    }
  }, [authChecked]);

  if (!authChecked || !dataProvider) {
    return <div className="flex justify-center items-center h-screen">Loading admin panel...</div>;
  }

  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={MyLoginPage}
      requireAuth
    >
      <Resource name="jobs" list={JobList} edit={JobEdit} create={JobCreate} />
    </Admin>
  );
};

export default AdminApp;