import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-12 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-medium">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md space-y-8 rounded-xl bg-bg-secondary p-8 shadow-md border border-border-light z-10">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" action={signup}>
          {error && (
            <div className="rounded-md bg-error/10 p-4">
              <div className="flex">
                <div className="ml-3 text-sm text-error">
                  {error}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-text-primary">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-border-light px-3 py-2 placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-bg-secondary text-text-primary"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-border-light px-3 py-2 placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-bg-secondary text-text-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full appearance-none rounded-md border border-border-light px-3 py-2 placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-bg-secondary text-text-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
