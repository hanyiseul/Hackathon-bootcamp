import Providers from "./providers";
import "./style.css";

export const metadata = { title: "PTTime | PT 예약 관리 시스템" };

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
