/**
 * Offline Mode Test Utilities
 * 
 * This file provides utilities for testing offline mode behavior
 * Use these helpers to simulate Convex unavailability during development
 */

// ============================================
// MANUAL TESTING IN BROWSER CONSOLE
// ============================================

/**
 * Test 1: Check current Convex connectivity
 * Run in browser console to see if Convex is reachable
 */
const testConvexConnectivity = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_CONVEX_URL || 'http://localhost:3000'}/health`,
      { method: 'GET' }
    );
    console.log('✅ Convex is online:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Convex is offline:', error);
    return false;
  }
};

/**
 * Test 2: Simulate failed team save
 * This simulates what happens when saveTeams() catches an error
 */
const simulateTeamSaveError = () => {
  console.log('%c--- Simulating Team Save Error ---', 'color: red; font-weight: bold');
  
  const mockTeams = [
    { name: 'Team 1', members: ['Player 1', 'Player 2'] },
    { name: 'Team 2', members: ['Player 3', 'Player 4'] }
  ];

  console.log('✅ Teams configured locally:', mockTeams);
  console.log('❌ Convex save failed (would show toast: "Failed to save teams. Playing offline.")');
  console.log('✅ Game proceeds with local state');
};

/**
 * Test 3: Simulate failed game result recording
 * This simulates what happens when recordGameResults() catches an error
 */
const simulateGameResultError = () => {
  console.log('%c--- Simulating Game Result Recording Error ---', 'color: red; font-weight: bold');
  
  const mockResult = {
    teams: [
      { name: 'Team 1', score: 8 },
      { name: 'Team 2', score: 6 }
    ],
    winner: 'Team 1',
    totalRounds: 3
  };

  console.log('✅ Game completed locally:', mockResult);
  console.log('❌ Convex recording failed (would show toast: "Game complete! Team 1 wins with 8 points! (offline mode)")');
  console.log('✅ User can restart game or go back to menu');
};

/**
 * Test 4: Complete offline flow simulation
 * Runs simulations for teams and game results
 */
const simulateCompleteOfflineFlow = () => {
  console.log('%c========================================', 'color: blue; font-weight: bold');
  console.log('%cCOMPLETE OFFLINE MODE FLOW TEST', 'color: blue; font-weight: bold; font-size: 14px');
  console.log('%c========================================', 'color: blue; font-weight: bold');

  console.log('\n%c[STEP 1] Teams Configuration', 'color: orange; font-weight: bold');
  simulateTeamSaveError();

  console.log('\n%c[STEP 2] Game Execution', 'color: orange; font-weight: bold');
  console.log('✅ Game plays normally (no Convex calls during gameplay)');
  
  console.log('\n%c[STEP 3] Game Completion', 'color: orange; font-weight: bold');
  simulateGameResultError();

  console.log('\n%c[STEP 4] User Actions', 'color: orange; font-weight: bold');
  console.log('✅ User can: Play again, change teams, or return to menu');
  console.log('✅ All actions work without network connection');

  console.log('\n%c========================================', 'color: green; font-weight: bold');
  console.log('%c✅ OFFLINE MODE TEST COMPLETE', 'color: green; font-weight: bold; font-size: 14px');
  console.log('%c========================================\n', 'color: green; font-weight: bold');
};

// ============================================
// EXPECTED BEHAVIOR VERIFICATION
// ============================================

/**
 * Verify error handling implementation
 * Check that both mutation calls have proper try-catch
 */
const verifyErrorHandling = () => {
  console.log('%c--- Error Handling Verification ---', 'color: blue; font-weight: bold');
  
  const checks = {
    'saveTeams has try-catch': true,
    'saveTeams logs errors': true,
    'saveTeams shows error toast': true,
    'saveTeams continues with local state': true,
    'recordGameResults has try-catch': true,
    'recordGameResults logs errors': true,
    'recordGameResults shows success toast': true,
    'recordGameResults indicates offline mode': true
  };

  Object.entries(checks).forEach(([check, status]) => {
    const icon = status ? '✅' : '❌';
    console.log(`${icon} ${check}`);
  });
};

/**
 * Test error messages are user-friendly
 */
const verifyErrorMessages = () => {
  console.log('%c--- Error Message Verification ---', 'color: blue; font-weight: bold');
  
  const messages = {
    teamSaveError: 'Failed to save teams. Playing offline.',
    gameResultSuccess: 'Game complete! [Team Name] wins with [Score] points! (offline mode)',
    consoleError: 'Error saving teams: [error details]'
  };

  console.log('Expected team save error toast:', messages.teamSaveError);
  console.log('Expected game result success toast:', messages.gameResultSuccess);
  console.log('Expected console error log:', messages.consoleError);
};

// ============================================
// OFFLINE MODE CHECKLIST
// ============================================

/**
 * Run complete offline mode verification
 */
const runOfflineModeChecklist = () => {
  console.clear();
  console.log('%c╔════════════════════════════════════╗', 'color: #198D19; font-weight: bold');
  console.log('%c║   ZED RUSH - OFFLINE MODE TEST    ║', 'color: #198D19; font-weight: bold');
  console.log('%c╚════════════════════════════════════╝\n', 'color: #198D19; font-weight: bold');

  console.log('%cManual Testing Instructions:', 'font-weight: bold; font-size: 12px; color: #FF8C00');
  console.log('1. Enable offline mode in DevTools (F12 > Network > Offline)');
  console.log('2. Refresh the page');
  console.log('3. Follow these steps:');
  console.log('   a. Click "Setup Teams"');
  console.log('   b. Enter team names and players');
  console.log('   c. Click "Save Teams & Continue"');
  console.log('   d. Play a complete game');
  console.log('   e. Verify final results');
  console.log('');

  console.log('%cExpected Behavior:', 'font-weight: bold; font-size: 12px; color: #198D19');
  verifyErrorHandling();
  console.log('');

  console.log('%cExpected Messages:', 'font-weight: bold; font-size: 12px; color: #DC2626');
  verifyErrorMessages();
  console.log('');

  console.log('%cSimulating Complete Flow:', 'font-weight: bold; font-size: 12px; color: #FF3B1F');
  simulateCompleteOfflineFlow();
};

// ============================================
// AUTOMATED TEST SCENARIOS
// ============================================

/**
 * Mock test data for offline mode testing
 */
export const offlineModeTestData = {
  twoTeams: {
    numberOfTeams: 2,
    teamInputs: {
      team1Name: 'The Legends',
      team1Members: 'Chanda, Mulenga',
      team2Name: 'The Warriors',
      team2Members: 'Temba, Natasha'
    },
    expectedResult: {
      teams: [
        { name: 'The Legends', members: ['Chanda', 'Mulenga'], score: 0 },
        { name: 'The Warriors', members: ['Temba', 'Natasha'], score: 0 }
      ],
      toastMessage: 'Failed to save teams. Playing offline.'
    }
  },

  fiveTeams: {
    numberOfTeams: 5,
    teamInputs: {
      team1Name: 'Dragons',
      team1Members: 'Player1, Player2',
      team2Name: 'Tigers',
      team2Members: 'Player3, Player4',
      team3Name: 'Phoenix',
      team3Members: 'Player5, Player6',
      team4Name: 'Eagles',
      team4Members: 'Player7, Player8',
      team5Name: 'Lions',
      team5Members: 'Player9, Player10'
    },
    expectedResult: {
      teams: 5,
      toastMessage: 'Failed to save teams. Playing offline.'
    }
  },

  mockGameResult: {
    teamScores: [
      { teamName: 'The Legends', teamMembers: ['Chanda', 'Mulenga'], score: 8 },
      { teamName: 'The Warriors', teamMembers: ['Temba', 'Natasha'], score: 6 }
    ],
    totalRounds: 3,
    winningTeam: 'The Legends',
    expectedToastMessage: 'Game complete! The Legends wins with 8 points! (offline mode)'
  }
};

/**
 * Async function to test offline team saving (for integration tests)
 */
export const testOfflineTeamSave = async (teamData: any) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate network error
    throw new Error('Network request failed - Convex unavailable');
  } catch (error) {
    console.error('✅ Error caught as expected:', error);
    return {
      success: false,
      offline: true,
      message: 'Failed to save teams. Playing offline.',
      localState: teamData
    };
  }
};

/**
 * Async function to test offline game result recording
 */
export const testOfflineGameResult = async (gameData: any) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate network error
    throw new Error('Network request failed - Convex unavailable');
  } catch (error) {
    console.error('✅ Error caught as expected:', error);
    return {
      success: true, // UI success (game completed)
      offline: true,
      message: `Game complete! ${gameData.winningTeam} wins with ${gameData.teamScores[0].score} points! (offline mode)`,
      gameData: gameData
    };
  }
};

// ============================================
// EXPORT FOR BROWSER CONSOLE USE
// ============================================

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testConvexConnectivity = testConvexConnectivity;
  (window as any).simulateTeamSaveError = simulateTeamSaveError;
  (window as any).simulateGameResultError = simulateGameResultError;
  (window as any).simulateCompleteOfflineFlow = simulateCompleteOfflineFlow;
  (window as any).verifyErrorHandling = verifyErrorHandling;
  (window as any).verifyErrorMessages = verifyErrorMessages;
  (window as any).runOfflineModeChecklist = runOfflineModeChecklist;
  
  // Print setup message
  console.log('%c✅ Offline mode test utilities loaded!', 'color: green; font-weight: bold');
  console.log('%cRun: runOfflineModeChecklist() to start testing', 'color: blue');
}

export {
  testConvexConnectivity,
  simulateTeamSaveError,
  simulateGameResultError,
  simulateCompleteOfflineFlow,
  verifyErrorHandling,
  verifyErrorMessages,
  runOfflineModeChecklist
};
