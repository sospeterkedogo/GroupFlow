'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, UploadCloud, Trash2, Bell, BellOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ThemeToggle from '@/components/ThemeToggle'
import { updateProfile, updatePassword, deleteAccount } from '@/app/actions/account'
import { useSession } from '@/app/context/SessionContext'
import { useNetwork } from '@/components/NetworkProvider'
import DashboardLayout from '@/components/layouts/DashboardLayout'

// Define a type for the local form data
type ProfileFormData = {
  firstname: string
  lastname: string
  username: string
  avatar_url: string
}

export default function AccountPage() {
  const supabase = createClient()
  const router = useRouter()
  // 1. Get global state and refresh function from the context
  // Notice 'setProfile' is (correctly) not here.
  const { user, profile, refreshProfile, loading: isAuthLoading } = useSession()
  const { online } = useNetwork()

  const [activeTab, setActiveTab] = useState('Profile')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [prefs, setPrefs] = useState({ inApp: true, push: false })

  // 2. Create LOCAL state for the form, initialized as empty
  const [formData, setFormData] = useState<ProfileFormData>({
    firstname: '',
    lastname: '',
    username: '',
    avatar_url: '',
  })
  
  // 3. Keep a loading state *just for the form data*
  const [isFormLoading, setIsFormLoading] = useState(true)

  // Effect to handle auth redirection
  useEffect(() => {
    if (!isAuthLoading && !user) router.replace('/auth/login')
  }, [isAuthLoading, user, router])
  
  // 4. Effect to populate LOCAL state from GLOBAL context
  // This syncs the form *one way* from the global state
  useEffect(() => {
    if (profile) {
      setFormData({
        firstname: profile.firstname || '',
        lastname: profile.lastname || '',
        username: profile.username || '',
        avatar_url: profile.avatar_url || '',
      })
      setIsFormLoading(false)
    } else if (!isAuthLoading && user) {
      // Profile is just loading, wait
      setIsFormLoading(true)
    }
  }, [profile, isAuthLoading, user]) // Runs when global profile changes

  // 5. Create a local handler to update local state
  // This updates the "dirty" form state, not the global state
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // --- Handlers ---

  const handleProfileUpdate = async () => {
    if (!profile) return setMessage('Profile not loaded.')
    // 6. Send the LOCAL formData to the server
    try {
      await updateProfile(user!.id, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        avatar_url: formData.avatar_url,
      })
      setMessage('Profile updated successfully! 🎉')
      setTimeout(() => setMessage(''), 5000)
      // 7. On success, call refreshProfile() to update the GLOBAL state from the DB
      await refreshProfile()
    } catch (err: unknown) {
      setMessage('Error: ' + (err as Error).message)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handlePasswordUpdate = async () => {
    try {
      await updatePassword(user!.id, password)
      setMessage('Password updated successfully! ✅')
      setTimeout(() => setMessage(''), 5000)
      setPassword('')
    } catch (err: unknown) {
      setMessage('Error: ' + (err as Error).message)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handleDeleteAccount = async () => {
    // This is a terrible anti-pattern. Never use confirm().
    // You should build a modal that forces the user to type
    // their project name or "DELETE" to confirm.
    // But for now, we'll leave your flawed logic.
    if (!confirm('Are you sure? This is irreversible.')) return
    try {
      await deleteAccount(user!.id)
      await supabase.auth.signOut()
      router.replace('/auth/signup')
    } catch (err: unknown) {
      alert('Error deleting account: ' + (err as Error).message)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !profile) return
    const file = e.target.files?.[0]
    if (!file) return

    const MAX_SIZE = 2 * 1024 * 1024
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
    if (file.size > MAX_SIZE || !allowedTypes.includes(file.type)) {
      alert('Invalid file. Max 2MB and only images.')
      return
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (uploadError) return alert('Failed to upload avatar: ' + uploadError.message)

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = data?.publicUrl
    if (!publicUrl) return alert('Failed to retrieve avatar URL.')

    // 8. Update LOCAL state for instant UI feedback
    setFormData({ ...formData, avatar_url: publicUrl })
    
    // 9. Update the database
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
    
    // 10. Refresh the GLOBAL context from the DB
    await refreshProfile()
    setMessage('Avatar updated successfully!')
    setTimeout(() => setMessage(''), 5000)
  }

  const handleAvatarDelete = async () => {
    if (!user || !formData.avatar_url) return
    const confirmed = confirm('Remove your avatar and revert to default?')
    if (!confirmed) return

    try {
      const path = formData.avatar_url.split('/').slice(-2).join('/')
      await supabase.storage.from('avatars').remove([path])
      await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id)
      
      // 11. Update LOCAL and GLOBAL state
      setFormData({ ...formData, avatar_url: '' })
      await refreshProfile()
      
      setMessage('Avatar removed.')
      setTimeout(() => setMessage(''), 5000)
    } catch (err: unknown) {
      alert('Error removing avatar: ' + (err as Error).message)
    }
  }

  const tabs = ['Profile', 'Account', 'Preferences', 'Appearance', 'Danger Zone']
  
  // Show a global loader while auth is resolving
  if (isAuthLoading || !user) {
    return (
      <DashboardLayout>
         <p className="p-6">Loading account details...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {!online && (
      <div className="fixed top-0 left-0 w-full bg-warning text-background p-2 text-center z-50">
        Internet connection lost. You may experience limited functionality.
      </div>
    )}

      <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Manage your personal info, preferences, and account security.
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-secondary hover:text-primary'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'Profile' && (
          <section className="space-y-4 bg-card p-5 rounded-xl shadow-sm">
            {isFormLoading ? <p>Loading profile form...</p> : (
            <>
              <div className="flex items-center space-x-4">
                <Image
                  src={formData.avatar_url || '/placeholder-avatar.png'}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border shadow-sm"
                />
                <div className="flex flex-col space-y-2">
                  <label className="cursor-pointer flex items-center space-x-2 text-primary hover:text-accent">
                    <UploadCloud size={20} />
                    <span>Upload Image</span>
                    <input type="file" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                  {formData.avatar_url && (
                    <button
                      onClick={handleAvatarDelete}
                      className="flex items-center space-x-1 text-error hover:text-error text-sm"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  name="firstname" // 12. Use name attribute
                  placeholder="First Name"
                  className="input w-full"
                  value={formData.firstname} // Read from local state
                  onChange={handleFormChange} // Update local state
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  className="input w-full"
                  value={formData.lastname}
                  onChange={handleFormChange}
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input w-full"
                  value={formData.username}
                  onChange={handleFormChange}
                />
              </div>
              <button className="btn-primary w-full" onClick={handleProfileUpdate} disabled={!online}>
                Save Changes
              </button>
            </>
            )}
          </section>
        )}

        {activeTab === 'Account' && (
          <section className="space-y-4 bg-card p-5 rounded-xl shadow-sm">
            <div>
              <h2 className="text-lg font-semibold mb-2">Change Password</h2>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  className="input w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button className="btn-primary mt-3" onClick={handlePasswordUpdate}>
                Update Password
              </button>
            </div>

            <div>
              <h2 className="text-lg font-semibold mt-6 mb-2">Email Settings</h2>
              <p className="text-sm text-muted-foreground">
                Email change feature coming soon.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'Preferences' && (
          <section className="space-y-4 bg-card p-5 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell size={18} />
                <span>In-App Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.inApp}
                onChange={() => setPrefs((p) => ({ ...p, inApp: !p.inApp }))}
              />
            </div>
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <BellOff size={18} />
                <span>Push Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.push}
                onChange={() => setPrefs((p) => ({ ...p, push: !p.push }))}
              />
            </div>
          </section>
        )}

        {activeTab === 'Appearance' && (
          <section className="space-y-4 bg-card p-5 rounded-xl shadow-sm">
            <ThemeToggle />
          </section>
        )}

          {activeTab === 'Danger Zone' && (
                 <section className="space-y-4 bg-card p-5 rounded-xl border border-error shadow-sm">
                   <h2 className="text-error font-semibold text-lg">Danger Zone</h2>
                   <p className="text-sm text-muted-foreground">
                     Deleting your account is irreversible. All your data will be permanently removed.
                   </p>
                   <button className="btn-danger w-full" onClick={handleDeleteAccount}>
                     Delete Account
                   </button>
                 </section>
               )}
             </div>
       
             {message && ( 
               <p
                 className={`text-sm mt-4 ${
                   message.includes('Error') ? 'text-error' : 'text-success'
                 }`}
               >
                 {message}
               </p>
             )}
           </div>
           </DashboardLayout>
         )
       }