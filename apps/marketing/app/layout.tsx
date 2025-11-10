import "./output.css"
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper" // Uncomment this line
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Inter, Poppins } from 'next/font/google'
// import { ThemeProvider } from "next-themes" // Import ThemeProvider directly

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-heading' })

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: "GroupFlow - Home",
  description: "Home pages"
}


export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <ThemeProviderWrapper> {/* Uncomment this line */}
          <Navbar />
          {children && <main>{children}</main>}
          <Footer />
        </ThemeProviderWrapper> {/* Uncomment this line */}
      </body>
    </html>
  )
}
