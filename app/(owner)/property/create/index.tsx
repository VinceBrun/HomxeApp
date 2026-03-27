import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function PropertyCreate() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to step 1 immediately
    router.replace("/(owner)/property/create/step1");
  }, [router]);

  return null;
}
