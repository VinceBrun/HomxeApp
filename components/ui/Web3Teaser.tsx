import React, { useState } from "react";
import Web3TeaserCard from "./Web3Teaser/Web3TeaserCard";
import Web3InfoModal from "./Web3Teaser/Web3InfoModal";

export default function Web3Teaser() {
  const [showModal, setShowModal] = useState(false);

  const handleJoinWaitlist = () => {
    setShowModal(false);
    // TODO: Implement waitlist logic
    console.log("User joined waitlist");
  };

  return (
    <>
      <Web3TeaserCard
        onLearnMore={() => setShowModal(true)}
        onGetNotified={() => setShowModal(true)}
      />
      
      {showModal && (
        <Web3InfoModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onJoinWaitlist={handleJoinWaitlist}
        />
      )}
    </>
  );
}
