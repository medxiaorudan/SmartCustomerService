import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 flex items-center justify-center min-h-screen">
        {children}
      </body>
    </html>
  );
}
