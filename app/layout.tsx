import './globals.css';

export const metadata = {
  title: 'Ethicia',
  description: 'Ethicia Application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans bg-black min-h-screen">
        {children}
      </body>
    </html>
  );
} 