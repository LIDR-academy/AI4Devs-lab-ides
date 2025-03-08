import React from "react"
import Footer from "./Footer"
import Header from "./Header"

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 p-4">
        <div className="container mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
