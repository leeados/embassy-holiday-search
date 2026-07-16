import ScanApp from "@/components/ScanApp";
import { THAI_MISSIONS } from "@/lib/thai-missions";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <ScanApp missions={THAI_MISSIONS} />
    </div>
  );
}
