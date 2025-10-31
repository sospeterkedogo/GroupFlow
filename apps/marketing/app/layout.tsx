import "./output.css"
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Inter, Poppins } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
export const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-heading' })


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
        <ThemeProviderWrapper>
          <Navbar />
          {children}
          <Footer />
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
