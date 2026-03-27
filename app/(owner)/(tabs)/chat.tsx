/**
 * Owner Inquiries Tab
 * Communication hub for landlords to manage tenant and prospect messages.
 */

import ComingSoon from "@/components/ui/ComingSoon";
import React from "react";

export default function ChatTab() {
  return (
    <ComingSoon
      title="Inquiries"
      description="Respond to tenant inquiries, maintenance requests, and booking questions."
      icon="💬"
    />
  );
}
