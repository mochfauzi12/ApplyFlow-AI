import { getProfile, updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Candidate Profile</h1>
        <p className="text-text-secondary mt-1">Manage your professional information and preferences.</p>
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
    </div>
  )
}
