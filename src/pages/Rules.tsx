// src/pages/Rules.tsx
import React from "react";

export default function Rules() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-white dark:from-gray-900">
      <div className="max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 shadow">
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "Panton, sans-serif" }}>
          Game Rules
        </h1>

        <ol className="list-decimal pl-6 space-y-2 text-lg" style={{ lineHeight: 1.5 }}>
          <li>Describe the word on the card without saying the word itself.</li>
          <li>You may not spell the word, act, or point to objects.</li>
          <li>If the card has forbidden words, you cannot use those words in your clue.</li>
          <li>If you break a rule, the card is skipped and no point is scored.</li>
          <li>Players cannot use English words to describe a vernacular word, or vernacular words to describe an English word.</li>
          <li>Teammates must guess only the exact word written on the card.</li>
          <li>You have 30 seconds per round to get as many correct as possible.</li>
          <li>Skipping a card is allowed, but no points are scored for skipped cards.</li>
          <li>The team with the most correct guesses after the set rounds wins.</li>
        </ol>

        <p className="mt-6 text-sm text-muted-foreground">
          These rules are a mix of classic party-game mechanics. Adjust house rules as you like.
        </p>
      </div>
    </div>
  );
}
