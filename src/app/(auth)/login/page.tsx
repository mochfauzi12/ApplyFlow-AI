import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-bg-secondary p-8 shadow-md border border-border-light">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Or{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" action={login}>
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
                className="mt-1 block w-full appearance-none rounded-md border border-border-light px-3 py-2 placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-bg-secondary text-text-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
