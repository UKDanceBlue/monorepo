import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import dbWatermark from "../../public/db-watermark.svg";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DB Admin Portal",
  description: "DanceBlue's Internal Admin Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 w-full bg-sky-700/95">
          <div className="flex items-center justify-start p-2 mx-auto text-gray-800">
            {/* Move the logo all the way left */}
            <a href="/">
              <Image
                src={dbWatermark}
                alt="App Portal Home"
                width={60}
                height={60}
              />
            </a>
            <a href="/events">Events</a>
          </div>
        </nav>
        <div className="block pt-10 pb-6 mx-auto max-w-full">{children}</div>
      </body>
    </html>
  );
}
