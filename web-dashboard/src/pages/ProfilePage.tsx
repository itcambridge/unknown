import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface VolunteerProfile {
  id: string;
  nickname: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  last_login_at: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [volunteer, setVolunteer] = useState<VolunteerProfile | null>(null);
  const [formData, setFormData] = useState({
    nickname: '',
    phone: ''
  });
  const [message, setMessage] = useState({type: '', text: ''});
  
  useEffect(() => {
    // Fetch volunteer data with retry capability
    const fetchVolunteer = async (retryCount = 0) => {
      try {
        setLoading(true);
        
        if (!user) {
          setMessage({type: 'error', text: 'No authenticated user found.'});
          setLoading(false);
          return;
        }
        
        console.log(`Fetching volunteer profile, attempt: ${retryCount + 1}`);
        
        // Explicitly type the response data
        const { data, error } = await supabase
          .from('volunteers')
          .select('*')
          .eq('id', user.id)
          .single<VolunteerProfile>();
        
        if (error) {
          console.error(`Error fetching volunteer profile (attempt ${retryCount + 1}):`, error);
          
          // If we haven't retried too many times, try again after a delay
          if (retryCount < 2) {
            console.log(`Retrying fetch, attempt ${retryCount + 2}...`);
            // Wait longer between each retry
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return fetchVolunteer(retryCount + 1);
          }
          
          setMessage({type: 'error', text: 'Failed to load profile data. You may need to create a volunteer record first.'});
        } else if (data) {
          console.log('Successfully fetched volunteer profile:', data);
          setVolunteer(data);
          setFormData({
            nickname: data.nickname || '',
            phone: data.phone || ''
          });
        }
      } catch (error) {
        console.error('Exception fetching profile:', error);
        setMessage({type: 'error', text: 'An unexpected error occurred.'});
      } finally {
        setLoading(false);
      }
    };
    
    fetchVolunteer();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({type: 'error', text: 'No authenticated user found.'});
      return;
    }
    
    try {
      setSaving(true);
      
      // Simplify the update operation without generic type
      // Cast to any to avoid TypeScript issues with the update operation
      const { error } = await supabase
        .from('volunteers')
        .update({
          nickname: formData.nickname,
          phone: formData.phone
        } as any)
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        setMessage({type: 'error', text: 'Failed to update profile.'});
      } else {
        setMessage({type: 'success', text: 'Profile updated successfully!'});
        
        // Update the volunteer state with the new data
        setVolunteer(prev => prev ? {
          ...prev,
          nickname: formData.nickname,
          phone: formData.phone
        } : null);
      }
    } catch (error) {
      console.error('Exception updating profile:', error);
      setMessage({type: 'error', text: 'An unexpected error occurred.'});
    } finally {
      setSaving(false);
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage({type: '', text: ''});
      }, 5000);
    }
  };
  
  return (
    <div className="p-6">
      <div className="text-xs font-mono text-gray-400 p-4 border-b border-slate-800 bg-slate-900/50 mb-6">
        DASHBOARD / OPERATOR PROFILE
      </div>
      
      <div className="glass-panel">
        <h1 className="text-neon-cyan font-orbitron text-xl mb-6">OPERATOR PROFILE</h1>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded ${
            message.type === 'error' ? 'bg-danger/20 border border-danger' : 
            message.type === 'success' ? 'bg-electric-lime/10 border border-electric-lime' : ''
          }`}>
            <p className={`${
              message.type === 'error' ? 'text-danger' : 
              message.type === 'success' ? 'text-electric-lime' : 'text-gray-400'
            }`}>
              {message.text}
            </p>
          </div>
        )}
        
        {loading ? (
          <div className="text-neon-cyan animate-pulse text-center p-10">Loading profile data...</div>
        ) : volunteer ? (
          <>
            <div className="mb-6 p-4 bg-slate-900/70 rounded-md">
              <h2 className="text-neon-magenta font-orbitron text-lg mb-4">OPERATOR STATUS</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <div className="text-xs text-gray-400 mb-1">OPERATOR ID</div>
                  <div className="text-neon-cyan font-mono truncate">{volunteer.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">ACCESS LEVEL</div>
                  <div className="text-neon-cyan font-mono uppercase">{volunteer.role}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">JOINED</div>
                  <div className="text-neon-cyan font-mono">
                    {new Date(volunteer.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">STATUS</div>
                  <div className={`font-mono uppercase ${
                    volunteer.status === 'active' ? 'text-electric-lime' : 'text-gray-400'
                  }`}>
                    {volunteer.status}
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="mb-6">
              <h2 className="text-neon-magenta font-orbitron text-lg mb-4">EDIT PROFILE</h2>
              
              <div className="mb-4">
                <label htmlFor="nickname" className="block text-gray-400 text-xs mb-1">DISPLAY NAME</label>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 text-gray-200 p-3 rounded-md focus:outline-none focus:border-neon-cyan"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-400 text-xs mb-1">CONTACT NUMBER</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 text-gray-200 p-3 rounded-md focus:outline-none focus:border-neon-cyan"
                />
              </div>
              
              <button 
                type="submit" 
                className="neon-button w-full"
                disabled={saving}
              >
                {saving ? 'UPDATING...' : 'UPDATE PROFILE'}
              </button>
            </form>
          </>
        ) : (
          <div className="p-4 border border-danger rounded-md bg-danger/10 text-danger mb-6">
            <h3 className="text-lg font-orbitron mb-2">No Volunteer Record Found</h3>
            <p className="mb-4">Your auth account is not linked to a volunteer profile. This can happen if:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>You're a new user who hasn't been assigned a volunteer role</li>
              <li>Your volunteer record hasn't been created in the database</li>
            </ul>
            <p className="mb-4">To fix this, an admin can create a volunteer record for your user ID, or you can create one yourself using the button below:</p>
            
            {user && (
              <div className="mt-4">
                <div className="p-3 bg-slate-900 rounded-md mb-4">
                  <p className="text-xs text-gray-400 mb-1">Your User ID:</p>
                  <code className="block p-2 bg-slate-800 rounded text-neon-cyan overflow-auto text-sm">
                    {user.id}
                  </code>
                  <p className="text-xs text-gray-400 mt-2">Admin can use this SQL in Supabase:</p>
                  <code className="block p-2 bg-slate-800 rounded text-neon-cyan overflow-auto text-xs">
                    {`INSERT INTO volunteers (id, nickname, role, status) VALUES ('${user.id}', '${user.email?.split('@')[0] || 'New Operator'}', 'admin', 'active');`}
                  </code>
                </div>
                
                <button 
                  onClick={async () => {
                    try {
                      setSaving(true);
                      const nickname = user.email?.split('@')[0] || 'New Operator';
                      
                      // Cast to any to avoid TypeScript issues with the insert operation
                      const { error } = await supabase
                        .from('volunteers')
                        .insert({
                          id: user.id,
                          nickname,
                          role: 'admin',
                          status: 'active'
                        } as any);
                      
                      if (error) {
                        console.error('Error creating volunteer profile:', error);
                        setMessage({type: 'error', text: `Failed to create profile: ${error.message}`});
                      } else {
                        setMessage({type: 'success', text: 'Profile created successfully!'});
                        
                        // Instead of reloading the page, fetch the volunteer data directly
                        // This avoids potential timing issues with page reloads
                        const fetchNewProfile = async () => {
                          try {
                            // Wait a moment to ensure the data is available
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            console.log('Fetching newly created profile...');
                            const { data: newProfile, error: fetchError } = await supabase
                              .from('volunteers')
                              .select('*')
                              .eq('id', user.id)
                              .single<VolunteerProfile>();
                              
                            if (fetchError) {
                              console.error('Error fetching new profile:', fetchError);
                              // Don't show an error to the user yet, we'll retry
                            } else if (newProfile) {
                              console.log('Successfully fetched new profile:', newProfile);
                              setVolunteer(newProfile);
                              setFormData({
                                nickname: newProfile.nickname || '',
                                phone: newProfile.phone || ''
                              });
                              setLoading(false);
                              return; // Success, we're done
                            }
                            
                            // If we got here, we need to try again
                            console.log('Retrying profile fetch...');
                            // Wait longer and try once more
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            
                            const { data: retryProfile, error: retryError } = await supabase
                              .from('volunteers')
                              .select('*')
                              .eq('id', user.id)
                              .single<VolunteerProfile>();
                              
                            if (retryError) {
                              console.error('Error on retry fetch:', retryError);
                              // If still failing, reload the page as a last resort
                              window.location.reload();
                            } else if (retryProfile) {
                              console.log('Successfully fetched profile on retry:', retryProfile);
                              setVolunteer(retryProfile);
                              setFormData({
                                nickname: retryProfile.nickname || '',
                                phone: retryProfile.phone || ''
                              });
                              setLoading(false);
                            }
                          } catch (fetchErr) {
                            console.error('Exception during profile fetch:', fetchErr);
                            // Last resort - reload the page
                            window.location.reload();
                          }
                        };
                        
                        fetchNewProfile();
                      }
                    } catch (error) {
                      console.error('Exception creating profile:', error);
                      setMessage({type: 'error', text: 'An unexpected error occurred.'});
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="neon-button w-full"
                  disabled={saving}
                >
                  {saving ? 'CREATING PROFILE...' : 'CREATE VOLUNTEER PROFILE'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
