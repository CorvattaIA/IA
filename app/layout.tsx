import './globals.css';

export const metadata = {
  title: 'Ethicia',
  description: 'Ethicia Application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="/_next/static/css/app.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 