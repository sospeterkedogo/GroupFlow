import "./globals.css"
import ThemeProviderWrapper from "../components/ThemeProviderWrapper" 
import { UserProvider } from "./context/userContext"
import { NetworkProvider } from "@/components/NetworkProvider"
import { Inter, Poppins } from 'next/font/google'
import { SessionProvider } from "../app/context/SessionContext"
import { NotificationsProvider } from "./context/notificationsContext"


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-heading' })

export const metadata = {
  title: "GroupFlow",
  description: "Landing and app pages"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <NetworkProvider>
          <ThemeProviderWrapper> {/* Uncomment this line */}
            <UserProvider>
              <SessionProvider>
                <NotificationsProvider>
                  {children}
                </NotificationsProvider>
              </SessionProvider>
            </UserProvider>
          </ThemeProviderWrapper> {/* Uncomment this line */}
        </NetworkProvider>
      </body>
    </html>
  )
}
