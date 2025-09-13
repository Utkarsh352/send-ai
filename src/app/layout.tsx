import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClientOnlyWeb3Provider } from "@/providers/client-only-web3";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Send-AI",
	description: "Maps for Cross-Chain Transactions powered by Yellow Network & AI",
	icons: {
		icon: [
			{ rel: "icon", url: "/yellow_logo.svg", type: "image/svg+xml" },
		]
	}
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`antialiased tracking-tight ${inter.className}`}>
				<ThemeProvider attribute="class" defaultTheme="dark">
					<ClientOnlyWeb3Provider>
						{children}
						<Toaster />
					</ClientOnlyWeb3Provider>
				</ThemeProvider>
			</body>
		</html>
	);
}
