import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import TenantDashboard from '@/components/dashboard/TenantDashboard'
import LandlordDashboard from '@/components/dashboard/LandlordDashboard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const role = session.user?.role

  if (role === 'TENANT') {
    return <TenantDashboard />
  } else if (role === 'LANDLORD') {
    return <LandlordDashboard />
  }

  return <div>Неизвестная роль пользователя</div>
}
