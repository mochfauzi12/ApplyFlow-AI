import { getProfile, updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const profile = await getProfile()

  let filledFields = 0;
  const totalFields = 6;
  
  if (profile?.full_name) filledFields++;
  if (profile?.job_title) filledFields++;
  if (profile?.years_experience !== null && profile?.years_experience !== undefined) filledFields++;
  if (profile?.expected_salary) filledFields++;
  if (profile?.professional_summary) filledFields++;
  if (profile?.profile_data_json && Object.keys(profile.profile_data_json).length > 0) filledFields++;

  const completenessPercentage = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Candidate Profile</h1>
        <p className="text-text-secondary mt-1">Manage your professional information and preferences.</p>
      </div>

      <div className="bg-bg-secondary border border-border-light rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-sm font-medium text-text-primary uppercase tracking-wider">Profile Completeness</h2>
          <span className="text-sm font-bold text-primary">{completenessPercentage}%</span>
        </div>
        <div className="w-full bg-border-light rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${completenessPercentage}%` }}></div>
        </div>
        {completenessPercentage < 100 && (
          <p className="text-xs text-text-secondary mt-3">
            Upload more Data Sources to achieve 100% and help AI fill recruiter forms more accurately!
          </p>
        )}
      </div>

      <div className="bg-bg-secondary border border-border-light rounded-xl p-6 shadow-sm">
        <form action={async (formData) => {
          "use server"
          await updateProfile(formData)
        }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-medium text-text-primary">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={profile?.full_name || ''}
                className="w-full rounded-md border border-border-light px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="job_title" className="text-sm font-medium text-text-primary">Current Job Title</label>
              <input
                id="job_title"
                name="job_title"
                type="text"
                defaultValue={profile?.job_title || ''}
                className="w-full rounded-md border border-border-light px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="years_experience" className="text-sm font-medium text-text-primary">Years of Experience</label>
              <input
                id="years_experience"
                name="years_experience"
                type="number"
                min="0"
                defaultValue={profile?.years_experience || ''}
                className="w-full rounded-md border border-border-light px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="expected_salary" className="text-sm font-medium text-text-primary">Expected Salary</label>
              <input
                id="expected_salary"
                name="expected_salary"
                type="text"
                defaultValue={profile?.expected_salary || ''}
                placeholder="e.g. Rp 15.000.000 - Rp 20.000.000"
                className="w-full rounded-md border border-border-light px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="professional_summary" className="text-sm font-medium text-text-primary">Professional Summary</label>
            <textarea
              id="professional_summary"
              name="professional_summary"
              rows={4}
              defaultValue={profile?.professional_summary || ''}
              className="w-full rounded-md border border-border-light px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border-light">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>

      {/* Candidate Memory Display */}
      {profile?.profile_data_json && Object.keys(profile.profile_data_json).length > 0 && (
        <div className="bg-bg-secondary border border-border-light rounded-xl p-6 shadow-sm mt-8">
          <h2 className="text-xl font-bold tracking-tight text-text-primary mb-2">Candidate Memory (Knowledge Base)</h2>
          <p className="text-text-secondary text-sm mb-6">Data below was automatically extracted from your uploaded Data Sources and will be used by AI to answer new recruiter forms.</p>
          <div className="bg-bg-tertiary rounded-lg p-4 border border-border-light overflow-auto max-h-[400px]">
            <pre className="text-sm text-text-primary whitespace-pre-wrap">
              {JSON.stringify(profile.profile_data_json, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
