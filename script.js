import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* =========================================================================
   Makruk 3D — Thai Chess Academy & Beginner Studio
   Vanilla ES module application. Three.js renders the board and pieces;
   all Makruk rules, AI, audio, persistence and bilingual UI live here.
   ========================================================================= */

const SAVE_KEY = "makruk3d.match.v1";
const PREFS_KEY = "makruk3d.prefs.v1";
const SAVE_FORMAT = "makruk-3d-save";
const SAVE_VERSION = 1;
const APP_CREDIT = {
  builtWith: "OpenCode",
  model: "DeepSeek V4.1 Flash",
  provider: "opencode-go",
  modelId: "deepseek-v4.1-flash",
};

const FILES = "abcdefgh";
const KNIGHT_STEPS = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
];
const KING_STEPS = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1],
  [0, 1], [1, -1], [1, 0], [1, 1],
];
const DIAGONALS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const ORTHOGONALS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const MATE_SCORE = 100000;

/* =========================================================================
   Bilingual copy
   ========================================================================= */

const I18N = {
  en: {
    brandKicker: "MAKRUK HERITAGE",
    appTitle: "Makruk 3D",
    appSubtitle: "Thai Chess Academy & Beginner Studio",
    soundLabel: "Sound",
    rulesButton: "Rules & Pieces",
    turnLabel: "Turn",
    botThinking: "Bot thinking",
    resetView: "Reset view",
    moveView: "Move view",
    moveViewOn: "Move mode on — drag the stage to reposition the board.",
    moveViewOff: "Move mode off — drag to orbit the board.",
    fullSize: "Full size",
    exitFullSize: "Exit full size",
    fullSizeOn: "Full-size board enabled. Press Esc or the button to exit.",
    fullSizeOff: "Returned to the academy layout.",
    assistOn: "Assist on",
    assistOff: "Assist off",
    loadingScene: "Carving the board…",
    webglErrorTitle: "The 3D board could not start",
    webglErrorText: "Please enable WebGL or try a current browser.",
    tutorTitle: "Learn by touching the pieces",
    tutorHint: "Select a piece to see its name, movement and legal destinations.",
    capturedByWhite: "Captured by White",
    capturedByBlack: "Captured by Black",
    modeTitle: "Choose your table",
    modeSubtitle: "One teacher, one rival, or two friends.",
    modeAiTitle: "Single Player",
    modeAiSubtitle: "Play White against the academy bot",
    botLevelLabel: "Bot strength",
    botLevelSimple: "Simple",
    botLevelMedium: "Medium",
    botLevelHard: "Hard",
    botLevelSuper: "Super Super Hard",
    botLevelChanged: "Bot strength: {level}",
    botLevelHint: "Hard is the default. Super thinks longer and searches captures more deeply.",
    thinkTimeLabel: "Thinking time",
    thinkTimeValue: "{seconds} s",
    thinkTimeChanged: "Thinking time: {seconds} s",
    modeLocalTitle: "Pass & Play",
    modeLocalSubtitle: "Two players sharing one screen",
    assistTitle: "Beginner Move Assist",
    assistSubtitle: "Green dots for legal moves, red rings for captures.",
    assistToggleLabel: "Toggle beginner move assist",
    recordTitle: "Match Record",
    recordSubtitle: "Every move, transcribed in real time.",
    recordEmpty: "The first move is yours.",
    recordReady: "Ready to play",
    newGame: "New Game",
    saveMatch: "Save Match",
    loadMatch: "Load Match",
    openGlossary: "Open the illustrated Makruk glossary",
    openDisplay: "Theme & text size",
    displayEyebrow: "READING COMFORT",
    displayTitle: "Display & reading",
    displaySubtitle: "Choose a board-house palette and a type size that feels comfortable.",
    themeHeading: "Board-house theme",
    themeSubtitle: "Four moods drawn from Thai court interiors.",
    boardPatternHeading: "Board pattern",
    boardPatternSubtitle: "Traditional Makruk boards are single-tone; modern club boards often alternate light and dark squares.",
    boardMaterialHeading: "Board material",
    boardMaterialSubtitle: "Low-glare wood and honed stone table-top finishes. Maple & Slate gives the crispest piece contrast.",
    pieceSetHeading: "Piece set",
    pieceSetSubtitle: "Two hand-built families, both drawn for instant recognition. Court follows Thai tradition; Tournament exaggerates each silhouette.",
    pieceSetCourt: "Court",
    pieceSetCourtDesc: "Carved lathe forms inspired by ceremonial Makruk sets.",
    pieceSetTournament: "Tournament",
    pieceSetTournamentDesc: "Bold, blocky silhouettes with a unique crown on every officer.",
    opponentColourHeading: "Opponent colour",
    opponentColourSubtitle: "Ruby reads clearly against every board finish and cannot be mistaken for a shadow.",
    pieceFinishRuby: "Ivory & Ruby",
    pieceFinishRubyDesc: "Warm ivory White against a vivid red opponent.",
    pieceFinishEbony: "Ivory & Ebony",
    pieceFinishEbonyDesc: "The classic ivory and near-black pairing.",
    stageColorHeading: "Stage colour",
    stageColorSubtitle: "Choose the room around the board, or follow the active theme.",
    stageColorCustom: "Custom colour",
    stageColorCurrent: "Current: {color}",
    stageColorAuto: "Theme default",
    stageColorMidnight: "Midnight",
    stageColorCharcoal: "Charcoal",
    stageColorSand: "Sand",
    stageColorSage: "Sage",
    stageColorWine: "Wine",
    stageColorNavy: "Navy",
    textSizeHeading: "Text size",
    textSizeSubtitle: "Enlarge the academy's labels for easier reading.",
    readingPreviewLabel: "Preview",
    readingPreviewText: "The Khon steps one square diagonally or one square forward. Protect the Khun, advance the Bia.",
    displayNote: "These preferences are saved on this device and do not affect the match.",
    resetDisplay: "Reset display",
    done: "Done",
    wisdom: "The boat is mightier than the queen. Guard the lord, advance the shells, and let patience win the board.",
    wisdomSource: "Makruk proverb for beginners",
    footerCredit: "Crafted in OpenCode with DeepSeek V4.1 Flash",
    footerHeritage: "Inspired by the Thai chess tradition",
    glossaryEyebrow: "THE MAKRUK COMPENDIUM",
    resultEyebrow: "THE MATCH IS DECIDED",
    reviewBoard: "Review board",
    reviewStalemate: "Why is this a draw?",
    backToBoard: "Back to board",
    resultCredit: "A lesson completed at the Makruk academy.",

    stalemateEyebrow: "BEGINNER REVIEW",
    stalemateReviewTitle: "Why stalemate is a draw",
    stalemateReviewSubtitle: "The lord is safe from check, but every escape is covered.",
    stalemateNotInCheck: "{side}'s Khun on {square} is NOT in check.",
    stalemateLastMove: "Final move: {move}",
    stalemateCauseCaptured: "The final move captured {piece} on {square}, but it did not give check. {side}'s Khun was left with no legal move — stalemate.",
    stalemateCause: "The final move did not give check. {side}'s Khun was left with no legal move — stalemate.",
    stalemateEscapesHeading: "The Khun's escape squares",
    stalemateEscapeAttacked: "controlled by {attackers}",
    stalemateEscapeBlocked: "blocked by {piece}",
    stalemateNoEscapes: "No adjacent escape square remains.",
    stalemateRuleNote: "<strong>Stalemate is a draw.</strong> Only checkmate wins. Capturing the last piece is not enough — the enemy Khun must be in check and have no legal answer.",
    stalemateLegendKing: "Khun — safe",
    stalemateLegendEscape: "Covered escape",
    stalemateLegendMove: "Final move",

    white: "White",
    black: "Black",
    turnWhite: "White to move",
    turnBlack: "Black to move",
    turnWhiteCheck: "White is in check",
    turnBlackCheck: "Black is in check",
    turnThinking: "Black is thinking…",
    check: "Check",
    moveLabel: "Move {n}",
    legalMoves: "Legal moves",
    captures: "Captures",
    movement: "Movement",
    assistDisabled: "Assist off",
    lastMove: "Last move",
    promotesTo: "Promotes to Bia Ngua",
    checkmateShort: "Checkmate",
    stalemateShort: "Stalemate",
    drawShort: "Draw",
    whiteToMoveShort: "White to move",
    blackToMoveShort: "Black to move",
    thinkingShort: "Bot thinking",

    resultCheckmateTitle: "Checkmate",
    resultStalemateTitle: "Stalemate",
    resultDrawTitle: "A drawn match",
    resultWhiteWins: "White wins",
    resultBlackWins: "Black wins",
    resultYouWin: "You win",
    resultBotWins: "The bot wins",
    resultDraw: "Draw",
    resultCheckmateYou: "You checkmated the academy bot. Every shell and boat played its part.",
    resultCheckmateBot: "The academy bot found a mating net. Replay the last moves and look for the Khon's forward step.",
    resultCheckmateWhite: "White delivered checkmate. The lord has nowhere left to stand.",
    resultCheckmateBlack: "Black delivered checkmate. The lord has nowhere left to stand.",
    resultStalemate: "No legal move remains while the lord is safe. Under Makruk rules, stalemate is a draw.",
    resultRepetition: "The same position has appeared three times. The match is drawn.",
    resultBareKings: "Only the two lords remain. Neither side can force mate, so the match is drawn.",

    toastSelect: "Select one of your pieces to begin.",
    toastIllegal: "That move is not legal in Makruk.",
    toastNotTurn: "It is not that side's turn.",
    toastBotTurn: "The academy bot is considering its move.",
    toastGameOver: "The match has ended. Start a new game to play again.",
    toastNewGame: "A fresh board is ready.",
    toastSaved: "Match saved to makruk_save.json.",
    toastLoaded: "Match restored from file.",
    toastAutoRestored: "Your previous match was restored.",
    toastInvalidSave: "That file is not a valid Makruk 3D save.",
    toastAssistOn: "Beginner assist enabled.",
    toastAssistOff: "Beginner assist hidden.",
    toastSoundOn: "Sound enabled.",
    toastSoundOff: "Sound muted.",
    toastModeAi: "Single Player mode — you command White.",
    toastModeLocal: "Pass & Play mode — two players, one board.",
    toastPromotion: "The bia has been flipped — Bia Ngua!",
    toastCheck: "Check! Protect the lord.",
    toastCheckmate: "Checkmate.",
    toastDraw: "The match is drawn.",
    toastSelectPrompt: "Choose a glowing destination.",
    toastCopied: "Move record copied.",
    toastNoMoves: "No legal moves available.",
    toastBoardReady: "The board is ready.",
    confirmNewGame: "Start a new game? The current match will be cleared.",
    confirmMode: "Changing the game mode will start a new match. Continue?",
    confirmLoad: "Loading a file will replace the current match. Continue?",

    glossarySubtitle: "Seven silhouettes, one ancient battlefield.",
    piecePreviewEyebrow: "THE PIECE IN THREE DIMENSIONS",
    piecePreviewHint: "Drag to rotate · scroll or pinch to zoom",
    piecePreviewReset: "Reset view",
    piecePreviewAuto: "Auto-rotate",
    piecePreviewAutoOn: "Auto-rotate on",
    piecePreviewAutoOff: "Auto-rotate off",
    piecePreviewModel: "3D model",
    modelCourtNote: "Shown in the Court set: rounded, carved profiles.",
    modelTournamentNote: "Shown in the Tournament set: bold silhouettes with a crown, diamond, brimmed helmet, horse head, towered barge and shell spire.",
    viewIn3D: "View in 3D",
    hearThai: "Hear Thai",
    pronounceHint: "Thai pronunciation",
    soundOffSpeech: "Sound is off — enable sound to hear the Thai pronunciation.",
    speechUnavailable: "Speech is not available in this browser.",
    previewUnavailable: "The 3D preview is unavailable in this browser.",
    rulesHeading: "Makruk in sixty seconds",
    rulesIntro: "The essentials that make Thai chess different from the international game.",
    heritageTitle: "A living court game",
    heritageText: "Makruk has been played in Siam for centuries. Its short-range Met and five-direction Khon preserve an older, more deliberate rhythm of chess.",
    rule1Title: "The board",
    rule1Text: "Traditional Thai boards are single-tone with carved grid lines; modern club boards often alternate light and dark squares. Bia begin on the third rank for White and the sixth rank for Black — much closer to the enemy than in international chess.",
    rule2Title: "No first double-step",
    rule2Text: "A Bia advances one square and captures one square diagonally forward. There is no two-square opening move and no en passant.",
    rule3Title: "Promotion on the sixth rank",
    rule3Text: "A Bia flips into Bia Ngua upon reaching its own sixth rank. It then moves one square diagonally, exactly like a Met.",
    rule4Title: "No castling",
    rule4Text: "The Khun moves one square in any direction, but there is no castling and no royal swap.",
    rule5Title: "The Khon's five steps",
    rule5Text: "A Khon may step one square diagonally in any direction, or one square straight forward. It may never step straight backward or sideways.",
    rule6Title: "How the match ends",
    rule6Text: "Checkmate wins. Stalemate is a draw. This studio also detects threefold repetition and bare-kings draws.",
  },
  th: {
    brandKicker: "มรดกหมากรุกไทย",
    appTitle: "หมากรุกไทย 3D",
    appSubtitle: "สถาบันหมากรุกไทย & สตูดิโอผู้เริ่มต้น",
    soundLabel: "เสียง",
    rulesButton: "กฎและหมาก",
    turnLabel: "ตาเดิน",
    botThinking: "บอทกำลังคิด",
    resetView: "มุมมองเริ่มต้น",
    moveView: "เลื่อนมุมมอง",
    moveViewOn: "โหมดเลื่อนเปิด — ลากพื้นที่เวทีเพื่อย้ายกระดาน",
    moveViewOff: "โหมดเลื่อนปิด — ลากเพื่อหมุนรอบกระดาน",
    fullSize: "เต็มจอ",
    exitFullSize: "ออกจากเต็มจอ",
    fullSizeOn: "เปิดกระดานเต็มจอแล้ว กด Esc หรือปุ่มเพื่อออก",
    fullSizeOff: "กลับสู่หน้าจอสถาบัน",
    assistOn: "ตัวช่วยเปิด",
    assistOff: "ตัวช่วยปิด",
    loadingScene: "กำลังแกะสลักกระดาน…",
    webglErrorTitle: "ไม่สามารถเริ่มกระดาน 3 มิติ",
    webglErrorText: "โปรดเปิด WebGL หรือใช้เบราว์เซอร์รุ่นใหม่",
    tutorTitle: "เรียนรู้ด้วยการสัมผัสหมาก",
    tutorHint: "เลือกหมากเพื่อดูชื่อ วิธีเดิน และช่องที่เดินได้",
    capturedByWhite: "ขาวกินได้",
    capturedByBlack: "ดำกินได้",
    modeTitle: "เลือกโต๊ะของคุณ",
    modeSubtitle: "ครูหนึ่งคน คู่แข่งหนึ่งคน หรือเพื่อนสองคน",
    modeAiTitle: "เล่นคนเดียว",
    modeAiSubtitle: "เล่นฝ่ายขาวกับบอทของสถาบัน",
    botLevelLabel: "ระดับบอท",
    botLevelSimple: "ง่าย",
    botLevelMedium: "ปานกลาง",
    botLevelHard: "ยาก",
    botLevelSuper: "ยากสุด ๆ",
    botLevelChanged: "ระดับบอท: {level}",
    botLevelHint: "ค่าเริ่มต้นคือยาก ส่วนยากสุด ๆ จะคิดนานขึ้นและค้นหาการกินลึกกว่า",
    thinkTimeLabel: "เวลาคิด",
    thinkTimeValue: "{seconds} วินาที",
    thinkTimeChanged: "เวลาคิด: {seconds} วินาที",
    modeLocalTitle: "ผู้เล่น 2 คน",
    modeLocalSubtitle: "ผลัดกันเล่นบนหน้าจอเดียว",
    assistTitle: "ตัวช่วยผู้เล่นใหม่",
    assistSubtitle: "จุดเขียวคือช่องที่เดินได้ วงแดงคือช่องกิน",
    assistToggleLabel: "เปิดหรือปิดตัวช่วยการเดิน",
    recordTitle: "บันทึกการแข่งขัน",
    recordSubtitle: "ทุกตาเดินถูกบันทึกทันที",
    recordEmpty: "ตาแรกเป็นของคุณ",
    recordReady: "พร้อมเล่น",
    newGame: "เริ่มเกมใหม่",
    saveMatch: "บันทึกแมตช์",
    loadMatch: "โหลดแมตช์",
    openGlossary: "เปิดคู่มือหมากรุกไทยแบบภาพ",
    openDisplay: "ธีมและขนาดตัวอักษร",
    displayEyebrow: "ความสบายในการอ่าน",
    displayTitle: "การแสดงผลและการอ่าน",
    displaySubtitle: "เลือกชุดสีของห้องกระดานและขนาดตัวอักษรที่อ่านสบาย",
    themeHeading: "ธีมห้องกระดาน",
    themeSubtitle: "สี่บรรยากาศจากภายในราชสำนักไทย",
    boardPatternHeading: "รูปแบบกระดาน",
    boardPatternSubtitle: "กระดานหมากรุกไทยดั้งเดิมเป็นสีเดียว ส่วนกระดานแข่งขันสมัยใหม่มักสลับช่องสว่างและเข้ม",
    boardMaterialHeading: "วัสดุกระดาน",
    boardMaterialSubtitle: "ผิวไม้และหินขัดด้านลดแสงสะท้อน เมเปิลกับสเลตให้ความต่างสีของหมากชัดที่สุด",
    pieceSetHeading: "ชุดหมาก",
    pieceSetSubtitle: "สองตระกูลที่ปั้นด้วยมือ ทั้งคู่ออกแบบให้เห็นชนิดหมากได้ทันที ราชสำนักคงความเป็นไทย ส่วนแข่งขันเน้นรูปทรงให้ชัดเกินจริง",
    pieceSetCourt: "ราชสำนัก",
    pieceSetCourtDesc: "รูปทรงกลึงแบบหมากรุกพิธีการไทย",
    pieceSetTournament: "แข่งขัน",
    pieceSetTournamentDesc: "รูปทรงเหลี่ยมชัดเจน พร้อมยอดต่างกันทุกตัว",
    opponentColourHeading: "สีฝ่ายตรงข้าม",
    opponentColourSubtitle: "สีทับทิมมองเห็นชัดบนกระดานทุกผิว และไม่มีทางถูกมองเป็นเงาดำ",
    pieceFinishRuby: "งาช้างและทับทิม",
    pieceFinishRubyDesc: "ฝ่ายขาวสีงาช้างอบอุ่น ฝ่ายตรงข้ามสีแดงสด",
    pieceFinishEbony: "งาช้างและไม้ดำ",
    pieceFinishEbonyDesc: "คู่สีคลาสสิกงาช้างกับดำสนิท",
    stageColorHeading: "สีของเวที",
    stageColorSubtitle: "เลือกสีห้องรอบกระดาน หรือใช้สีตามธีมที่เลือก",
    stageColorCustom: "เลือกสีเอง",
    stageColorCurrent: "ปัจจุบัน: {color}",
    stageColorAuto: "ค่าธีม",
    stageColorMidnight: "เที่ยงคืน",
    stageColorCharcoal: "ถ่าน",
    stageColorSand: "ทราย",
    stageColorSage: "เสจ",
    stageColorWine: "ไวน์",
    stageColorNavy: "กรมท่า",
    textSizeHeading: "ขนาดตัวอักษร",
    textSizeSubtitle: "ขยายข้อความของสถาบันเพื่อให้อ่านง่ายขึ้น",
    readingPreviewLabel: "ตัวอย่าง",
    readingPreviewText: "โคนเดินทแยงหนึ่งช่องหรือตรงไปข้างหน้าหนึ่งช่อง ปกป้องขุนและเลื่อนเบี้ย",
    displayNote: "การตั้งค่านี้บันทึกไว้ในอุปกรณ์นี้และไม่กระทบการแข่งขัน",
    resetDisplay: "รีเซ็ตการแสดงผล",
    done: "เสร็จสิ้น",
    wisdom: "เรือแข็งกว่าเม็ด ปกป้องขุน เลื่อนเบี้ย และให้ความอดทนชนะกระดาน",
    wisdomSource: "สุภาษิตหมากรุกสำหรับผู้เริ่มต้น",
    footerCredit: "สร้างด้วย OpenCode และ DeepSeek V4.1 Flash",
    footerHeritage: "แรงบันดาลใจจากหมากรุกไทย",
    glossaryEyebrow: "สารานุกรมหมากรุกไทย",
    resultEyebrow: "การแข่งขันได้ตัดสินแล้ว",
    reviewBoard: "ดูกระดานต่อ",
    reviewStalemate: "ทำไมเกมนี้จึงเสมอ?",
    backToBoard: "กลับไปที่กระดาน",
    resultCredit: "บทเรียนที่สำเร็จ ณ สถาบันหมากรุก",

    stalemateEyebrow: "บทเรียนสำหรับผู้เริ่มต้น",
    stalemateReviewTitle: "ทำไมหมากอับจึงเสมอ",
    stalemateReviewSubtitle: "ขุนปลอดภัยจากการถูกรุก แต่ทุกช่องหนีถูกควบคุม",
    stalemateNotInCheck: "ขุน{side}ที่ {square} ไม่ได้ถูกรุก",
    stalemateLastMove: "ตาเดินสุดท้าย: {move}",
    stalemateCauseCaptured: "ตาเดินสุดท้ายกิน{piece}ที่ {square} แต่ไม่ได้เป็นการรุก ขุน{side}จึงไม่มีช่องเดินที่ถูกต้อง — หมากอับ",
    stalemateCause: "ตาเดินสุดท้ายไม่ได้เป็นการรุก ขุน{side}จึงไม่มีช่องเดินที่ถูกต้อง — หมากอับ",
    stalemateEscapesHeading: "ช่องหนีของขุน",
    stalemateEscapeAttacked: "ถูกควบคุมโดย {attackers}",
    stalemateEscapeBlocked: "ถูกบล็อกโดย {piece}",
    stalemateNoEscapes: "ไม่มีช่องหนีที่อยู่ติดกับขุนเหลืออยู่",
    stalemateRuleNote: "<strong>หมากอับคือเสมอ</strong> ชนะได้ด้วยรุกจนเท่านั้น การกินหมากตัวสุดท้ายไม่เพียงพอ — ขุนฝ่ายตรงข้ามต้องถูกรุกและไม่มีทางตอบโต้",
    stalemateLegendKing: "ขุน — ปลอดภัย",
    stalemateLegendEscape: "ช่องที่ถูกควบคุม",
    stalemateLegendMove: "ตาเดินสุดท้าย",

    white: "ขาว",
    black: "ดำ",
    turnWhite: "ฝ่ายขาวเดิน",
    turnBlack: "ฝ่ายดำเดิน",
    turnWhiteCheck: "ขาวถูกรุก",
    turnBlackCheck: "ดำถูกรุก",
    turnThinking: "ดำกำลังคิด…",
    check: "รุก",
    moveLabel: "ตา {n}",
    legalMoves: "ช่องที่เดินได้",
    captures: "กินได้",
    movement: "วิธีเดิน",
    assistDisabled: "ตัวช่วยปิด",
    lastMove: "ตาเดินล่าสุด",
    promotesTo: "หงายเป็นเบี้ยหงาย",
    checkmateShort: "รุกจน",
    stalemateShort: "อับจน",
    drawShort: "เสมอ",
    whiteToMoveShort: "ขาวเดิน",
    blackToMoveShort: "ดำเดิน",
    thinkingShort: "บอทกำลังคิด",

    resultCheckmateTitle: "รุกจน",
    resultStalemateTitle: "อับจน",
    resultDrawTitle: "เกมเสมอ",
    resultWhiteWins: "ขาวชนะ",
    resultBlackWins: "ดำชนะ",
    resultYouWin: "คุณชนะ",
    resultBotWins: "บอทชนะ",
    resultDraw: "เสมอ",
    resultCheckmateYou: "คุณรุกจนบอทของสถาบันได้ ทุกหมากทำหน้าที่ของมัน",
    resultCheckmateBot: "บอทสร้างตาข่ายรุกจนได้ ลองย้อนดูตาเดินสุดท้ายและสังเกตการเดินหน้าเดียวของโคน",
    resultCheckmateWhite: "ฝ่ายขาวรุกจน ฝ่ายดำไม่มีที่ให้ขุนหลบ",
    resultCheckmateBlack: "ฝ่ายดำรุกจน ฝ่ายขาวไม่มีที่ให้ขุนหลบ",
    resultStalemate: "ไม่มีตาเดินที่ถูกกติกาแต่ขุนยังปลอดภัย ตามกติกาหมากรุกไทย ถือว่าเสมอ",
    resultRepetition: "ตำแหน่งเดิมปรากฏสามครั้ง การแข่งขันจึงเสมอ",
    resultBareKings: "เหลือเพียงขุนสองฝ่าย ไม่มีฝ่ายใดบังคับรุกจนได้ การแข่งขันจึงเสมอ",

    toastSelect: "เลือกหมากฝ่ายของคุณเพื่อเริ่ม",
    toastIllegal: "ตำแหน่งนี้เดินไม่ได้ตามกติกาหมากรุกไทย",
    toastNotTurn: "ยังไม่ถึงตาของฝ่ายนั้น",
    toastBotTurn: "บอทกำลังพิจารณาตาเดิน",
    toastGameOver: "เกมจบแล้ว เริ่มเกมใหม่เพื่อเล่นอีกครั้ง",
    toastNewGame: "กระดานใหม่พร้อมแล้ว",
    toastSaved: "บันทึกแมตช์เป็น makruk_save.json แล้ว",
    toastLoaded: "โหลดแมตช์จากไฟล์แล้ว",
    toastAutoRestored: "กู้คืนแมตช์ก่อนหน้าของคุณแล้ว",
    toastInvalidSave: "ไฟล์นี้ไม่ใช่ไฟล์บันทึกหมากรุกไทย 3D ที่ถูกต้อง",
    toastAssistOn: "เปิดตัวช่วยผู้เล่นใหม่แล้ว",
    toastAssistOff: "ซ่อนตัวช่วยผู้เล่นใหม่แล้ว",
    toastSoundOn: "เปิดเสียงแล้ว",
    toastSoundOff: "ปิดเสียงแล้ว",
    toastModeAi: "โหมดเล่นคนเดียว — คุณคุมฝ่ายขาว",
    toastModeLocal: "โหมดผู้เล่น 2 คน — สองคนหนึ่งกระดาน",
    toastPromotion: "เบี้ยหงายแล้ว — เบี้ยหงาย!",
    toastCheck: "รุก! ปกป้องขุน",
    toastCheckmate: "รุกจน",
    toastDraw: "เกมเสมอ",
    toastSelectPrompt: "เลือกช่องที่มีจุดเรืองแสง",
    toastCopied: "คัดลอกบันทึกตาเดินแล้ว",
    toastNoMoves: "ไม่มีตาเดินที่ถูกต้อง",
    toastBoardReady: "กระดานพร้อมเล่น",
    confirmNewGame: "เริ่มเกมใหม่หรือไม่? แมตช์ปัจจุบันจะถูกล้าง",
    confirmMode: "การเปลี่ยนโหมดจะเริ่มแมตช์ใหม่ ดำเนินการต่อหรือไม่?",
    confirmLoad: "การโหลดไฟล์จะแทนที่แมตช์ปัจจุบัน ดำเนินการต่อหรือไม่?",

    glossarySubtitle: "เจ็ดรูปทรง หนึ่งสมรภูมิโบราณ",
    piecePreviewEyebrow: "หมากในสามมิติ",
    piecePreviewHint: "ลากเพื่อหมุน · เลื่อนหรือบีบเพื่อซูม",
    piecePreviewReset: "รีเซ็ตมุมมอง",
    piecePreviewAuto: "หมุนอัตโนมัติ",
    piecePreviewAutoOn: "เปิดหมุนอัตโนมัติ",
    piecePreviewAutoOff: "ปิดหมุนอัตโนมัติ",
    piecePreviewModel: "แบบจำลองสามมิติ",
    modelCourtNote: "แสดงในชุดราชสำนัก: รูปทรงกลึงโค้งมนแบบงานแกะสลัก",
    modelTournamentNote: "แสดงในชุดแข่งขัน: รูปทรงเหลี่ยมชัด พร้อมมงกุฎ เพชร หมวกปีกกว้าง หัวม้า เรือมีหอ และยอดหอย",
    viewIn3D: "ดูในสามมิติ",
    hearThai: "ฟังเสียงไทย",
    pronounceHint: "คำอ่านภาษาไทย",
    soundOffSpeech: "เสียงปิดอยู่ — เปิดเสียงเพื่อฟังคำอ่านภาษาไทย",
    speechUnavailable: "เบราว์เซอร์นี้ไม่รองรับการออกเสียง",
    previewUnavailable: "เบราว์เซอร์นี้ไม่สามารถแสดงตัวอย่างสามมิติได้",
    rulesHeading: "หมากรุกไทยในหกสิบวินาที",
    rulesIntro: "สาระสำคัญที่ทำให้หมากรุกไทยต่างจากหมากรุกสากล",
    heritageTitle: "เกมแห่งราชสำนักที่ยังมีชีวิต",
    heritageText: "หมากรุกไทยเล่นกันในสยามมาหลายศตวรรษ เม็ดที่เดินสั้นและโคนที่เดินได้ห้าทิศทางรักษาจังหวะของหมากรุกโบราณที่สุขุมกว่า",
    rule1Title: "กระดาน",
    rule1Text: "กระดานหมากรุกไทยดั้งเดิมเป็นสีเดียวและมีเส้นตารางแกะ ส่วนกระดานแข่งขันสมัยใหม่มักสลับช่องสว่างและเข้ม เบี้ยเริ่มที่แถวที่สามของขาวและแถวที่หกของดำ ใกล้ข้าศึกกว่าหมากรุกสากลมาก",
    rule2Title: "ไม่มีเดินสองช่อง",
    rule2Text: "เบี้ยเดินตรงหนึ่งช่องและกินทแยงหน้าหนึ่งช่อง ไม่มีการเดินสองช่องในตาแรก และไม่มี en passant",
    rule3Title: "หงายที่แถวที่หก",
    rule3Text: "เบี้ยจะหงายเป็นเบี้ยหงายเมื่อถึงแถวที่หกของฝ่ายตน จากนั้นเดินทแยงหนึ่งช่องเหมือนเม็ด",
    rule4Title: "ไม่มีการเข้าป้อม",
    rule4Text: "ขุนเดินได้หนึ่งช่องทุกทิศทาง แต่ไม่มีการเข้าป้อมหรือสลับตำแหน่งราชวงศ์",
    rule5Title: "โคนห้าทิศทาง",
    rule5Text: "โคนเดินทแยงหนึ่งช่องทุกทิศทาง หรือตรงไปข้างหน้าหนึ่งช่อง แต่เดินตรงถอยหลังหรือไปด้านข้างไม่ได้",
    rule6Title: "การจบเกม",
    rule6Text: "รุกจนชนะ อับจนเสมอ สตูดิโอนี้ตรวจการเกิดตำแหน่งซ้ำสามครั้งและเหลือขุนสองฝ่ายด้วย",
  },
};

const PIECES = {
  khun: {
    type: "K",
    glyph: "♔",
    name: { en: "Khun", th: "ขุน" },
    role: { en: "Lord / King", th: "ขุน / กษัตริย์" },
    phonetic: "KOON",
    lore: {
      en: "The Khun was the lowest rank of conferred Siamese nobility — a lord who answers directly to the crown. On the board, his safety decides the entire match.",
      th: "ขุนเป็นบรรดาศักดิ์ชั้นต้นที่พระมหากษัตริย์พระราชทาน เป็นขุนนางผู้รับใช้ราชสำนักโดยตรง บนกระดาน ความปลอดภัยของขุนคือหัวใจของทั้งเกม",
    },
    movement: {
      en: "One square in any direction. No castling. Protect the lord at all costs.",
      th: "เดินหนึ่งช่องทุกทิศทาง ไม่มีการเข้าป้อม ปกป้องขุนไว้ให้ดีที่สุด",
    },
    model: {
      en: "A bell-shaped lathe profile, tapered waist, flared collar and tiered crown with a sharp golden finial.",
      th: "ทรงระฆังจาก LatheGeometry เอวคอด คอผาย และมงกุฎเป็นชั้นพร้อมยอดแหลมทองคำ",
    },
  },
  met: {
    type: "M",
    glyph: "❖",
    name: { en: "Met", th: "เม็ด" },
    role: { en: "Queen / Counsellor", th: "เม็ด / ราชินี" },
    phonetic: "MET",
    lore: {
      en: "Met is Makruk's queen — the short-range counsellor inherited from the ancient mantri and ferz. She guards the Khun and controls the diagonals one square at a time.",
      th: "เม็ดคือราชินีของหมากรุกไทย ผู้ให้คำปรึกษาระยะสั้นที่สืบทอดจากมันตรีและเฟิร์ซโบราณ เม็ดปกป้องขุนและควบคุมแนวทแยงทีละช่อง",
    },
    movement: {
      en: "Exactly one square diagonally, forwards or backwards. A short-range defender.",
      th: "เดินทแยงหนึ่งช่องเท่านั้น ทั้งหน้าและหลัง เป็นตัวป้องกันระยะสั้น",
    },
    model: {
      en: "A compact bud-like LatheGeometry silhouette with a smooth dome and a thin gold collar.",
      th: "รูปทรงตูมคล้ายดอกตูมจาก LatheGeometry ผิวโค้งเรียบพร้อมปลอกทองคำบาง ๆ",
    },
  },
  khon: {
    type: "B",
    glyph: "♗",
    name: { en: "Khon", th: "โคน" },
    role: { en: "Nobleman / Bishop", th: "โคน / บิชอป" },
    phonetic: "KOHN",
    lore: {
      en: "Khon also names the masked dance-drama of the Thai court. The piece is shaped like a lotus-bud stupa and moves with the distinctive five-direction grace of a nobleman.",
      th: "โคนยังหมายถึงโขน ละครรำของราชสำนักไทย หมากมีรูปทรงเจดีย์ดอกบัวและเดินห้าทิศทางอันเป็นเอกลักษณ์ของขุนนาง",
    },
    movement: {
      en: "One square diagonally in any direction, or one square straight forward. Never straight backward or sideways.",
      th: "เดินทแยงหนึ่งช่องทุกทิศทาง หรือตรงไปข้างหน้าหนึ่งช่อง แต่ถอยหลังหรือไปข้าง ๆ ตรง ๆ ไม่ได้",
    },
    model: {
      en: "A stupa-inspired lathe form with stacked collar rings, a lotus shoulder and a tapered golden point.",
      th: "รูปเจดีย์จาก LatheGeometry มีวงปลอกซ้อนกัน ไหล่ดอกบัว และยอดแหลมทองคำเรียว",
    },
  },
  ma: {
    type: "N",
    glyph: "♘",
    name: { en: "Ma", th: "ม้า" },
    role: { en: "Horse / Knight", th: "ม้า / อัศวิน" },
    phonetic: "MAA",
    lore: {
      en: "The warhorse is the only piece that leaps. Its carved head — arched neck, strong muzzle and a mane of small spikes — is one of the most recognisable silhouettes in Thai chess.",
      th: "ม้าศึกเป็นหมากเดียวที่กระโดดข้ามได้ หัวม้าแกะสลัก คอยาว arched ปากยื่น และแผงคอเป็นหนามเล็ก คือรูปทรงที่จำได้ง่ายที่สุดของหมากรุกไทย",
    },
    movement: {
      en: "Leaps two squares along a rank or file, then one to the side. The only jumping piece.",
      th: "กระโดดสองช่องตามแนวนอนหรือแนวตั้ง แล้วเลื่อนอีกหนึ่งช่องไปด้านข้าง เป็นหมากเดียวที่กระโดดได้",
    },
    model: {
      en: "An extruded hand-drawn horse-head silhouette on a turned base, with a layered mane, eye and golden harness details.",
      th: "หัวม้าจากเส้นโครงที่วาดและ ExtrudeGeometry บนฐานกลึง พร้อมแผงคอหลายชั้น ดวงตา และรายละเอียดสายรัดทองคำ",
    },
  },
  ruea: {
    type: "R",
    glyph: "⛵",
    name: { en: "Ruea", th: "เรือ" },
    role: { en: "Boat / Rook", th: "เรือ / รุก" },
    phonetic: "RUEA",
    lore: {
      en: "Ruea means boat. Thai river processions and royal barges gave the rook its long, upturned hull. It is the most powerful piece on the Makruk board.",
      th: "เรือคือเรือไทย กระบวนพยุหยาตราทางชลมารคและเรือพระที่นั่งเป็นแรงบันดาลใจให้เรือยาวหัวท้ายเชิดสูง เรือคือหมากที่แข็งแกร่งที่สุดบนกระดานหมากรุกไทย",
    },
    movement: {
      en: "Slides any distance along a rank or file. It cannot jump over another piece.",
      th: "เลื่อนได้ไกลเท่าที่ต้องการตามแนวนอนหรือแนวตั้ง แต่กระโดดข้ามหมากอื่นไม่ได้",
    },
    model: {
      en: "A custom-extruded longboat hull with sweeping bow and stern, gold deck rails and a low royal cabin ridge.",
      th: "เรือยาวจาก ExtrudeGeometry หัวท้ายเชิดโค้ง ราวดาดฟ้าทองคำ และสันเรือนเล็กตรงกลาง",
    },
  },
  bia: {
    type: "P",
    glyph: "◒",
    name: { en: "Bia", th: "เบี้ย" },
    role: { en: "Cowrie / Pawn", th: "เบี้ย / เบี้ย" },
    phonetic: "BIA",
    lore: {
      en: "Cowrie shells once served as small money in Siam, so they naturally became the pawns. A real Makruk set may still use polished shells for the Bia.",
      th: "เบี้ยเคยใช้เป็นเงินปลีกในสยาม จึงกลายเป็นหมากเบี้ยโดยธรรมชาติ ชุดหมากรุกไทยแท้อาจยังใช้เปลือกเบี้ยขัดเงาเป็นตัวหมาก",
    },
    movement: {
      en: "One square straight forward; captures one square diagonally forward. No double-step, no en passant.",
      th: "เดินตรงหนึ่งช่อง กินทแยงหน้าหนึ่งช่อง ไม่มีการเดินสองช่องและไม่มี en passant",
    },
    model: {
      en: "A flattened cowrie-shell dome with an elongated slit, sitting on a small turned wooden foot.",
      th: "โดมเปลือกเบี้ยแบนรีพร้อมร่องยาว วางบนฐานไม้กลึงเล็ก ๆ",
    },
  },
  biaNgua: {
    type: "P",
    glyph: "◎",
    name: { en: "Bia Ngua", th: "เบี้ยหงาย" },
    role: { en: "Flipped Cowrie", th: "เบี้ยหงาย" },
    phonetic: "BIA NGUAI",
    lore: {
      en: "Promotion is physical: the cowrie is flipped over. Bia Ngua — the overturned shell — moves like a Met and quietly changes the endgame.",
      th: "การหงายคือการพลิกเปลือกเบี้ยจริง ๆ เบี้ยหงายเดินเหมือนเม็ด และเปลี่ยนเกมสุดท้ายอย่างเงียบ ๆ",
    },
    movement: {
      en: "Moves one square diagonally in any direction, just like a Met. It cannot promote again.",
      th: "เดินทแยงหนึ่งช่องทุกทิศทางเหมือนเม็ด และไม่สามารถหงายซ้ำได้",
    },
    model: {
      en: "The same cowrie silhouette, inverted and marked with a raised golden inlay ring around a dark concave centre.",
      th: "รูปเปลือกเบี้ยเดิมที่พลิกด้าน พร้อมวงทองคำฝังนูนล้อมกลางเว้าสีเข้ม",
    },
  },
};

const THEMES = {
  lacquer: {
    name: { en: "Midnight Lacquer", th: "แลคเกอร์ราตรี" },
    description: { en: "Deep walnut, candle gold, cool shadow.", th: "วอลนัทเข้ม ทองแสงเทียน และเงาเย็น" },
    scene: {
      background: 0x0a0705,
      fog: 0x0a0705,
      table: 0x6c5845,
      dust: 0xe0bc75,
    },
  },
  ivory: {
    name: { en: "Ivory Court", th: "ราชสำนักงาช้าง" },
    description: { en: "Parchment, sunlit teak, dark ink.", th: "กระดาษงาช้าง ไม้สักอาบแดด และหมึกเข้ม" },
    scene: {
      background: 0x21150d,
      fog: 0x21150d,
      table: 0x9a7a56,
      dust: 0xe6c582,
    },
  },
  jade: {
    name: { en: "Jade Pavilion", th: "ศาลาหยก" },
    description: { en: "Forest lacquer and pale gold.", th: "แลคเกอร์ป่าลึกและทองอ่อน" },
    scene: {
      background: 0x06140e,
      fog: 0x06140e,
      table: 0x4d705e,
      dust: 0xa9e6c3,
    },
  },
  ruby: {
    name: { en: "Ruby Palace", th: "วังทับทิม" },
    description: { en: "Wine-red lacquer and royal gold.", th: "แลคเกอร์แดงไวน์และทองราชวงศ์" },
    scene: {
      background: 0x14060a,
      fog: 0x14060a,
      table: 0x724348,
      dust: 0xffb6a1,
    },
  },
};

const TEXT_SIZES = {
  small: { scale: 0.9, name: { en: "Small", th: "เล็ก" } },
  medium: { scale: 1, name: { en: "Default", th: "มาตรฐาน" } },
  large: { scale: 1.2, name: { en: "Large", th: "ใหญ่" } },
  xlarge: { scale: 1.4, name: { en: "Extra large", th: "ใหญ่มาก" } },
};

const BOARD_STYLES = {
  traditional: {
    name: { en: "Traditional", th: "ดั้งเดิม" },
    description: { en: "Single-tone teak, separated by carved seams.", th: "ไม้สักสีเดียว คั่นด้วยร่องแกะสลัก" },
  },
  checkered: {
    name: { en: "Checkered", th: "ตารางสลับสี" },
    description: { en: "Alternating light and dark wood, as on modern club boards.", th: "ไม้สว่างสลับเข้มแบบกระดานแข่งขันสมัยใหม่" },
  },
};

const BOARD_MATERIALS = {
  teak: {
    name: { en: "Teak & Ebony", th: "ไม้สักและไม้ดำ" },
    description: { en: "Warm carved teak against deep ebony, the academy classic.", th: "ไม้สักแกะสลักอบอุ่นสลับไม้ดำเข้ม ฉบับคลาสสิกของสถาบัน" },
    light: "#c29a67",
    dark: "#4c3120",
  },
  maple: {
    name: { en: "Maple & Slate", th: "เมเปิลและสเลต" },
    description: { en: "Pale maple and blue-grey slate for the strongest read.", th: "เมเปิลอ่อนสลับสเลตเทาฟ้า ให้ภาพหมากชัดที่สุด" },
    light: "#e0c9a4",
    dark: "#3d4854",
  },
  carrara: {
    name: { en: "Carrara & Marquina", th: "คาร์ราราและมาร์กินา" },
    description: { en: "Honed white marble against deep black stone.", th: "หินอ่อนขาวผิวด้านสลับหินดำเข้ม" },
    light: "#d8d2c4",
    dark: "#17191c",
  },
  travertine: {
    name: { en: "Travertine & Granite", th: "ทราเวอร์ทีนและแกรนิต" },
    description: { en: "Honed ivory travertine and warm charcoal granite.", th: "หินทราเวอร์ทีนงาช้างด้านและแกรนิตถ่านอบอุ่น" },
    light: "#cbb38f",
    dark: "#403a34",
  },
  jade: {
    name: { en: "Jade & Slate", th: "หยกและหินชนวน" },
    description: { en: "Honed green stone inlay with pale quartz squares.", th: "หยกเขียวฝังผิวด้านสลับหินควอตซ์อ่อน" },
    light: "#d5ddcf",
    dark: "#234c3e",
  },
};

const PIECE_SETS = {
  court: {
    name: { en: "Court", th: "ราชสำนัก" },
    description: {
      en: "Carved lathe forms inspired by ceremonial Makruk sets.",
      th: "รูปทรงกลึงแบบหมากรุกพิธีการไทย",
    },
  },
  tournament: {
    name: { en: "Tournament", th: "แข่งขัน" },
    description: {
      en: "Bold, blocky silhouettes with a unique crown on every officer.",
      th: "รูปทรงเหลี่ยมชัดเจน พร้อมยอดต่างกันทุกตัว",
    },
  },
};

const PIECE_FINISHES = {
  ruby: {
    name: { en: "Ivory & Ruby", th: "งาช้างและทับทิม" },
    description: {
      en: "Warm ivory White against a vivid red opponent.",
      th: "ฝ่ายขาวสีงาช้างอบอุ่น ฝ่ายตรงข้ามสีแดงสด",
    },
    darkMaterial: "ruby",
    darkAccentMaterial: "rubyAccent",
    swatch: "#b4232c",
  },
  ebony: {
    name: { en: "Ivory & Ebony", th: "งาช้างและไม้ดำ" },
    description: {
      en: "The classic ivory and near-black pairing.",
      th: "คู่สีคลาสสิกงาช้างกับดำสนิท",
    },
    darkMaterial: "dark",
    darkAccentMaterial: "darkAccent",
    swatch: "#2a1912",
  },
};

const PIECE_SET_ICONS = {
  court: `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <path d="M20 4.5c2.5 0 4 1.7 4 3.7 0 1.5-.8 2.5-1.8 3.1 3 .8 5.2 2.8 5.2 5.3 0 2-1.1 3.4-2.5 4.2 2.3 1.3 3.8 3.2 4.5 5.7H10.6c.7-2.5 2.2-4.4 4.5-5.7-1.4-.8-2.5-2.2-2.5-4.2 0-2.5 2.2-4.5 5.2-5.3-1-.6-1.8-1.6-1.8-3.1 0-2 1.5-3.7 4-3.7Z" fill="currentColor"/>
    <ellipse cx="20" cy="30" rx="11.5" ry="2.4" fill="currentColor" opacity=".65"/>
  </svg>`,
  tournament: `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <path d="M7.5 7.5 12 15V9l6.5 7V7l3 3 3-3v9L31 9v6l4.5-7.5-3.5 11H11L7.5 7.5Z" fill="currentColor"/>
    <path d="M15 21h10l1.6 6H13.4L15 21Z" fill="currentColor" opacity=".85"/>
    <rect x="9" y="29" width="22" height="4.6" rx="1.6" fill="currentColor"/>
  </svg>`,
};

const PIECE_FINISH_ICONS = {
  ruby: `<span class="finish-swatch"><i style="background:#f4e7cc"></i><i style="background:#b4232c"></i></span>`,
  ebony: `<span class="finish-swatch"><i style="background:#f4e7cc"></i><i style="background:#2a1912"></i></span>`,
};

const STAGE_COLORS = {
  auto: { nameKey: "stageColorAuto", color: null },
  midnight: { nameKey: "stageColorMidnight", color: "#090604" },
  charcoal: { nameKey: "stageColorCharcoal", color: "#27231f" },
  sand: { nameKey: "stageColorSand", color: "#cbb58f" },
  sage: { nameKey: "stageColorSage", color: "#223b30" },
  wine: { nameKey: "stageColorWine", color: "#2b0c14" },
  navy: { nameKey: "stageColorNavy", color: "#111d2b" },
};

const PIECE_ORDER = ["khun", "met", "khon", "ma", "ruea", "bia", "biaNgua"];
const PIECE_META_BY_TYPE = {
  K: PIECES.khun,
  M: PIECES.met,
  B: PIECES.khon,
  N: PIECES.ma,
  R: PIECES.ruea,
  P: PIECES.bia,
};
const PIECE_KEY_BY_TYPE = {
  K: "khun",
  M: "met",
  B: "khon",
  N: "ma",
  R: "ruea",
  P: "bia",
};

const PRONUNCIATION_FILES = {
  khun: "audio/th/khun.wav",
  met: "audio/th/met.wav",
  khon: "audio/th/khon.wav",
  ma: "audio/th/ma.wav",
  ruea: "audio/th/ruea.wav",
  bia: "audio/th/bia.wav",
  biaNgua: "audio/th/bia-ngua.wav",
};

const t = (key, vars = {}) => {
  const dict = I18N[state.lang] || I18N.en;
  let value = dict[key] ?? I18N.en[key] ?? key;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
};

const pieceMeta = (piece) => {
  if (!piece) return PIECES.bia;
  if (piece.type === "P" && piece.promoted) return PIECES.biaNgua;
  return PIECE_META_BY_TYPE[piece.type] || PIECES.bia;
};

const pieceName = (piece) => pieceMeta(piece).name[state.lang];
const pieceGlyph = (piece) => pieceMeta(piece).glyph;
const pieceViewerKey = (piece) => {
  if (!piece) return null;
  if (piece.type === "P" && piece.promoted) return "biaNgua";
  return PIECE_KEY_BY_TYPE[piece.type] || null;
};
const opponent = (color) => (color === "w" ? "b" : "w");

/* =========================================================================
   DOM references
   ========================================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const dom = {
  appShell: $(".app-shell"),
  langToggle: $("#langToggle"),
  soundToggle: $("#soundToggle"),
  glossaryButton: $("#glossaryButton"),
  sidebarGlossary: $("#sidebarGlossary"),
  displayButton: $("#displayButton"),
  displayModal: $("#displayModal"),
  themeGrid: $("#themeGrid"),
  boardStyleControl: $("#boardStyleControl"),
  boardMaterialControl: $("#boardMaterialControl"),
  pieceSetControl: $("#pieceSetControl"),
  pieceFinishControl: $("#pieceFinishControl"),
  stageColorControl: $("#stageColorControl"),
  stageColorInput: $("#stageColorInput"),
  stageColorCurrent: $("#stageColorCurrent"),
  textSizeControl: $("#textSizeControl"),
  displayReset: $("#displayReset"),
  panToggle: $("#panToggle"),
  fullSizeToggle: $("#fullSizeToggle"),
  turnStone: $("#turnStone"),
  turnText: $("#turnText"),
  moveCounter: $("#moveCounter"),
  checkChip: $("#checkChip"),
  aiChip: $("#aiChip"),
  aiChipLevel: $("#aiChipLevel"),
  boardStage: $("#boardStage"),
  scene: $("#scene"),
  sceneLoader: $("#sceneLoader"),
  sceneFallback: $("#sceneFallback"),
  resetView: $("#resetView"),
  assistPill: $("#assistPill"),
  tutorEmpty: $("#tutorEmpty"),
  tutorContent: $("#tutorContent"),
  capturedByWhite: $("#capturedByWhite"),
  capturedByBlack: $("#capturedByBlack"),
  modeCards: $$(".mode-card"),
  botSettings: $("#botSettings"),
  botLevelControl: $("#botLevelControl"),
  thinkTimeInput: $("#thinkTimeInput"),
  thinkTimeValue: $("#thinkTimeValue"),
  assistToggle: $("#assistToggle"),
  moveList: $("#moveList"),
  plyCount: $("#plyCount"),
  recordStatus: $("#recordStatus"),
  recordStatusDot: $(".record-status-dot"),
  newGameButton: $("#newGameButton"),
  saveButton: $("#saveButton"),
  loadButton: $("#loadButton"),
  loadFileInput: $("#loadFileInput"),
  glossaryModal: $("#glossaryModal"),
  glossaryTitle: $("#glossaryTitle"),
  glossarySubtitle: $("#glossarySubtitle"),
  glossaryGrid: $("#glossaryGrid"),
  piecePreviewModal: $("#piecePreviewModal"),
  piecePreviewStage: $("#piecePreviewStage"),
  piecePreviewCanvas: $("#piecePreviewCanvas"),
  piecePreviewGlyph: $("#piecePreviewGlyph"),
  piecePreviewStageName: $("#piecePreviewStageName"),
  piecePreviewTitle: $("#piecePreviewTitle"),
  piecePreviewRole: $("#piecePreviewRole"),
  piecePreviewLore: $("#piecePreviewLore"),
  piecePreviewMovement: $("#piecePreviewMovement"),
  piecePreviewModel: $("#piecePreviewModel"),
  piecePronounceButton: $("#piecePronounceButton"),
  pieceResetView: $("#pieceResetView"),
  pieceAutoRotate: $("#pieceAutoRotate"),
  rulesHeading: $("#rulesHeading"),
  rulesIntro: $("#rulesIntro"),
  rulesGrid: $("#rulesGrid"),
  heritageTitle: $("#heritageTitle"),
  heritageText: $("#heritageText"),
  resultModal: $("#resultModal"),
  resultEmblem: $("#resultEmblem"),
  resultTitle: $("#resultTitle"),
  resultDetail: $("#resultDetail"),
  resultNewGame: $("#resultNewGame"),
  reviewStalemateButton: $("#reviewStalemateButton"),
  stalemateModal: $("#stalemateModal"),
  stalemateTitle: $("#stalemateTitle"),
  stalemateSubtitle: $("#stalemateSubtitle"),
  stalemateBoard: $("#stalemateBoard"),
  stalemateCheckStatus: $("#stalemateCheckStatus"),
  stalemateLastMove: $("#stalemateLastMove"),
  stalemateCause: $("#stalemateCause"),
  stalemateEscapesTitle: $("#stalemateEscapesTitle"),
  stalemateEscapesList: $("#stalemateEscapesList"),
  stalemateRuleNote: $("#stalemateRuleNote"),
  stalemateNewGame: $("#stalemateNewGame"),
  toastStack: $("#toastStack"),
  brandHome: $("#brandHome"),
};

/* =========================================================================
   Sound synthesis
   ========================================================================= */

class SoundStudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.compressor = null;
    this.enabled = true;
  }

  unlock() {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.22;
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.value = -18;
        this.compressor.knee.value = 18;
        this.compressor.ratio.value = 4;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;
        this.master.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  noiseBuffer(duration = 0.2) {
    const ctx = this.ctx;
    const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * duration)), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  tone(frequency, duration, options = {}) {
    if (!this.enabled) return;
    const ctx = this.unlock();
    if (!ctx) return;
    const {
      type = "sine",
      volume = 0.1,
      delay = 0,
      endFrequency = null,
      attack = 0.006,
    } = options;
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    if (endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  noise(duration, options = {}) {
    if (!this.enabled) return;
    const ctx = this.unlock();
    if (!ctx) return;
    const { volume = 0.08, frequency = 900, delay = 0, q = 0.7 } = options;
    const start = ctx.currentTime + delay;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = this.noiseBuffer(duration);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(frequency, start);
    filter.Q.value = q;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start(start);
  }

  click() {
    this.tone(310, 0.045, { type: "triangle", volume: 0.035, endFrequency: 240 });
  }

  select() {
    this.tone(185, 0.07, { type: "sine", volume: 0.05, endFrequency: 150 });
    this.noise(0.045, { volume: 0.025, frequency: 1600 });
  }

  move() {
    this.noise(0.13, { volume: 0.12, frequency: 820 });
    this.tone(108, 0.13, { type: "sine", volume: 0.13, endFrequency: 52 });
    this.tone(510, 0.035, { type: "triangle", volume: 0.03, endFrequency: 340, delay: 0.012 });
  }

  capture() {
    this.noise(0.18, { volume: 0.16, frequency: 1900 });
    this.noise(0.1, { volume: 0.1, frequency: 560, delay: 0.015 });
    this.tone(160, 0.16, { type: "sawtooth", volume: 0.07, endFrequency: 58 });
    this.tone(76, 0.2, { type: "sine", volume: 0.16, endFrequency: 40, delay: 0.018 });
  }

  promote() {
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      this.tone(frequency, 0.35, {
        type: "triangle",
        volume: 0.07,
        delay: index * 0.075,
        attack: 0.012,
      });
    });
  }

  check() {
    this.tone(740, 0.19, { type: "triangle", volume: 0.085, endFrequency: 900 });
    this.tone(988, 0.24, { type: "sine", volume: 0.07, delay: 0.12, endFrequency: 880 });
    this.noise(0.08, { volume: 0.035, frequency: 2400, delay: 0.02 });
  }

  win() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((frequency, index) => {
      this.tone(frequency, 0.55, {
        type: index % 2 ? "sine" : "triangle",
        volume: 0.075,
        delay: index * 0.11,
        attack: 0.012,
      });
    });
    [523.25, 659.25, 783.99].forEach((frequency) => {
      this.tone(frequency, 1.2, {
        type: "sine",
        volume: 0.038,
        delay: 0.55,
        attack: 0.08,
      });
    });
  }

  lose() {
    [392, 329.63, 293.66, 220].forEach((frequency, index) => {
      this.tone(frequency, 0.52, {
        type: "triangle",
        volume: 0.065,
        delay: index * 0.14,
        endFrequency: frequency * 0.985,
      });
    });
  }

  draw() {
    [392, 493.88, 587.33].forEach((frequency) => {
      this.tone(frequency, 1.1, { type: "sine", volume: 0.045, attack: 0.06 });
    });
  }
}

const audio = new SoundStudio();

const thaiSpeech = {
  utterance: null,
  active: null,
  queue: [],
  token: 0,
  watchdog: null,
  buttons: new Set(),
  warmed: false,
};

const pronunciationAudio = {
  players: new Map(),
  active: null,
  token: 0,
  buttons: new Set(),
};

function warmSpeechVoices() {
  if (thaiSpeech.warmed || !("speechSynthesis" in window)) return;
  thaiSpeech.warmed = true;
  try {
    const synth = window.speechSynthesis;
    synth.getVoices();
    if (typeof synth.addEventListener === "function") {
      synth.addEventListener("voiceschanged", () => synth.getVoices(), { once: true });
    }
  } catch {
    // Voice enumeration is best-effort.
  }
}

/* =========================================================================
   Game state and rules
   ========================================================================= */

let pieceIdCounter = 1;
let aiTimer = null;
let resultTimer = null;
let lastFocusedElement = null;

const state = {
  board: [],
  turn: "w",
  mode: "ai",
  botLevel: "hard",
  thinkTimeMs: 5000,
  assist: true,
  lang: "en",
  sound: true,
  theme: "lacquer",
  textSize: "medium",
  boardStyle: "checkered",
  boardMaterial: "maple",
  pieceSet: "court",
  pieceFinish: "ruby",
  stageColor: "auto",
  history: [],
  captured: { w: [], b: [] },
  selected: null,
  selectedMoves: [],
  legalMovesForTurn: [],
  lastMove: null,
  status: "playing",
  statusReason: "",
  winner: null,
  inCheck: false,
  halfmove: 0,
  positionCounts: {},
  aiThinking: false,
  startedAt: Date.now(),
};

function makePiece(type, color) {
  return {
    id: pieceIdCounter++,
    type,
    color,
    promoted: false,
  };
}

function createStartingBoard() {
  const board = Array(64).fill(null);
  const backRank = ["R", "N", "B", "K", "M", "B", "N", "R"];
  for (let col = 0; col < 8; col += 1) {
    board[0 * 8 + col] = makePiece(backRank[col], "b");
    board[7 * 8 + col] = makePiece(backRank[col], "w");
    board[2 * 8 + col] = makePiece("P", "b");
    board[5 * 8 + col] = makePiece("P", "w");
  }
  return board;
}

const inside = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;
const squareIndex = (row, col) => row * 8 + col;
const rowOf = (index) => Math.floor(index / 8);
const colOf = (index) => index % 8;
const forwardFor = (color) => (color === "w" ? -1 : 1);
const promotionRowFor = (color) => (color === "w" ? 2 : 5);
const isPromotionRank = (color, row) => row === promotionRowFor(color);
const coordinateOf = (index) => `${FILES[colOf(index)]}${8 - rowOf(index)}`;

function pieceAt(board, row, col) {
  return inside(row, col) ? board[squareIndex(row, col)] : null;
}

function getPseudoMoves(board, from) {
  const piece = board[from];
  if (!piece) return [];
  const row = rowOf(from);
  const col = colOf(from);
  const moves = [];

  const addTarget = (targetRow, targetCol) => {
    if (!inside(targetRow, targetCol)) return false;
    const target = board[squareIndex(targetRow, targetCol)];
    if (!target) {
      moves.push(squareIndex(targetRow, targetCol));
      return true;
    }
    if (target.color !== piece.color) moves.push(squareIndex(targetRow, targetCol));
    return false;
  };

  if (piece.type === "K") {
    for (const [dr, dc] of KING_STEPS) addTarget(row + dr, col + dc);
    return moves;
  }

  if (piece.type === "M" || (piece.type === "P" && piece.promoted)) {
    for (const [dr, dc] of DIAGONALS) addTarget(row + dr, col + dc);
    return moves;
  }

  if (piece.type === "B") {
    for (const [dr, dc] of DIAGONALS) addTarget(row + dr, col + dc);
    addTarget(row + forwardFor(piece.color), col);
    return moves;
  }

  if (piece.type === "N") {
    for (const [dr, dc] of KNIGHT_STEPS) addTarget(row + dr, col + dc);
    return moves;
  }

  if (piece.type === "R") {
    for (const [dr, dc] of ORTHOGONALS) {
      let r = row + dr;
      let c = col + dc;
      while (inside(r, c)) {
        const target = board[squareIndex(r, c)];
        if (!target) {
          moves.push(squareIndex(r, c));
        } else {
          if (target.color !== piece.color) moves.push(squareIndex(r, c));
          break;
        }
        r += dr;
        c += dc;
      }
    }
    return moves;
  }

  if (piece.type === "P" && !piece.promoted) {
    const forward = forwardFor(piece.color);
    const oneRow = row + forward;
    if (inside(oneRow, col) && !board[squareIndex(oneRow, col)]) {
      moves.push(squareIndex(oneRow, col));
    }
    for (const dc of [-1, 1]) {
      const target = pieceAt(board, oneRow, col + dc);
      if (target && target.color !== piece.color) moves.push(squareIndex(oneRow, col + dc));
    }
    return moves;
  }

  return moves;
}

function isSquareAttacked(board, target, byColor) {
  const targetRow = rowOf(target);
  const targetCol = colOf(target);

  for (let from = 0; from < 64; from += 1) {
    const piece = board[from];
    if (!piece || piece.color !== byColor) continue;
    const row = rowOf(from);
    const col = colOf(from);
    const dr = targetRow - row;
    const dc = targetCol - col;

    if (piece.type === "K") {
      if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && (dr !== 0 || dc !== 0)) return true;
      continue;
    }

    if (piece.type === "M" || (piece.type === "P" && piece.promoted)) {
      if (Math.abs(dr) === 1 && Math.abs(dc) === 1) return true;
      continue;
    }

    if (piece.type === "P") {
      const forward = forwardFor(piece.color);
      if (dr === forward && Math.abs(dc) === 1) return true;
      continue;
    }

    if (piece.type === "B") {
      if (Math.abs(dr) === 1 && Math.abs(dc) === 1) return true;
      if (dr === forwardFor(piece.color) && dc === 0) return true;
      continue;
    }

    if (piece.type === "N") {
      if (
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2)
      ) return true;
      continue;
    }

    if (piece.type === "R") {
      if (dr === 0 && dc !== 0) {
        const step = Math.sign(dc);
        let clear = true;
        for (let c = col + step; c !== targetCol; c += step) {
          if (board[squareIndex(row, c)]) {
            clear = false;
            break;
          }
        }
        if (clear) return true;
      } else if (dc === 0 && dr !== 0) {
        const step = Math.sign(dr);
        let clear = true;
        for (let r = row + step; r !== targetRow; r += step) {
          if (board[squareIndex(r, col)]) {
            clear = false;
            break;
          }
        }
        if (clear) return true;
      }
    }
  }
  return false;
}

function attackersOnSquare(board, target, byColor) {
  const attackers = [];
  const targetRow = rowOf(target);
  const targetCol = colOf(target);

  for (let from = 0; from < 64; from += 1) {
    const piece = board[from];
    if (!piece || piece.color !== byColor) continue;
    const row = rowOf(from);
    const col = colOf(from);
    const dr = targetRow - row;
    const dc = targetCol - col;
    let attacks = false;

    if (piece.type === "K") {
      attacks = Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && (dr !== 0 || dc !== 0);
    } else if (piece.type === "M" || (piece.type === "P" && piece.promoted)) {
      attacks = Math.abs(dr) === 1 && Math.abs(dc) === 1;
    } else if (piece.type === "P") {
      attacks = dr === forwardFor(piece.color) && Math.abs(dc) === 1;
    } else if (piece.type === "B") {
      attacks =
        (Math.abs(dr) === 1 && Math.abs(dc) === 1) ||
        (dr === forwardFor(piece.color) && dc === 0);
    } else if (piece.type === "N") {
      attacks =
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    } else if (piece.type === "R" && ((dr === 0 && dc !== 0) || (dc === 0 && dr !== 0))) {
      const rowStep = Math.sign(dr);
      const colStep = Math.sign(dc);
      attacks = true;
      for (
        let r = row + rowStep, c = col + colStep;
        r !== targetRow || c !== targetCol;
        r += rowStep, c += colStep
      ) {
        if (board[squareIndex(r, c)]) {
          attacks = false;
          break;
        }
      }
    }

    if (attacks) attackers.push({ index: from, piece });
  }

  return attackers;
}

function findKing(board, color) {
  for (let i = 0; i < 64; i += 1) {
    const piece = board[i];
    if (piece && piece.type === "K" && piece.color === color) return i;
  }
  return -1;
}

function isInCheck(color, board = state.board) {
  const kingIndex = findKing(board, color);
  if (kingIndex < 0) return false;
  return isSquareAttacked(board, kingIndex, opponent(color));
}

function applyMoveRaw(board, from, to) {
  const moving = board[from];
  const captured = board[to] || null;
  board[to] = moving;
  board[from] = null;

  let promotedNow = false;
  if (
    moving.type === "P" &&
    !moving.promoted &&
    isPromotionRank(moving.color, rowOf(to))
  ) {
    moving.promoted = true;
    promotedNow = true;
  }

  return { captured, promotedNow };
}

function undoMoveRaw(board, from, to, undo) {
  const moving = board[to];
  if (undo.promotedNow) moving.promoted = false;
  board[from] = moving;
  board[to] = undo.captured;
}

function getLegalMoves(color, board = state.board) {
  const moves = [];
  for (let from = 0; from < 64; from += 1) {
    const piece = board[from];
    if (!piece || piece.color !== color) continue;
    const pseudo = getPseudoMoves(board, from);
    for (const to of pseudo) {
      const target = board[to];
      if (target && target.type === "K") continue;
      const willPromote =
        piece.type === "P" &&
        !piece.promoted &&
        isPromotionRank(piece.color, rowOf(to));
      const undo = applyMoveRaw(board, from, to);
      if (!isInCheck(color, board)) {
        moves.push({ from, to, captured: target, promoted: willPromote });
      }
      undoMoveRaw(board, from, to, undo);
    }
  }
  return moves;
}

function positionKey(board = state.board, turn = state.turn) {
  let key = "";
  for (let i = 0; i < 64; i += 1) {
    const piece = board[i];
    key += piece
      ? `${piece.color}${piece.type}${piece.promoted ? "+" : ""}`
      : "..";
  }
  return `${key}:${turn}`;
}

function registerPosition() {
  const key = positionKey();
  state.positionCounts[key] = (state.positionCounts[key] || 0) + 1;
}

function onlyKingsRemain(board = state.board) {
  return !board.some((piece) => piece && piece.type !== "K");
}

function evaluateGameState() {
  state.inCheck = isInCheck(state.turn, state.board);
  state.legalMovesForTurn = getLegalMoves(state.turn, state.board);
  state.status = "playing";
  state.statusReason = "";
  state.winner = null;

  if (state.legalMovesForTurn.length === 0) {
    if (state.inCheck) {
      state.status = "checkmate";
      state.statusReason = "checkmate";
      state.winner = opponent(state.turn);
    } else {
      state.status = "stalemate";
      state.statusReason = "stalemate";
    }
    return;
  }

  if ((state.positionCounts[positionKey()] || 0) >= 3) {
    state.status = "draw";
    state.statusReason = "repetition";
    return;
  }

  if (onlyKingsRemain(state.board)) {
    state.status = "draw";
    state.statusReason = "bareKings";
  }
}

function resetGameState() {
  clearTimeout(aiTimer);
  clearTimeout(resultTimer);
  aiTimer = null;
  resultTimer = null;
  state.board = createStartingBoard();
  state.turn = "w";
  state.history = [];
  state.captured = { w: [], b: [] };
  state.selected = null;
  state.selectedMoves = [];
  state.legalMovesForTurn = [];
  state.lastMove = null;
  state.status = "playing";
  state.statusReason = "";
  state.winner = null;
  state.inCheck = false;
  state.halfmove = 0;
  state.positionCounts = {};
  state.aiThinking = false;
  state.startedAt = Date.now();
  registerPosition();
  evaluateGameState();
}

function updateGameStatus() {
  state.inCheck = isInCheck(state.turn, state.board);
  state.legalMovesForTurn = getLegalMoves(state.turn, state.board);
  state.status = "playing";
  state.statusReason = "";
  state.winner = null;

  if (state.legalMovesForTurn.length === 0) {
    if (state.inCheck) {
      state.status = "checkmate";
      state.statusReason = "checkmate";
      state.winner = opponent(state.turn);
    } else {
      state.status = "stalemate";
      state.statusReason = "stalemate";
    }
    return;
  }

  if ((state.positionCounts[positionKey()] || 0) >= 3) {
    state.status = "draw";
    state.statusReason = "repetition";
    return;
  }

  if (onlyKingsRemain(state.board)) {
    state.status = "draw";
    state.statusReason = "bareKings";
  }
}

function isTerminal() {
  return state.status !== "playing";
}

function canHumanInteract() {
  if (isTerminal() || state.aiThinking) return false;
  if (state.mode === "ai" && state.turn === "b") return false;
  return true;
}

/* =========================================================================
   AI
   ========================================================================= */

const PIECE_VALUES = {
  K: 0,
  M: 170,
  B: 305,
  N: 330,
  R: 520,
  P: 100,
};

// Four strengths share one engine. `margin` lets a weaker level choose among
// near-best moves; `blunder` occasionally picks a merely-reasonable one.
const AI_LEVELS = {
  easy: {
    nameKey: "botLevelSimple",
    maxDepth: 3,
    defaultMs: 500,
    quiescence: false,
    margin: 150,
    blunder: 0.32,
  },
  medium: {
    nameKey: "botLevelMedium",
    maxDepth: 5,
    defaultMs: 1500,
    quiescence: false,
    margin: 55,
    blunder: 0.08,
  },
  hard: {
    nameKey: "botLevelHard",
    maxDepth: 8,
    defaultMs: 5000,
    quiescence: true,
    margin: 0,
    blunder: 0,
  },
  super: {
    nameKey: "botLevelSuper",
    maxDepth: 12,
    defaultMs: 12000,
    quiescence: true,
    margin: 0,
    blunder: 0,
  },
};

const THINK_TIME_MIN_MS = 500;
const THINK_TIME_MAX_MS = 20000;
const THINK_TIME_STEP_MS = 250;

function activeAILevel() {
  return AI_LEVELS[state.botLevel] || AI_LEVELS.hard;
}

function pieceValue(piece) {
  if (!piece) return 0;
  if (piece.type === "P" && piece.promoted) return 190;
  return PIECE_VALUES[piece.type] || 0;
}

function materialBalance(board, color) {
  let score = 0;
  for (let i = 0; i < 64; i += 1) {
    const piece = board[i];
    if (!piece) continue;
    score += piece.color === color ? pieceValue(piece) : -pieceValue(piece);
  }
  return score;
}

function evaluateBoard(board, perspective) {
  const biaFiles = { w: new Array(8).fill(0), b: new Array(8).fill(0) };
  const kingIndex = { w: -1, b: -1 };
  const sideMaterial = { w: 0, b: 0 };
  const rookIndexes = { w: [], b: [] };
  let totalMaterial = 0;
  for (let i = 0; i < 64; i += 1) {
    const piece = board[i];
    if (!piece) continue;
    if (piece.type === "K") kingIndex[piece.color] = i;
    else {
      sideMaterial[piece.color] += pieceValue(piece);
      totalMaterial += pieceValue(piece);
    }
    if (piece.type === "P" && !piece.promoted) biaFiles[piece.color][colOf(i)] += 1;
    if (piece.type === "R") rookIndexes[piece.color].push(i);
  }
  const endgame = totalMaterial < 1800;
  const stronger = sideMaterial.w > sideMaterial.b + 120
    ? "w"
    : sideMaterial.b > sideMaterial.w + 120
      ? "b"
      : null;

  let score = 0;
  for (let i = 0; i < 64; i += 1) {
    const piece = board[i];
    if (!piece) continue;
    const row = rowOf(i);
    const col = colOf(i);
    const enemyKing = kingIndex[opponent(piece.color)];
    const centerDistance = Math.max(Math.abs(row - 3.5), Math.abs(col - 3.5));
    let value = pieceValue(piece);

    if (piece.type === "N" || piece.type === "B" || piece.type === "M") {
      value += Math.max(0, 3.5 - centerDistance) * 3.2;
      if (enemyKing >= 0) {
        const kingDistance = Math.abs(row - rowOf(enemyKing)) + Math.abs(col - colOf(enemyKing));
        if (kingDistance <= 5) value += (6 - kingDistance) * 3.5;
      }
    }
    if (piece.type === "P" && !piece.promoted) {
      const progress = piece.color === "w" ? 5 - row : row - 2;
      value += Math.max(0, progress) * 14;
      // A Bia one step from promotion is worth far more than a rank count.
      if (progress >= 2) value += progress >= 3 ? 42 : 18;
    }
    if (piece.type === "K") {
      const homeRow = piece.color === "w" ? 7 : 0;
      if (!endgame) {
        if (row === homeRow) value += 20;
        if (piece.color === "w" ? row < 5 : row > 2) value -= 18;
      } else {
        // In the endgame, the lord must join the attack instead of hiding.
        value += Math.max(0, 3.5 - centerDistance) * 7;
      }
    }
    if (piece.type === "R") {
      value += Math.max(0, 3.5 - centerDistance) * 1.6;
      if (biaFiles[piece.color][col] === 0) value += 20;
      if (enemyKing >= 0) {
        const kingDistance = Math.abs(row - rowOf(enemyKing)) + Math.abs(col - colOf(enemyKing));
        if (kingDistance <= 5) value += (6 - kingDistance) * 2.5;
        // Cutting the enemy Khun along a rank or file is how a Ruea mates.
        if (row === rowOf(enemyKing) || col === colOf(enemyKing)) value += 14;
      }
    }

    score += piece.color === perspective ? value : -value;
  }

  // Mop-up: with a decisive material lead, drive the lone Khun to the edge,
  // walk the winning Khun in, and cut with the Ruea. Without this, a winning
  // engine happily shuffles because every quiet move evaluates the same.
  if (endgame && stronger) {
    const enemyKing = kingIndex[opponent(stronger)];
    const ownKing = kingIndex[stronger];
    if (enemyKing >= 0 && ownKing >= 0) {
      const enemyRow = rowOf(enemyKing);
      const enemyCol = colOf(enemyKing);
      const edgeDistance = Math.min(enemyRow, 7 - enemyRow, enemyCol, 7 - enemyCol);
      const kingDistance = Math.max(
        Math.abs(rowOf(ownKing) - enemyRow),
        Math.abs(colOf(ownKing) - enemyCol),
      );
      let bonus = (3 - edgeDistance) * 30 + Math.max(0, 7 - kingDistance) * 12;

      for (const i of rookIndexes[stronger]) {
        if (rowOf(i) === enemyRow || colOf(i) === enemyCol) bonus += 22;
        const rookDistance = Math.abs(rowOf(i) - enemyRow) + Math.abs(colOf(i) - enemyCol);
        if (rookDistance <= 3) bonus += 12;
      }

      score += stronger === perspective ? bonus : -bonus;
    }
  }

  return score;
}

function moveOrderScore(move, board) {
  let score = 0;
  if (move.captured) {
    score += 1000 + pieceValue(move.captured) * 10 - pieceValue(board[move.from]) * 0.1;
  }
  if (move.promoted) score += 700;
  const row = rowOf(move.to);
  const col = colOf(move.to);
  score += (3.5 - Math.max(Math.abs(row - 3.5), Math.abs(col - 3.5))) * 2;
  return score;
}

function orderMoves(moves, board, ply = -1) {
  const killers = ply >= 0 && killerMoves[ply] ? killerMoves[ply] : null;
  return moves
    .map((move) => {
      let score = moveOrderScore(move, board);
      if (killers) {
        if (killers[0] && killers[0].from === move.from && killers[0].to === move.to) score += 900;
        else if (killers[1] && killers[1].from === move.from && killers[1].to === move.to) score += 500;
      }
      if (ply >= 0) score += historyHeuristic[move.from * 64 + move.to];
      return { move, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.move);
}

function shuffleMoves(moves) {
  for (let i = moves.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [moves[i], moves[j]] = [moves[j], moves[i]];
  }
  return moves;
}

let searchDeadline = 0;
let searchAborted = false;
let searchStats = { depth: 0, nodes: 0, ms: 0, aborted: false, level: "hard" };
const killerMoves = [];
const historyHeuristic = new Int32Array(64 * 64);

function searchExpired() {
  if (performance.now() > searchDeadline) {
    searchAborted = true;
    return true;
  }
  return false;
}

function quiesce(board, color, alpha, beta, ply, remaining = 4) {
  searchStats.nodes += 1;
  if (searchExpired()) return evaluateBoard(board, color);
  const standPat = evaluateBoard(board, color);
  if (remaining <= 0) return standPat;
  if (standPat >= beta) return beta;
  if (standPat > alpha) alpha = standPat;

  const captures = getLegalMoves(color, board).filter((move) => move.captured || move.promoted);
  if (captures.length === 0) return standPat;
  orderMoves(captures, board, ply);

  let best = standPat;
  for (const move of captures) {
    const undo = applyMoveRaw(board, move.from, move.to);
    const score = -quiesce(board, opponent(color), -beta, -alpha, ply + 1, remaining - 1);
    undoMoveRaw(board, move.from, move.to, undo);
    if (searchAborted) return best;
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return best;
}

function negamax(board, color, depth, alpha, beta, ply, cfg) {
  searchStats.nodes += 1;
  if (searchExpired()) return evaluateBoard(board, color);

  if (depth <= 0) {
    return cfg.quiescence
      ? quiesce(board, color, alpha, beta, ply)
      : evaluateBoard(board, color);
  }

  const moves = getLegalMoves(color, board);
  if (moves.length === 0) {
    return isInCheck(color, board) ? -MATE_SCORE + ply : 0;
  }

  orderMoves(moves, board, ply);
  let best = -Infinity;
  for (const move of moves) {
    const undo = applyMoveRaw(board, move.from, move.to);
    const score = -negamax(board, opponent(color), depth - 1, -beta, -alpha, ply + 1, cfg);
    undoMoveRaw(board, move.from, move.to, undo);
    if (searchAborted) return best;
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) {
      if (!move.captured) {
        if (!killerMoves[ply]) killerMoves[ply] = [];
        if (killerMoves[ply][0]?.from !== move.from || killerMoves[ply][0]?.to !== move.to) {
          killerMoves[ply][1] = killerMoves[ply][0];
          killerMoves[ply][0] = { from: move.from, to: move.to };
        }
        historyHeuristic[move.from * 64 + move.to] += depth * depth;
      }
      break;
    }
  }
  return best;
}

function rootProgressScore(move, board) {
  const piece = board[move.from];
  let score = 0;
  if (move.captured) score += 70 + pieceValue(move.captured) * 0.5;
  if (move.promoted) score += 55;
  if (piece && piece.type === "P") {
    const advance = piece.color === "w"
      ? rowOf(move.from) - rowOf(move.to)
      : rowOf(move.to) - rowOf(move.from);
    score += advance * 9;
  }
  const centerDistance = Math.max(Math.abs(rowOf(move.to) - 3.5), Math.abs(colOf(move.to) - 3.5));
  score += (3.5 - centerDistance) * 2.5;
  // Moving a piece straight back where it came from is the classic shuffle.
  const last = state.lastMove;
  if (last && last.color === "b" && move.to === last.from && move.from === last.to) score -= 55;
  return score;
}

function rootRepetitionPenalty(move, avoidDraw) {
  if (!avoidDraw) return 0;
  const undo = applyMoveRaw(state.board, move.from, move.to);
  const key = positionKey(state.board, opponent("b"));
  undoMoveRaw(state.board, move.from, move.to, undo);
  const seen = state.positionCounts[key] || 0;
  if (seen >= 2) return 50000;
  if (seen === 1) return 140;
  return 0;
}

function chooseAIMove() {
  const cfg = activeAILevel();
  const rootMoves = getLegalMoves("b", state.board);
  if (rootMoves.length === 0) return null;
  if (rootMoves.length === 1) return rootMoves[0];

  const startedAt = performance.now();
  const avoidDraw = materialBalance(state.board, "b") > 120;
  searchStats = { depth: 0, nodes: 0, ms: 0, aborted: false, level: state.botLevel };
  killerMoves.length = 0;
  historyHeuristic.fill(0);

  orderMoves(rootMoves, state.board);
  let bestMove = rootMoves[0];
  let bestScore = -Infinity;
  let rootScores = [];
  searchDeadline = startedAt + Math.max(THINK_TIME_MIN_MS, state.thinkTimeMs);

  for (let depth = 1; depth <= cfg.maxDepth; depth += 1) {
    searchAborted = false;
    let depthBest = null;
    let depthBestScore = -Infinity;
    const scores = [];

    const candidates = depth === 1 ? shuffleMoves([...rootMoves]) : rootMoves;
    for (const move of candidates) {
      const undo = applyMoveRaw(state.board, move.from, move.to);
      // Full window at the root: a narrow window returns the same bound for
      // every move that fails low, which makes unrelated moves look tied and
      // lets tie-breaking shuffle instead of converting a win.
      const score = -negamax(state.board, "w", depth - 1, -Infinity, Infinity, 1, cfg);
      undoMoveRaw(state.board, move.from, move.to, undo);
      if (searchAborted) break;

      scores.push({ move, score });
      if (score > depthBestScore) {
        depthBestScore = score;
        depthBest = move;
      }
    }

    if (!searchAborted && depthBest) {
      bestMove = depthBest;
      bestScore = depthBestScore;
      rootScores = scores;
      searchStats.depth = depth;
    }
    if (searchAborted || bestScore > MATE_SCORE - 1000) break;
    if (performance.now() > searchDeadline) break;
  }

  searchStats.ms = Math.round(performance.now() - startedAt);
  searchStats.aborted = searchAborted;

  if (rootScores.length === 0) return bestMove;

  // Repetition is a resource for the losing side, never for the winning side.
  const adjusted = rootScores.map((entry) => ({
    move: entry.move,
    score: entry.score - rootRepetitionPenalty(entry.move, avoidDraw),
    progress: rootProgressScore(entry.move, state.board),
  }));
  const maxScore = Math.max(...adjusted.map((entry) => entry.score));
  let pool = adjusted.filter((entry) => entry.score >= maxScore - cfg.margin);

  if (cfg.blunder > 0 && Math.random() < cfg.blunder) {
    const safe = adjusted.filter((entry) => entry.score >= maxScore - 450);
    pool = safe.length ? safe : adjusted;
  }

  if (cfg.margin <= 0) {
    pool.sort((a, b) => b.progress - a.progress);
    return pool[0].move;
  }
  return pool[Math.floor(Math.random() * pool.length)].move;
}

/* =========================================================================
   Three.js scene
   ========================================================================= */

const WORLD = {
  boardTop: 0.455,
  square: 1,
};

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let boardRoot = null;
let pieceLayer = null;
let highlightLayer = null;
let lastMoveLayer = null;
let tableMesh = null;
let panMode = false;
let boardFocus = false;
let pickables = [];
let tileMeshes = [];
let raycaster = null;
let pointer = new THREE.Vector2();
let glowTexture = null;
let clock = null;
let dust = null;
let sceneReady = false;
let defaultCameraPosition = new THREE.Vector3(8.6, 9.9, 10.2);
let lastViewportAspect = null;
const meshById = new Map();
const removalEntries = [];
const materials = {};
const woodTextures = {};
const piecePreview = {
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  pivot: null,
  group: null,
  shadow: null,
  ring: null,
  clock: null,
  key: null,
  autoRotate: true,
  stageObserver: null,
};

function worldPosition(index) {
  const row = rowOf(index);
  const col = colOf(index);
  return new THREE.Vector3(col - 3.5, WORLD.boardTop, row - 3.5);
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function makeWoodTexture(baseColor, grainColor, seed, repeat = 1.35) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  const random = seededRandom(seed);

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 384, 384);

  const gradient = ctx.createLinearGradient(0, 0, 384, 384);
  gradient.addColorStop(0, "rgba(255,255,255,0.07)");
  gradient.addColorStop(0.42, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.16)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 384, 384);

  for (let band = 0; band < 46; band += 1) {
    const y = random() * 420 - 18;
    ctx.beginPath();
    const amplitude = 4 + random() * 12;
    const frequency = 0.007 + random() * 0.018;
    const phase = random() * Math.PI * 2;
    for (let x = -24; x <= 408; x += 8) {
      const wave = Math.sin(x * frequency + phase) * amplitude;
      if (x === -24) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.strokeStyle = grainColor.replace("ALPHA", String(0.025 + random() * 0.11));
    ctx.lineWidth = 0.5 + random() * 2.2;
    ctx.stroke();
  }

  for (let knot = 0; knot < 3; knot += 1) {
    const x = random() * 384;
    const y = random() * 384;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1.8, 0.72);
    for (let ring = 0; ring < 5; ring += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, 5 + ring * 4.5, 0, Math.PI * 2);
      ctx.strokeStyle = grainColor.replace("ALPHA", String(0.08 - ring * 0.012));
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  for (let dot = 0; dot < 480; dot += 1) {
    const alpha = 0.02 + random() * 0.015;
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(random() * 384, random() * 384, 1 + random(), 1 + random());
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  if (renderer) texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function makeStoneTexture(baseColor, accentColor, seed, style = "marble", repeat = 1.1) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  const random = seededRandom(seed);

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 384, 384);

  const sheen = ctx.createLinearGradient(0, 0, 384, 384);
  sheen.addColorStop(0, "rgba(255,255,255,0.16)");
  sheen.addColorStop(0.38, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(0,0,0,0.14)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, 384, 384);

  if (style === "marble" || style === "jade") {
    for (let vein = 0; vein < 16; vein += 1) {
      const startY = random() * 430 - 24;
      const startX = -20 + random() * 60;
      const endY = random() * 430 - 24;
      const endX = 330 + random() * 80;
      const bendA = 20 + random() * 100;
      const bendB = 20 + random() * 100;
      const broad = vein % 4 === 0;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(
        90 + random() * 70,
        startY + bendA,
        220 + random() * 60,
        endY - bendB,
        endX,
        endY,
      );
      ctx.lineCap = "round";
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = broad ? 0.08 + random() * 0.06 : 0.16 + random() * 0.18;
      ctx.lineWidth = broad ? 4 + random() * 7 : 0.6 + random() * 1.8;
      ctx.stroke();
      if (!broad && random() > 0.4) {
        ctx.globalAlpha = 0.24;
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      }
      ctx.restore();
    }
  } else if (style === "granite") {
    for (let speck = 0; speck < 2600; speck += 1) {
      const x = random() * 384;
      const y = random() * 384;
      const size = 0.4 + random() * 2.2;
      ctx.globalAlpha = 0.06 + random() * 0.28;
      ctx.fillStyle = random() > 0.72 ? "#e0d3c2" : accentColor;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;
  } else if (style === "travertine") {
    for (let band = 0; band < 28; band += 1) {
      const y = random() * 420 - 18;
      ctx.beginPath();
      const amplitude = 2 + random() * 7;
      const frequency = 0.008 + random() * 0.012;
      const phase = random() * Math.PI * 2;
      for (let x = -20; x <= 404; x += 7) {
        const wave = Math.sin(x * frequency + phase) * amplitude;
        if (x === -20) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.05 + random() * 0.13;
      ctx.lineWidth = 0.8 + random() * 4.5;
      ctx.stroke();
    }
    for (let pit = 0; pit < 110; pit += 1) {
      const x = random() * 384;
      const y = random() * 384;
      const r = 0.5 + random() * 2.2;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.8, r, random() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.12 + random() * 0.2;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (style === "slate") {
    for (let layer = 0; layer < 22; layer += 1) {
      const y = random() * 420 - 18;
      ctx.beginPath();
      for (let x = -20; x <= 404; x += 10) {
        const wave = Math.sin(x * (0.006 + random() * 0.004) + layer) * (1.5 + random() * 4);
        if (x === -20) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.04 + random() * 0.1;
      ctx.lineWidth = 0.7 + random() * 3.4;
      ctx.stroke();
    }
    for (let fleck = 0; fleck < 900; fleck += 1) {
      const x = random() * 384;
      const y = random() * 384;
      ctx.globalAlpha = 0.05 + random() * 0.18;
      ctx.fillStyle = random() > 0.6 ? "#cfe0ee" : "#0d1319";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  for (let dot = 0; dot < 360; dot += 1) {
    ctx.fillStyle = `rgba(0,0,0,${0.015 + random() * 0.02})`;
    ctx.fillRect(random() * 384, random() * 384, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  if (renderer) texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,0.95)");
  gradient.addColorStop(0.22, "rgba(255,255,255,0.48)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createMaterials() {
  woodTextures.tileA = makeWoodTexture("#c29a67", "rgba(96,58,26,ALPHA)", 42);
  woodTextures.tileB = makeWoodTexture("#5b3a24", "rgba(20,10,4,ALPHA)", 89);
  woodTextures.border = makeWoodTexture("#482919", "rgba(18,9,4,ALPHA)", 17, 2.2);
  woodTextures.table = makeWoodTexture("#21130c", "rgba(0,0,0,ALPHA)", 71, 3.4);

  materials.tileA = new THREE.MeshStandardMaterial({
    map: woodTextures.tileA,
    roughness: 0.82,
    metalness: 0.01,
  });
  materials.tileB = new THREE.MeshStandardMaterial({
    map: woodTextures.tileB,
    roughness: 0.84,
    metalness: 0.01,
  });
  materials.border = new THREE.MeshStandardMaterial({
    map: woodTextures.border,
    roughness: 0.56,
    metalness: 0.03,
  });
  materials.borderDark = new THREE.MeshStandardMaterial({
    map: woodTextures.border,
    color: 0x7e5534,
    roughness: 0.65,
    metalness: 0.02,
  });
  materials.table = new THREE.MeshStandardMaterial({
    map: woodTextures.table,
    color: 0x6c5845,
    roughness: 0.82,
    metalness: 0.01,
  });
  materials.tableFlat = new THREE.MeshStandardMaterial({
    color: 0x3a2a1d,
    roughness: 0.88,
    metalness: 0.01,
  });
  materials.ivory = new THREE.MeshPhysicalMaterial({
    color: 0xf4e7cc,
    roughness: 0.34,
    metalness: 0.015,
    clearcoat: 0.34,
    clearcoatRoughness: 0.44,
    sheen: 0.18,
    sheenColor: new THREE.Color(0xfff3da),
  });
  materials.ivoryAccent = new THREE.MeshPhysicalMaterial({
    color: 0xe6d2ab,
    roughness: 0.4,
    metalness: 0.01,
    clearcoat: 0.25,
  });
  materials.dark = new THREE.MeshPhysicalMaterial({
    color: 0x2a1912,
    roughness: 0.29,
    metalness: 0.04,
    clearcoat: 0.5,
    clearcoatRoughness: 0.36,
    sheen: 0.25,
    sheenColor: new THREE.Color(0x9d653b),
  });
  materials.darkAccent = new THREE.MeshPhysicalMaterial({
    color: 0x160d09,
    roughness: 0.38,
    metalness: 0.03,
    clearcoat: 0.38,
  });
  // Ruby is the default opponent finish: it separates from every board tone
  // and keeps its hue in shadow, where near-black pieces disappear.
  materials.ruby = new THREE.MeshPhysicalMaterial({
    color: 0xb4232c,
    roughness: 0.33,
    metalness: 0.06,
    clearcoat: 0.62,
    clearcoatRoughness: 0.3,
    sheen: 0.34,
    sheenColor: new THREE.Color(0xff9a86),
    emissive: 0x2c0508,
    emissiveIntensity: 0.3,
  });
  materials.rubyAccent = new THREE.MeshPhysicalMaterial({
    color: 0x86131b,
    roughness: 0.4,
    metalness: 0.04,
    clearcoat: 0.4,
    emissive: 0x1a0204,
    emissiveIntensity: 0.22,
  });
  materials.gold = new THREE.MeshStandardMaterial({
    color: 0xd1a84c,
    metalness: 0.85,
    roughness: 0.27,
    emissive: 0x271503,
    emissiveIntensity: 0.22,
  });
  materials.goldDark = new THREE.MeshStandardMaterial({
    color: 0x8e6426,
    metalness: 0.78,
    roughness: 0.34,
  });
  materials.eye = new THREE.MeshStandardMaterial({
    color: 0x090503,
    roughness: 0.24,
    metalness: 0.1,
  });

  const carraraLight = makeStoneTexture("#d8d2c4", "#7f817e", 601, "marble", 1.2);
  const carraraDark = makeStoneTexture("#17191c", "#aeb2b3", 602, "marble", 1.2);
  const travertineLight = makeStoneTexture("#cbb38f", "#8f7050", 603, "travertine", 1.25);
  const travertineDark = makeStoneTexture("#403a34", "#9a8b78", 604, "granite", 1.1);
  const jadeLight = makeStoneTexture("#d5ddcf", "#799887", 605, "marble", 1.2);
  const jadeDark = makeStoneTexture("#234c3e", "#9bc2ad", 606, "jade", 1.25);
  const mapleLight = makeWoodTexture("#e0c9a4", "rgba(132,88,42,ALPHA)", 607, 1.15);
  const slateDark = makeStoneTexture("#3d4854", "#9db2c4", 608, "slate", 1.2);

  // Honed, low-glare surfaces keep the board readable under the key light.
  const marbleLightMaterial = new THREE.MeshStandardMaterial({
    map: carraraLight,
    roughness: 0.58,
    metalness: 0,
  });
  const marbleDarkMaterial = new THREE.MeshStandardMaterial({
    map: carraraDark,
    roughness: 0.54,
    metalness: 0,
  });
  const travertineLightMaterial = new THREE.MeshStandardMaterial({
    map: travertineLight,
    roughness: 0.82,
    metalness: 0,
  });
  const travertineDarkMaterial = new THREE.MeshStandardMaterial({
    map: travertineDark,
    roughness: 0.78,
    metalness: 0,
  });
  const jadeLightMaterial = new THREE.MeshStandardMaterial({
    map: jadeLight,
    roughness: 0.54,
    metalness: 0,
  });
  const jadeDarkMaterial = new THREE.MeshStandardMaterial({
    map: jadeDark,
    roughness: 0.5,
    metalness: 0,
  });
  const mapleLightMaterial = new THREE.MeshStandardMaterial({
    map: mapleLight,
    roughness: 0.66,
    metalness: 0,
  });
  const slateDarkMaterial = new THREE.MeshStandardMaterial({
    map: slateDark,
    roughness: 0.7,
    metalness: 0.06,
  });

  materials.boardSets = {
    teak: { light: materials.tileA, dark: materials.tileB },
    maple: { light: mapleLightMaterial, dark: slateDarkMaterial },
    carrara: { light: marbleLightMaterial, dark: marbleDarkMaterial },
    travertine: { light: travertineLightMaterial, dark: travertineDarkMaterial },
    jade: { light: jadeLightMaterial, dark: jadeDarkMaterial },
  };
}

function addMesh(parent, geometry, material, position = null) {
  const mesh = new THREE.Mesh(geometry, material);
  if (position) mesh.position.copy(position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addBox(parent, width, height, depth, x, y, z, material) {
  return addMesh(parent, new THREE.BoxGeometry(width, height, depth), material, new THREE.Vector3(x, y, z));
}

function addLathe(parent, profile, material, segments = 64) {
  const points = profile.map(([radius, y]) => new THREE.Vector2(Math.max(0.0001, radius), y));
  const geometry = new THREE.LatheGeometry(points, segments);
  geometry.computeVertexNormals();
  return addMesh(parent, geometry, material);
}

function addGoldRing(parent, y, radius, tube = 0.012) {
  const ring = addMesh(
    parent,
    new THREE.TorusGeometry(radius, tube, 8, 64),
    materials.gold,
    new THREE.Vector3(0, y, 0),
  );
  ring.rotation.x = Math.PI / 2;
  return ring;
}

function addBaseFoot(parent, radius, height, material) {
  return addMesh(
    parent,
    new THREE.CylinderGeometry(radius, radius * 1.04, height, 56),
    material,
    new THREE.Vector3(0, height / 2, 0),
  );
}

function getSetMaterial(piece) {
  if (piece.color === "w") return materials.ivory;
  const finish = PIECE_FINISHES[state.pieceFinish] || PIECE_FINISHES.ruby;
  return materials[finish.darkMaterial] || materials.ruby;
}

function getSetAccent(piece) {
  if (piece.color === "w") return materials.ivoryAccent;
  const finish = PIECE_FINISHES[state.pieceFinish] || PIECE_FINISHES.ruby;
  return materials[finish.darkAccentMaterial] || materials.rubyAccent;
}

function createKhun(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  addLathe(group, [
    [0, 0], [0.39, 0], [0.39, 0.04], [0.36, 0.075], [0.335, 0.11],
    [0.315, 0.17], [0.29, 0.25], [0.245, 0.33], [0.19, 0.39],
    [0.155, 0.44], [0.175, 0.49], [0.25, 0.53], [0.315, 0.56],
    [0.33, 0.595], [0.29, 0.625], [0.225, 0.645], [0.205, 0.675],
    [0.27, 0.705], [0.285, 0.735], [0.25, 0.765], [0.205, 0.795],
    [0.18, 0.85], [0.145, 0.91], [0.1, 0.962], [0.045, 0.995], [0, 1.02],
  ], body);
  addGoldRing(group, 0.55, 0.31, 0.011);
  addGoldRing(group, 0.735, 0.247, 0.01);
  // A small five-point crown keeps the Court Khun distinct from the Khon's
  // spire at board distance without abandoning the carved lathe language.
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const point = addMesh(
      group,
      new THREE.ConeGeometry(0.026, 0.09, 12),
      materials.gold,
      new THREE.Vector3(Math.cos(angle) * 0.185, 0.825, Math.sin(angle) * 0.185),
    );
    point.rotation.z = Math.cos(angle) * 0.18;
    point.rotation.x = -Math.sin(angle) * 0.18;
  }
  addMesh(group, new THREE.SphereGeometry(0.038, 24, 16), materials.gold, new THREE.Vector3(0, 1.015, 0));
  return { group, height: 1.05 };
}

function createMet(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  addLathe(group, [
    [0, 0], [0.335, 0], [0.335, 0.04], [0.31, 0.075], [0.29, 0.12],
    [0.27, 0.18], [0.26, 0.25], [0.245, 0.32], [0.215, 0.385],
    [0.17, 0.435], [0.12, 0.475], [0.072, 0.505], [0.04, 0.535], [0, 0.565],
  ], body);
  addGoldRing(group, 0.315, 0.222, 0.009);
  addMesh(group, new THREE.SphereGeometry(0.031, 20, 14), materials.gold, new THREE.Vector3(0, 0.562, 0));
  return { group, height: 0.59 };
}

function createKhon(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  addLathe(group, [
    [0, 0], [0.365, 0], [0.365, 0.04], [0.335, 0.075], [0.305, 0.105],
    [0.28, 0.145], [0.25, 0.19], [0.205, 0.225], [0.165, 0.27],
    [0.145, 0.31], [0.16, 0.35], [0.205, 0.38], [0.225, 0.405],
    [0.198, 0.435], [0.16, 0.47], [0.143, 0.525], [0.126, 0.59],
    [0.105, 0.65], [0.08, 0.71], [0.055, 0.765], [0.03, 0.815], [0, 0.865],
  ], body);
  addGoldRing(group, 0.222, 0.204, 0.009);
  // A thin brim is the fastest visual cue that this is a Khon, not a Ma.
  addMesh(group, new THREE.CylinderGeometry(0.238, 0.21, 0.028, 48), body, new THREE.Vector3(0, 0.4, 0));
  addGoldRing(group, 0.397, 0.236, 0.011);
  addGoldRing(group, 0.373, 0.168, 0.008);
  addGoldRing(group, 0.455, 0.139, 0.0075);
  addMesh(group, new THREE.ConeGeometry(0.036, 0.12, 20), materials.gold, new THREE.Vector3(0, 0.915, 0));
  return { group, height: 0.975 };
}

function createMa(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  const accent = getSetAccent(piece);

  addBaseFoot(group, 0.34, 0.07, body);
  addMesh(group, new THREE.CylinderGeometry(0.325, 0.35, 0.06, 56), body, new THREE.Vector3(0, 0.1, 0));
  addGoldRing(group, 0.13, 0.305, 0.01);

  const headGroup = new THREE.Group();
  headGroup.position.y = 0.085;
  headGroup.rotation.y = piece.color === "w" ? Math.PI / 2 : -Math.PI / 2;

  const shape = new THREE.Shape();
  shape.moveTo(-0.26, 0.05);
  shape.lineTo(-0.245, 0.27);
  shape.bezierCurveTo(-0.26, 0.43, -0.18, 0.56, -0.075, 0.655);
  shape.lineTo(-0.095, 0.81);
  shape.lineTo(-0.008, 0.69);
  shape.lineTo(0.035, 0.83);
  shape.lineTo(0.075, 0.675);
  shape.bezierCurveTo(0.17, 0.66, 0.285, 0.64, 0.385, 0.585);
  shape.lineTo(0.47, 0.535);
  shape.lineTo(0.438, 0.445);
  shape.bezierCurveTo(0.33, 0.43, 0.285, 0.39, 0.235, 0.345);
  shape.lineTo(0.19, 0.285);
  shape.bezierCurveTo(0.145, 0.2, 0.155, 0.105, 0.225, 0.05);
  shape.lineTo(-0.26, 0.05);

  const headGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.018,
    bevelThickness: 0.022,
    curveSegments: 28,
  });
  headGeometry.translate(0, 0, -0.09);
  addMesh(headGroup, headGeometry, body);

  const manePositions = [
    [-0.225, 0.41, 0.018],
    [-0.19, 0.50, 0.03],
    [-0.145, 0.58, 0.02],
    [-0.09, 0.65, 0.01],
    [-0.045, 0.71, 0.0],
  ];
  for (const [x, y, z] of manePositions) {
    const mane = addMesh(
      headGroup,
      new THREE.ConeGeometry(0.032, 0.115, 5),
      materials.gold,
      new THREE.Vector3(x, y, z),
    );
    mane.rotation.z = -0.62;
    mane.rotation.x = 0.08;
    mane.scale.x = 0.55;

    const maneBack = mane.clone();
    maneBack.position.z = -z;
    headGroup.add(maneBack);
  }

  const eyeGeometry = new THREE.SphereGeometry(0.024, 16, 12);
  for (const side of [-1, 1]) {
    addMesh(headGroup, eyeGeometry, materials.eye, new THREE.Vector3(0.205, 0.575, side * 0.103));
  }

  addMesh(
    headGroup,
    new THREE.TorusGeometry(0.07, 0.008, 6, 30, Math.PI * 1.2),
    materials.gold,
    new THREE.Vector3(0.305, 0.535, 0),
  ).rotation.set(Math.PI / 2, 0, -0.3);

  const cheek = addMesh(
    headGroup,
    new THREE.CylinderGeometry(0.043, 0.043, 0.012, 22),
    materials.gold,
    new THREE.Vector3(0.055, 0.49, 0.101),
  );
  cheek.rotation.x = Math.PI / 2;

  headGroup.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  group.add(headGroup);
  return { group, height: 0.91 };
}

function createRuea(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);

  const hull = new THREE.Shape();
  hull.moveTo(-0.51, 0.265);
  hull.bezierCurveTo(-0.47, 0.115, -0.41, 0.035, -0.29, 0.035);
  hull.lineTo(0.30, 0.035);
  hull.bezierCurveTo(0.42, 0.035, 0.47, 0.115, 0.52, 0.285);
  hull.bezierCurveTo(0.465, 0.215, 0.415, 0.185, 0.33, 0.185);
  hull.lineTo(-0.335, 0.185);
  hull.bezierCurveTo(-0.42, 0.185, -0.47, 0.215, -0.51, 0.265);
  hull.closePath();

  const hullGeometry = new THREE.ExtrudeGeometry(hull, {
    depth: 0.34,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.018,
    bevelThickness: 0.02,
    curveSegments: 32,
  });
  hullGeometry.translate(0, 0, -0.17);
  addMesh(group, hullGeometry, body);

  const deck = addBox(group, 0.61, 0.024, 0.245, 0, 0.205, 0, getSetAccent(piece));
  deck.receiveShadow = true;

  const railMaterial = materials.gold;
  addBox(group, 0.72, 0.012, 0.014, 0, 0.227, 0.125, railMaterial);
  addBox(group, 0.72, 0.012, 0.014, 0, 0.227, -0.125, railMaterial);

  for (const x of [-0.39, 0.39]) {
    const post = addMesh(group, new THREE.CylinderGeometry(0.01, 0.014, 0.055, 10), railMaterial, new THREE.Vector3(x, 0.235, 0.125));
    const postBack = post.clone();
    postBack.position.z = -0.125;
    group.add(postBack);
  }

  addBox(group, 0.17, 0.072, 0.18, 0.0, 0.246, 0, getSetAccent(piece));
  addMesh(group, new THREE.CylinderGeometry(0.105, 0.115, 0.018, 32), materials.gold, new THREE.Vector3(0, 0.288, 0));
  addBox(group, 0.21, 0.012, 0.226, 0, 0.203, 0, materials.goldDark);

  const bowEyeGeometry = new THREE.TorusGeometry(0.038, 0.008, 6, 20);
  for (const x of [-0.475, 0.485]) {
    const eye = addMesh(group, bowEyeGeometry, materials.gold, new THREE.Vector3(x, 0.245, 0.17));
    eye.rotation.y = Math.PI / 2;
    const eyeBack = eye.clone();
    eyeBack.position.z = -0.17;
    group.add(eyeBack);
  }

  const bowTip = addMesh(group, new THREE.SphereGeometry(0.028, 16, 12), materials.gold, new THREE.Vector3(0.523, 0.286, 0));
  bowTip.scale.set(1.2, 0.8, 1);
  const sternTip = addMesh(group, new THREE.SphereGeometry(0.026, 16, 12), materials.gold, new THREE.Vector3(-0.513, 0.266, 0));
  sternTip.scale.set(1.2, 0.8, 1);

  return { group, height: 0.32 };
}

function createBia(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  const promoted = Boolean(piece.promoted);

  addBaseFoot(group, 0.285, 0.045, body);
  addGoldRing(group, 0.045, 0.265, 0.007);

  const shellGeometry = new THREE.SphereGeometry(0.31, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  shellGeometry.scale(1, promoted ? 0.47 : 0.54, 0.72);
  const shell = addMesh(group, shellGeometry, body, new THREE.Vector3(0, 0.045, 0));
  shell.scale.x = 1.05;

  if (!promoted) {
    const slit = addBox(group, 0.15, 0.008, 0.02, 0, 0.218, 0, materials.goldDark);
    slit.rotation.y = 0.06;
    addMesh(group, new THREE.SphereGeometry(0.018, 12, 8), materials.gold, new THREE.Vector3(-0.082, 0.219, 0));
    addMesh(group, new THREE.SphereGeometry(0.018, 12, 8), materials.gold, new THREE.Vector3(0.082, 0.219, 0));
  } else {
    addMesh(group, new THREE.TorusGeometry(0.145, 0.018, 8, 48), materials.gold, new THREE.Vector3(0, 0.207, 0))
      .rotation.x = Math.PI / 2;
    addMesh(group, new THREE.CylinderGeometry(0.115, 0.09, 0.018, 40), materials.darkAccent, new THREE.Vector3(0, 0.211, 0));
    addMesh(group, new THREE.SphereGeometry(0.033, 20, 14), materials.gold, new THREE.Vector3(0, 0.224, 0));
  }

  return { group, height: promoted ? 0.235 : 0.25 };
}

function addTournamentBase(parent, body, radius = 0.36) {
  addMesh(
    parent,
    new THREE.CylinderGeometry(radius, radius * 1.1, 0.055, 8),
    body,
    new THREE.Vector3(0, 0.0275, 0),
  );
  addMesh(
    parent,
    new THREE.CylinderGeometry(radius * 0.84, radius * 0.94, 0.055, 40),
    body,
    new THREE.Vector3(0, 0.0825, 0),
  );
  addGoldRing(parent, 0.113, radius * 0.84, 0.008);
}

/* Tournament set — every officer gets a silhouette that cannot be mistaken
   for another: crown, diamond, brimmed helmet, horse head, towered barge. */

function createTournamentKhun(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  addTournamentBase(group, body, 0.39);
  addLathe(group, [
    [0, 0.11], [0.3, 0.11], [0.265, 0.17], [0.205, 0.3],
    [0.175, 0.42], [0.185, 0.48], [0.245, 0.53], [0.265, 0.575],
    [0.235, 0.61], [0.19, 0.63], [0.225, 0.665], [0.245, 0.705],
    [0.225, 0.735], [0.185, 0.755], [0.205, 0.785], [0.16, 0.815],
    [0.09, 0.84], [0, 0.85],
  ], body);
  addGoldRing(group, 0.545, 0.257, 0.011);
  addGoldRing(group, 0.735, 0.22, 0.009);

  // Five-point crown: a tall centre prong with two shorter guards each side.
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const tall = i === 0;
    const h = tall ? 0.3 : 0.19;
    const prong = addMesh(
      group,
      new THREE.ConeGeometry(tall ? 0.045 : 0.034, h, 4),
      materials.gold,
      new THREE.Vector3(Math.cos(angle) * 0.175, 0.855 + h / 2, Math.sin(angle) * 0.175),
    );
    prong.rotation.y = -angle;
  }
  addMesh(group, new THREE.SphereGeometry(0.05, 22, 16), materials.gold, new THREE.Vector3(0, 0.905, 0));
  addMesh(group, new THREE.CylinderGeometry(0.055, 0.085, 0.07, 24), body, new THREE.Vector3(0, 0.86, 0));
  return { group, height: 1.05 };
}

function createTournamentMet(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  addTournamentBase(group, body, 0.34);
  addLathe(group, [
    [0, 0.11], [0.245, 0.11], [0.215, 0.16], [0.145, 0.27],
    [0.105, 0.38], [0.1, 0.46], [0.13, 0.52], [0.16, 0.555],
    [0.135, 0.585], [0.105, 0.61], [0.085, 0.635], [0, 0.65],
  ], body);
  addGoldRing(group, 0.545, 0.152, 0.009);
  addGoldRing(group, 0.63, 0.09, 0.007);
  const diamond = addMesh(
    group,
    new THREE.OctahedronGeometry(0.145, 0),
    body,
    new THREE.Vector3(0, 0.775, 0),
  );
  diamond.scale.set(1, 1.55, 1);
  addMesh(group, new THREE.SphereGeometry(0.032, 20, 14), materials.gold, new THREE.Vector3(0, 0.95, 0));
  return { group, height: 0.98 };
}

function createTournamentKhon(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  addTournamentBase(group, body, 0.36);
  addLathe(group, [
    [0, 0.11], [0.265, 0.11], [0.235, 0.17], [0.165, 0.29],
    [0.135, 0.38], [0.15, 0.43], [0.285, 0.465], [0.3, 0.49],
    [0.235, 0.515], [0.19, 0.525], [0, 0.53],
  ], body);
  addGoldRing(group, 0.487, 0.297, 0.011);
  // A brimmed warrior helmet: the wide disc is what separates Khon from Ma.
  const dome = addMesh(
    group,
    new THREE.ConeGeometry(0.228, 0.35, 44),
    body,
    new THREE.Vector3(0, 0.69, 0),
  );
  dome.castShadow = true;
  addGoldRing(group, 0.62, 0.155, 0.008);
  addMesh(group, new THREE.SphereGeometry(0.036, 20, 14), materials.gold, new THREE.Vector3(0, 0.878, 0));
  addMesh(group, new THREE.ConeGeometry(0.018, 0.08, 16), materials.gold, new THREE.Vector3(0, 0.925, 0));
  return { group, height: 0.97 };
}

function createTournamentMa(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  addTournamentBase(group, body, 0.35);
  addMesh(group, new THREE.CylinderGeometry(0.26, 0.31, 0.075, 40), body, new THREE.Vector3(0, 0.15, 0));

  const headGroup = new THREE.Group();
  headGroup.position.y = 0.16;
  headGroup.rotation.y = piece.color === "w" ? Math.PI / 2 : -Math.PI / 2;

  const shape = new THREE.Shape();
  shape.moveTo(-0.25, 0.04);
  shape.lineTo(-0.255, 0.3);
  shape.bezierCurveTo(-0.29, 0.5, -0.22, 0.65, -0.08, 0.73);
  shape.lineTo(-0.115, 0.92);
  shape.lineTo(-0.005, 0.795);
  shape.lineTo(0.06, 0.925);
  shape.lineTo(0.115, 0.78);
  shape.bezierCurveTo(0.27, 0.79, 0.43, 0.7, 0.52, 0.6);
  shape.lineTo(0.635, 0.545);
  shape.lineTo(0.615, 0.42);
  shape.bezierCurveTo(0.46, 0.4, 0.35, 0.335, 0.27, 0.255);
  shape.lineTo(0.21, 0.18);
  shape.bezierCurveTo(0.17, 0.1, 0.21, 0.04, 0.27, 0.04);
  shape.lineTo(-0.25, 0.04);

  const headGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.23,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.025,
    curveSegments: 30,
  });
  headGeometry.translate(0, 0, -0.115);
  addMesh(headGroup, headGeometry, body);

  for (const [x, y, angle, size] of [
    [-0.215, 0.44, -0.5, 1.05],
    [-0.185, 0.54, -0.55, 1.0],
    [-0.145, 0.63, -0.6, 0.9],
    [-0.1, 0.71, -0.65, 0.78],
  ]) {
    const mane = addMesh(
      headGroup,
      new THREE.ConeGeometry(0.04 * size, 0.145 * size, 5),
      materials.gold,
      new THREE.Vector3(x, y, 0),
    );
    mane.rotation.z = angle;
    mane.scale.x = 0.6;
    const back = mane.clone();
    back.position.z = -0.1;
    headGroup.add(back);
  }

  const eyeGeometry = new THREE.SphereGeometry(0.03, 16, 12);
  for (const side of [-1, 1]) {
    addMesh(headGroup, eyeGeometry, materials.eye, new THREE.Vector3(0.235, 0.63, side * 0.13));
  }
  addBox(headGroup, 0.28, 0.028, 0.028, 0.33, 0.49, 0.13, materials.gold);
  addBox(headGroup, 0.28, 0.028, 0.028, 0.33, 0.49, -0.13, materials.gold);
  addMesh(
    headGroup,
    new THREE.TorusGeometry(0.075, 0.009, 6, 30, Math.PI * 1.25),
    materials.gold,
    new THREE.Vector3(0.35, 0.58, 0),
  ).rotation.set(Math.PI / 2, 0, -0.25);

  headGroup.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  group.add(headGroup);
  return { group, height: 1.08 };
}

function createTournamentRuea(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  const accent = getSetAccent(piece);

  const hull = new THREE.Shape();
  hull.moveTo(-0.54, 0.255);
  hull.bezierCurveTo(-0.5, 0.105, -0.43, 0.03, -0.3, 0.03);
  hull.lineTo(0.3, 0.03);
  hull.bezierCurveTo(0.43, 0.03, 0.5, 0.105, 0.545, 0.275);
  hull.bezierCurveTo(0.48, 0.21, 0.42, 0.18, 0.33, 0.18);
  hull.lineTo(-0.34, 0.18);
  hull.bezierCurveTo(-0.43, 0.18, -0.49, 0.21, -0.54, 0.255);
  hull.closePath();

  const hullGeometry = new THREE.ExtrudeGeometry(hull, {
    depth: 0.36,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.018,
    bevelThickness: 0.02,
    curveSegments: 32,
  });
  hullGeometry.translate(0, 0, -0.18);
  addMesh(group, hullGeometry, body);

  addBox(group, 0.66, 0.03, 0.26, 0, 0.2, 0, accent);
  addBox(group, 0.78, 0.02, 0.02, 0, 0.228, 0.135, materials.gold);
  addBox(group, 0.78, 0.02, 0.02, 0, 0.228, -0.135, materials.gold);

  // Crenellated cabin — the rook read, kept inside the barge silhouette.
  addBox(group, 0.34, 0.3, 0.24, 0, 0.35, 0, accent);
  addBox(group, 0.38, 0.045, 0.28, 0, 0.52, 0, materials.gold);
  for (const x of [-0.125, 0, 0.125]) {
    addBox(group, 0.085, 0.12, 0.24, x, 0.6, 0, body);
  }
  addBox(group, 0.085, 0.05, 0.28, 0, 0.545, 0, materials.gold);

  const bowEyeGeometry = new THREE.TorusGeometry(0.04, 0.009, 6, 22);
  for (const x of [-0.5, 0.505]) {
    const eye = addMesh(group, bowEyeGeometry, materials.gold, new THREE.Vector3(x, 0.245, 0.18));
    eye.rotation.y = Math.PI / 2;
    const eyeBack = eye.clone();
    eyeBack.position.z = -0.18;
    group.add(eyeBack);
  }
  addMesh(group, new THREE.SphereGeometry(0.03, 16, 12), materials.gold, new THREE.Vector3(0.548, 0.278, 0));
  addMesh(group, new THREE.SphereGeometry(0.028, 16, 12), materials.gold, new THREE.Vector3(-0.542, 0.258, 0));
  return { group, height: 0.67 };
}

function createTournamentBia(piece) {
  const group = new THREE.Group();
  const body = getSetMaterial(piece);
  const promoted = Boolean(piece.promoted);

  addTournamentBase(group, body, promoted ? 0.33 : 0.3);
  const shellGeometry = new THREE.SphereGeometry(0.32, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  shellGeometry.scale(1, promoted ? 0.62 : 0.46, 0.74);
  addMesh(group, shellGeometry, body, new THREE.Vector3(0, 0.115, 0));
  addGoldRing(group, 0.135, 0.3, 0.008);

  if (promoted) {
    addMesh(group, new THREE.TorusGeometry(0.16, 0.02, 8, 48), materials.gold, new THREE.Vector3(0, 0.315, 0))
      .rotation.x = Math.PI / 2;
    addMesh(group, new THREE.CylinderGeometry(0.12, 0.095, 0.02, 40), getSetAccent(piece), new THREE.Vector3(0, 0.318, 0));
    addMesh(group, new THREE.ConeGeometry(0.055, 0.2, 20), materials.gold, new THREE.Vector3(0, 0.42, 0));
    addMesh(group, new THREE.SphereGeometry(0.03, 18, 12), materials.gold, new THREE.Vector3(0, 0.525, 0));
  } else {
    addBox(group, 0.16, 0.012, 0.024, 0, 0.262, 0, materials.goldDark);
    addMesh(group, new THREE.SphereGeometry(0.02, 12, 8), materials.gold, new THREE.Vector3(-0.088, 0.263, 0));
    addMesh(group, new THREE.SphereGeometry(0.02, 12, 8), materials.gold, new THREE.Vector3(0.088, 0.263, 0));
  }

  return { group, height: promoted ? 0.55 : 0.28 };
}

const PIECE_BUILDERS = {
  court: {
    K: createKhun,
    M: createMet,
    B: createKhon,
    N: createMa,
    R: createRuea,
    P: createBia,
  },
  tournament: {
    K: createTournamentKhun,
    M: createTournamentMet,
    B: createTournamentKhon,
    N: createTournamentMa,
    R: createTournamentRuea,
    P: createTournamentBia,
  },
};

function createPieceGroup(piece) {
  const builders = PIECE_BUILDERS[state.pieceSet] || PIECE_BUILDERS.court;
  const builder = builders[piece.type] || builders.P;
  const created = builder(piece);

  const group = created.group;
  group.userData.height = created.height;
  group.userData.visualKey = `${piece.type}${piece.promoted ? "+" : ""}`;
  group.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  return group;
}

function addBoardLabel(parent, text, x, z, rotation = 0) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = "#d8bc7d";
  ctx.font = "600 66px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, 68);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.28), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = rotation;
  mesh.position.set(x, WORLD.boardTop + 0.002, z);
  parent.add(mesh);
  return mesh;
}

function buildBoard() {
  boardRoot = new THREE.Group();
  boardRoot.name = "carved-makruk-board";
  scene.add(boardRoot);

  tableMesh = new THREE.Mesh(
    new THREE.CircleGeometry(16, 96),
    materials.table,
  );
  tableMesh.rotation.x = -Math.PI / 2;
  tableMesh.position.y = -0.015;
  tableMesh.receiveShadow = true;
  scene.add(tableMesh);

  addBox(boardRoot, 9.45, 0.18, 9.45, 0, 0.09, 0, materials.border).receiveShadow = true;
  addBox(boardRoot, 9.02, 0.12, 9.02, 0, 0.24, 0, materials.borderDark);
  addBox(boardRoot, 8.58, 0.11, 8.58, 0, 0.355, 0, materials.border);
  addBox(boardRoot, 8.18, 0.05, 8.18, 0, 0.425, 0, materials.borderDark);

  tileMeshes = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const isLight = (row + col) % 2 === 0;
      const tile = addBox(
        boardRoot,
        0.985,
        0.032,
        0.985,
        col - 3.5,
        0.447,
        row - 3.5,
        boardTileMaterial(isLight),
      );
      tile.receiveShadow = true;
      tile.castShadow = false;
      tile.userData.square = squareIndex(row, col);
      tile.userData.isLight = isLight;
      tileMeshes.push(tile);
    }
  }

  const trim = materials.goldDark;
  addBox(boardRoot, 8.28, 0.012, 0.018, 0, WORLD.boardTop - 0.004, 4.2, trim);
  addBox(boardRoot, 8.28, 0.012, 0.018, 0, WORLD.boardTop - 0.004, -4.2, trim);
  addBox(boardRoot, 0.018, 0.012, 8.28, 4.2, WORLD.boardTop - 0.004, 0, trim);
  addBox(boardRoot, 0.018, 0.012, 8.28, -4.2, WORLD.boardTop - 0.004, 0, trim);

  for (const [x, z] of [[-4.34, -4.34], [4.34, -4.34], [-4.34, 4.34], [4.34, 4.34]]) {
    const stud = addMesh(
      boardRoot,
      new THREE.OctahedronGeometry(0.075, 0),
      materials.gold,
      new THREE.Vector3(x, WORLD.boardTop - 0.02, z),
    );
    stud.rotation.y = Math.PI / 4;
  }

  for (let col = 0; col < 8; col += 1) {
    addBoardLabel(boardRoot, FILES[col], col - 3.5, 4.34);
    addBoardLabel(boardRoot, String(8 - col), -4.34, col - 3.5, Math.PI / 2);
  }

  pickables = [];
  const pickMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const picker = new THREE.Mesh(new THREE.PlaneGeometry(0.985, 0.985), pickMaterial);
      picker.rotation.x = -Math.PI / 2;
      picker.position.set(col - 3.5, WORLD.boardTop + 0.02, row - 3.5);
      picker.userData.square = squareIndex(row, col);
      boardRoot.add(picker);
      pickables.push(picker);
    }
  }

  pieceLayer = new THREE.Group();
  pieceLayer.name = "makruk-pieces";
  scene.add(pieceLayer);

  highlightLayer = new THREE.Group();
  highlightLayer.name = "move-highlights";
  scene.add(highlightLayer);

  lastMoveLayer = new THREE.Group();
  lastMoveLayer.name = "last-move-marks";
  scene.add(lastMoveLayer);
}

function createEnvironment() {
  const hemisphere = new THREE.HemisphereLight(0xffe9c8, 0x1a1008, 1.38);
  scene.add(hemisphere);

  const key = new THREE.DirectionalLight(0xffdfae, 2.45);
  key.position.set(6.2, 11.5, 7.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 7;
  key.shadow.camera.bottom = -7;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.bias = -0.00035;
  key.shadow.normalBias = 0.018;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8cb4df, 0.7);
  fill.position.set(-7, 5, -6);
  scene.add(fill);

  // A camera-side fill keeps the near faces of dark and red pieces readable.
  const frontFillDirectional = new THREE.DirectionalLight(0xffe0b8, 0.58);
  frontFillDirectional.position.set(1.5, 6.5, 10);
  scene.add(frontFillDirectional);

  const warmRim = new THREE.PointLight(0xffa956, 18, 14, 2);
  warmRim.position.set(-4.5, 3.7, -4);
  scene.add(warmRim);

  const frontFill = new THREE.PointLight(0xffd8a2, 10, 13, 2);
  frontFill.position.set(3.5, 3, 5);
  scene.add(frontFill);
}

function createDust() {
  const count = 100;
  const positions = new Float32Array(count * 3);
  const random = seededRandom(128);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (random() - 0.5) * 18;
    positions[i * 3 + 1] = 0.7 + random() * 7;
    positions[i * 3 + 2] = (random() - 0.5) * 18;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xe0bc75,
    size: 0.025,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  dust = new THREE.Points(geometry, material);
  dust.name = "gold-dust";
  scene.add(dust);
}

function initScene() {
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: dom.scene,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch (error) {
    console.error(error);
    dom.sceneFallback.hidden = false;
    dom.sceneLoader.classList.add("is-hidden");
    return false;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(dom.boardStage.clientWidth, dom.boardStage.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0705);
  scene.fog = new THREE.Fog(0x0a0705, 15, 31);

  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.panSpeed = 0.72;
  controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
  controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  controls.minDistance = 9.5;
  controls.maxDistance = 34;
  controls.minPolarAngle = 0.32;
  controls.maxPolarAngle = Math.PI * 0.455;
  controls.target.set(0, 0.35, 0);
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.65;

  raycaster = new THREE.Raycaster();
  clock = new THREE.Clock();
  glowTexture = makeGlowTexture();

  createMaterials();
  createEnvironment();
  buildBoard();
  createDust();
  resetCamera();
  resizeScene();

  const observer = new ResizeObserver(() => resizeScene());
  observer.observe(dom.boardStage);

  renderer.setAnimationLoop(renderFrame);
  sceneReady = true;
  window.setTimeout(() => {
    dom.sceneLoader.classList.add("is-hidden");
    // Remove it from hit-testing entirely once the fade has had time to settle.
    window.setTimeout(() => {
      dom.sceneLoader.hidden = true;
    }, 520);
  }, 340);
  window.__MAKRUK_READY__ = true;
  return true;
}

function aspectDistanceMultiplier(aspect) {
  return Math.max(1, 1.03 / Math.min(1.3, Math.max(0.55, aspect)));
}

function setPanMode(enabled, { announce = true } = {}) {
  panMode = Boolean(enabled);
  if (dom.panToggle) {
    dom.panToggle.classList.toggle("is-active", panMode);
    dom.panToggle.setAttribute("aria-pressed", String(panMode));
  }
  if (renderer) renderer.domElement.classList.toggle("is-pan-mode", panMode);
  if (controls) {
    controls.enablePan = true;
    controls.mouseButtons.LEFT = panMode ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
    controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
    controls.touches.ONE = panMode ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  }
  if (announce) {
    showToast(panMode ? t("moveViewOn") : t("moveViewOff"), "info", panMode ? "✥" : "↻");
  }
}

function setBoardFocus(enabled, { announce = true } = {}) {
  boardFocus = Boolean(enabled);
  document.body.classList.toggle("board-focus", boardFocus);
  if (dom.fullSizeToggle) {
    dom.fullSizeToggle.classList.toggle("is-active", boardFocus);
    dom.fullSizeToggle.setAttribute("aria-pressed", String(boardFocus));
    dom.fullSizeToggle.title = boardFocus
      ? t("exitFullSize")
      : `${t("fullSize")} / กระดานเต็มจอ`;
    const label = dom.fullSizeToggle.querySelector("span:last-child");
    if (label) label.textContent = boardFocus ? t("exitFullSize") : t("fullSize");
  }
  window.setTimeout(() => {
    resizeScene();
    resetCamera();
  }, 180);
  if (announce) {
    showToast(boardFocus ? t("fullSizeOn") : t("fullSizeOff"), "info", boardFocus ? "⛶" : "▣");
  }
}

function resetCamera() {
  if (!camera || !controls) return;
  controls.target.set(0, 0.35, 0);
  const aspect = Math.max(0.55, dom.boardStage.clientWidth / Math.max(1, dom.boardStage.clientHeight));
  const focusZoom = boardFocus ? (aspect < 1 ? 0.87 : 0.85) : 1;
  const position = defaultCameraPosition.clone().multiplyScalar(aspectDistanceMultiplier(aspect) * focusZoom);
  camera.position.copy(position);
  camera.lookAt(controls.target);
  lastViewportAspect = aspect;
  controls.update();
}

function resizeScene() {
  if (!renderer || !camera) return;
  const width = Math.max(1, dom.boardStage.clientWidth);
  const height = Math.max(1, dom.boardStage.clientHeight);
  const aspect = width / height;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  if (lastViewportAspect && Math.abs(aspect - lastViewportAspect) > 0.025) {
    const offset = camera.position.clone().sub(controls.target);
    offset.multiplyScalar(aspectDistanceMultiplier(aspect) / aspectDistanceMultiplier(lastViewportAspect));
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }
  lastViewportAspect = aspect;
}

function renderFrame() {
  if (!renderer || !scene || !camera) return;
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  controls.update();

  if (dust) {
    dust.rotation.y += delta * 0.012;
    dust.position.y = Math.sin(elapsed * 0.22) * 0.04;
  }

  for (const [id, entry] of Array.from(meshById.entries())) {
    const group = entry.group;
    if (entry.removing) {
      entry.removeTime += delta;
      const progress = Math.min(1, entry.removeTime / 0.38);
      const scale = Math.max(0.001, 1 - progress * 1.18);
      group.scale.setScalar(scale);
      group.rotation.y += delta * 3.6;
      group.position.y = WORLD.boardTop - progress * 0.22;
      if (progress >= 1) {
        pieceLayer.remove(group);
        disposeGroup(group);
        meshById.delete(id);
      }
      continue;
    }

    if (entry.spawn < 1) {
      entry.spawn = Math.min(1, entry.spawn + delta * 4.8);
      const eased = 1 - Math.pow(1 - entry.spawn, 3);
      group.scale.setScalar(0.82 + eased * 0.18);
      if (entry.spawn >= 1) group.scale.setScalar(1);
    }

    if (entry.animation) {
      entry.animation.time += delta * 4.6;
      const progress = Math.min(1, entry.animation.time);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const start = entry.animation.start;
      const target = entry.animation.target;
      group.position.x = start.x + (target.x - start.x) * eased;
      group.position.z = start.z + (target.z - start.z) * eased;
      group.position.y = WORLD.boardTop + Math.sin(progress * Math.PI) * 0.19;
      group.rotation.x = Math.sin(progress * Math.PI) * 0.055;
      if (progress >= 1) {
        group.position.copy(target);
        group.rotation.x = 0;
        entry.animation = null;
      }
    }
  }

  for (const object of highlightLayer ? highlightLayer.children : []) {
    if (!object.userData.pulse) continue;
    const pulse = object.userData.pulse;
    const amount = 0.5 + Math.sin(elapsed * 3.2 + pulse.phase) * 0.5;
    object.material.opacity = pulse.minOpacity + amount * (pulse.maxOpacity - pulse.minOpacity);
    if (pulse.scale > 0) object.scale.setScalar(1 + amount * pulse.scale);
  }

  renderer.render(scene, camera);
}

function disposeGroup(group) {
  group.traverse((object) => {
    if (object.isMesh || object.isPoints || object.isSprite) {
      if (object.geometry) object.geometry.dispose();
    }
  });
}

function clearGroup(group) {
  if (!group) return;
  while (group.children.length) {
    const child = group.children.pop();
    disposeGroup(child);
  }
}

function addGlowDot(position, color, radius = 0.145) {
  const dot = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 34),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }),
  );
  dot.rotation.x = -Math.PI / 2;
  dot.position.copy(position);
  dot.position.y = WORLD.boardTop + 0.025;
  dot.userData.pulse = { phase: Math.random() * Math.PI * 2, minOpacity: 0.32, maxOpacity: 0.75, scale: 0.06 };
  highlightLayer.add(dot);

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color,
      transparent: true,
      opacity: 0.54,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  glow.scale.setScalar(0.72);
  glow.position.copy(dot.position);
  glow.position.y += 0.012;
  glow.userData.pulse = { phase: dot.userData.pulse.phase, minOpacity: 0.22, maxOpacity: 0.52, scale: 0.08 };
  highlightLayer.add(glow);
}

function addCaptureRing(position, color = 0xff7866) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.355, 0.019, 10, 52),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.copy(position);
  ring.position.y = WORLD.boardTop + 0.035;
  ring.userData.pulse = { phase: Math.random() * Math.PI * 2, minOpacity: 0.56, maxOpacity: 0.98, scale: 0.02 };
  highlightLayer.add(ring);

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  glow.scale.setScalar(0.92);
  glow.position.copy(ring.position);
  glow.position.y += 0.02;
  glow.userData.pulse = { phase: ring.userData.pulse.phase, minOpacity: 0.15, maxOpacity: 0.4, scale: 0.04 };
  highlightLayer.add(glow);
}

function renderHighlights() {
  if (!sceneReady) return;
  clearGroup(highlightLayer);
  clearGroup(lastMoveLayer);

  if (state.lastMove) {
    for (const index of [state.lastMove.from, state.lastMove.to]) {
      const marker = new THREE.Mesh(
        new THREE.PlaneGeometry(0.94, 0.94),
        new THREE.MeshBasicMaterial({
          color: 0xd6b36a,
          transparent: true,
          opacity: 0.075,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      marker.rotation.x = -Math.PI / 2;
      marker.position.copy(worldPosition(index));
      marker.position.y = WORLD.boardTop + 0.012;
      lastMoveLayer.add(marker);
    }
  }

  if (state.selected !== null) {
    const selectedPosition = worldPosition(state.selected);
    const selectionRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.382, 0.012, 8, 60),
      new THREE.MeshBasicMaterial({
        color: 0xf3d58e,
        transparent: true,
        opacity: 0.86,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    selectionRing.rotation.x = Math.PI / 2;
    selectionRing.position.copy(selectedPosition);
    selectionRing.position.y = WORLD.boardTop + 0.032;
    selectionRing.userData.pulse = { phase: 0.6, minOpacity: 0.55, maxOpacity: 0.98, scale: 0.01 };
    highlightLayer.add(selectionRing);
  }

  if (state.assist && state.selected !== null) {
    for (const move of state.selectedMoves) {
      const position = worldPosition(move.to);
      if (move.captured) addCaptureRing(position);
      else addGlowDot(position, 0x6fe0a0);
    }
  }

  if (state.inCheck && state.status === "playing") {
    const king = findKing(state.board, state.turn);
    if (king >= 0) addCaptureRing(worldPosition(king), 0xff4d3d);
  }
}

function syncPieceMeshes({ animate = true } = {}) {
  if (!sceneReady) return;
  const seen = new Set();

  for (let index = 0; index < 64; index += 1) {
    const piece = state.board[index];
    if (!piece) continue;
    seen.add(piece.id);
    const visualKey = `${piece.type}${piece.promoted ? "+" : ""}`;
    let entry = meshById.get(piece.id);

    if (entry && entry.visualKey !== visualKey) {
      pieceLayer.remove(entry.group);
      disposeGroup(entry.group);
      meshById.delete(piece.id);
      entry = null;
    }

    if (!entry) {
      const group = createPieceGroup(piece);
      group.position.copy(worldPosition(index));
      group.scale.setScalar(animate ? 0.82 : 1);
      pieceLayer.add(group);
      entry = {
        group,
        visualKey,
        spawn: animate ? 0 : 1,
        animation: null,
        removing: false,
        removeTime: 0,
      };
      meshById.set(piece.id, entry);
    } else {
      const target = worldPosition(index);
      const distance = entry.group.position.distanceTo(target);
      if (distance > 0.02) {
        entry.animation = {
          start: entry.group.position.clone(),
          target,
          time: 0,
        };
        entry.group.rotation.x = 0;
      }
    }
  }

  for (const [id, entry] of Array.from(meshById.entries())) {
    if (seen.has(id) || entry.removing) continue;
    entry.removing = true;
    entry.removeTime = 0;
    entry.animation = null;
  }
}

function rebuildPieceMeshes() {
  if (!sceneReady) return;
  for (const entry of meshById.values()) {
    pieceLayer.remove(entry.group);
    disposeGroup(entry.group);
  }
  meshById.clear();
  syncPieceMeshes({ animate: false });
  renderHighlights();
}

/* =========================================================================
   Rendering and UI
   ========================================================================= */

function applyStaticTranslations() {
  document.documentElement.lang = state.lang === "th" ? "th" : "en";
  document.title = state.lang === "th"
    ? "หมากรุกไทย 3D — สถาบันหมากรุกไทยและสตูดิโอผู้เริ่มต้น"
    : "Makruk 3D — Thai Chess Academy & Beginner Studio";

  $$("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const value = t(key);
    if (value) element.textContent = value;
  });

  $$("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });

  $$("[data-lang-label]").forEach((element) => {
    element.classList.toggle("is-active", element.dataset.langLabel === state.lang);
  });

  dom.glossaryTitle.textContent = t("rulesButton");

  if (boardFocus && dom.fullSizeToggle) {
    const label = dom.fullSizeToggle.querySelector("span:last-child");
    if (label) label.textContent = t("exitFullSize");
    dom.fullSizeToggle.title = t("exitFullSize");
  }
}

function updateTurnUI() {
  const isWhite = state.turn === "w";
  dom.turnStone.classList.toggle("is-black", !isWhite);

  let turnText;
  if (state.status === "checkmate") {
    turnText = state.winner === "w" ? t("resultWhiteWins") : t("resultBlackWins");
  } else if (state.status === "stalemate") {
    turnText = t("resultStalemateTitle");
  } else if (state.status === "draw") {
    turnText = t("resultDrawTitle");
  } else if (state.aiThinking) {
    turnText = t("turnThinking");
  } else if (state.inCheck) {
    turnText = isWhite ? t("turnWhiteCheck") : t("turnBlackCheck");
  } else {
    turnText = isWhite ? t("turnWhite") : t("turnBlack");
  }
  dom.turnText.textContent = turnText;
  dom.checkChip.hidden = !(state.inCheck && state.status === "playing");
  dom.checkChip.textContent = t("check");
  dom.aiChip.hidden = !state.aiThinking;
  if (dom.aiChipLevel) {
    dom.aiChipLevel.textContent = `${t(AI_LEVELS[state.botLevel].nameKey)} · ${(state.thinkTimeMs / 1000).toFixed(1)}s`;
  }
  const fullMove = Math.floor(state.history.length / 2) + 1;
  dom.moveCounter.textContent = t("moveLabel", { n: fullMove });
}

function renderRecordStatus() {
  dom.recordStatusDot.classList.remove("is-warning", "is-idle");
  if (state.aiThinking) {
    dom.recordStatus.textContent = t("thinkingShort");
    dom.recordStatusDot.classList.add("is-idle");
    return;
  }
  if (state.status === "checkmate") {
    dom.recordStatus.textContent = t("checkmateShort");
    dom.recordStatusDot.classList.add("is-warning");
    return;
  }
  if (state.status === "stalemate") {
    dom.recordStatus.textContent = t("stalemateShort");
    return;
  }
  if (state.status === "draw") {
    dom.recordStatus.textContent = t("drawShort");
    return;
  }
  if (state.inCheck) {
    dom.recordStatus.textContent = state.turn === "w" ? t("turnWhiteCheck") : t("turnBlackCheck");
    dom.recordStatusDot.classList.add("is-warning");
    return;
  }
  dom.recordStatus.textContent = t("recordReady");
}

function renderMoveList() {
  dom.moveList.innerHTML = "";
  dom.plyCount.textContent = String(state.history.length);

  if (state.history.length === 0) {
    const empty = document.createElement("p");
    empty.className = "move-empty";
    empty.textContent = t("recordEmpty");
    dom.moveList.appendChild(empty);
    return;
  }

  state.history.forEach((move, index) => {
    const row = document.createElement("div");
    row.className = "move-row";
    if (index === state.history.length - 1) row.classList.add("is-last");

    const number = document.createElement("span");
    number.className = "move-no";
    number.textContent = move.color === "w" ? `${Math.floor(index / 2) + 1}.` : "·";

    const stone = document.createElement("span");
    stone.className = `move-stone${move.color === "b" ? " is-black" : ""}`;
    stone.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.className = "move-text";
    const meta = pieceMeta({ type: move.type, promoted: move.promoted });
    text.textContent = `${meta.name[state.lang]} ${coordinateOf(move.from)}`;
    if (move.captured) {
      const captureSpan = document.createElement("span");
      captureSpan.className = "move-capture";
      captureSpan.textContent = " ×";
      text.appendChild(captureSpan);
    } else {
      text.append(document.createTextNode(" –"));
    }
    text.append(document.createTextNode(` ${coordinateOf(move.to)}`));
    if (move.promotionThisMove) {
      const promotionSpan = document.createElement("span");
      promotionSpan.className = "move-check";
      promotionSpan.textContent = " ↑";
      text.appendChild(promotionSpan);
    }
    if (move.check) {
      const checkSpan = document.createElement("span");
      checkSpan.className = "move-check";
      checkSpan.textContent = ` ${move.mate ? "#" : "+"}`;
      text.appendChild(checkSpan);
    }

    row.append(number, stone, text);
    dom.moveList.appendChild(row);
  });

  dom.moveList.scrollTop = dom.moveList.scrollHeight;
}

function renderCaptures() {
  const renderSide = (target, list) => {
    if (!list.length) {
      target.textContent = "—";
      return;
    }
    target.textContent = list.map((piece) => pieceGlyph(piece)).join(" ");
  };
  renderSide(dom.capturedByWhite, state.captured.w);
  renderSide(dom.capturedByBlack, state.captured.b);
}

function tutorMarkupForPiece(piece, moves) {
  const meta = pieceMeta(piece);
  const otherLang = state.lang === "en" ? "th" : "en";
  const legalCount = moves.length;
  const captureCount = moves.filter((move) => move.captured).length;
  const assistNote = state.assist ? "" : `
    <div class="tutor-stat is-off">
      <strong>—</strong>
      <span>${t("assistDisabled")}</span>
    </div>`;
  return `
    <div class="tutor-identity">
      <span class="tutor-piece-icon" aria-hidden="true">${meta.glyph}</span>
      <span class="tutor-name">
        <strong>${meta.name[state.lang]}</strong>
        <small>${meta.name[otherLang]} · ${meta.phonetic}</small>
        <button class="tutor-3d-link" type="button" data-tutor-view3d="${pieceViewerKey(piece)}" aria-label="${t("viewIn3D")}: ${meta.name[state.lang]}">
          <span aria-hidden="true">◈</span>
          <span>${t("viewIn3D")}</span>
        </button>
      </span>
    </div>
    <div class="tutor-movement">
      <strong>${t("movement")}</strong>
      <span>${meta.movement[state.lang]}</span>
    </div>
    <div class="tutor-stats">
      <div class="tutor-stat">
        <strong>${legalCount}</strong>
        <span>${t("legalMoves")}</span>
      </div>
      <div class="tutor-stat${captureCount ? " is-capture" : ""}">
        <strong>${captureCount}</strong>
        <span>${t("captures")}</span>
      </div>
      ${assistNote}
    </div>`;
}

function updateTutor() {
  if (state.selected !== null && state.board[state.selected]) {
    const piece = state.board[state.selected];
    dom.tutorEmpty.hidden = true;
    dom.tutorContent.hidden = false;
    dom.tutorContent.innerHTML = tutorMarkupForPiece(piece, state.selectedMoves);
    return;
  }

  dom.tutorEmpty.hidden = false;
  dom.tutorContent.hidden = true;
  dom.tutorContent.innerHTML = "";
}

function formatThinkTime(ms) {
  return t("thinkTimeValue", { seconds: (ms / 1000).toFixed(1) });
}

function syncBotControls() {
  if (dom.botSettings) dom.botSettings.hidden = state.mode !== "ai";
  if (dom.botLevelControl) {
    dom.botLevelControl.setAttribute("aria-label", t("botLevelLabel"));
    dom.botLevelControl.querySelectorAll("[data-bot-level]").forEach((button) => {
      const active = button.dataset.botLevel === state.botLevel;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  if (dom.thinkTimeInput) {
    dom.thinkTimeInput.setAttribute("aria-label", t("thinkTimeLabel"));
    dom.thinkTimeInput.value = String(state.thinkTimeMs);
    dom.thinkTimeInput.setAttribute("aria-valuetext", formatThinkTime(state.thinkTimeMs));
  }
  if (dom.thinkTimeValue) dom.thinkTimeValue.textContent = formatThinkTime(state.thinkTimeMs);
}

function applyBotLevel(level, { persist = true } = {}) {
  if (!AI_LEVELS[level]) return;
  state.botLevel = level;
  state.thinkTimeMs = AI_LEVELS[level].defaultMs;
  syncBotControls();
  if (persist) savePreferences();
}

function applyThinkTime(ms, { persist = true } = {}) {
  const clamped = Math.min(
    THINK_TIME_MAX_MS,
    Math.max(THINK_TIME_MIN_MS, Math.round(Number(ms) / THINK_TIME_STEP_MS) * THINK_TIME_STEP_MS),
  );
  state.thinkTimeMs = clamped;
  syncBotControls();
  if (persist) savePreferences();
}

function updateModeUI() {
  dom.modeCards.forEach((card) => {
    const active = card.dataset.mode === state.mode;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-pressed", String(active));
  });
  syncBotControls();
}

function updateAssistUI() {
  dom.assistToggle.checked = state.assist;
  dom.assistPill.classList.toggle("is-off", !state.assist);
  const label = dom.assistPill.querySelector("span:last-child");
  if (label) label.textContent = state.assist ? t("assistOn") : t("assistOff");
  const statusLabel = dom.assistToggle.closest(".switch")?.querySelector(".sr-only");
  if (statusLabel) statusLabel.textContent = t("assistToggleLabel");
}

function updateSoundUI() {
  dom.soundToggle.setAttribute("aria-pressed", String(state.sound));
  dom.soundToggle.setAttribute("aria-label", state.sound ? t("toastSoundOn") : t("toastSoundOff"));
  const label = dom.soundToggle.querySelector(".icon-label");
  if (label) label.textContent = t("soundLabel");
  audio.enabled = state.sound;
}

function effectiveStageColor() {
  if (state.stageColor !== "auto") return state.stageColor;
  return `#${THEMES[state.theme].scene.background.toString(16).padStart(6, "0")}`;
}

function applyStageAppearance() {
  if (!scene) return;
  const themeScene = THEMES[state.theme].scene;
  const custom = state.stageColor !== "auto";
  const background = new THREE.Color(custom ? state.stageColor : themeScene.background);
  const hsl = {};
  background.getHSL(hsl);
  const luminance = background.r * 0.2126 + background.g * 0.7152 + background.b * 0.0722;

  scene.background.copy(background);
  if (scene.fog) scene.fog.color.copy(background);
  document.documentElement.style.setProperty(
    "--stage-vignette-opacity",
    luminance > 0.45 ? "0.36" : "1",
  );

  if (dust) {
    dust.material.opacity = luminance > 0.45 ? 0.16 : 0.42;
    dust.material.color.setHex(themeScene.dust);
  }

  if (tableMesh && materials.tableFlat) {
    if (custom) {
      const tableColor = background.clone();
      tableColor.getHSL(hsl);
      tableColor.setHSL(
        hsl.h,
        Math.min(0.55, Math.max(0.06, hsl.s * 0.82)),
        hsl.l > 0.5 ? Math.max(0.28, hsl.l - 0.17) : Math.min(0.5, hsl.l + 0.1),
      );
      materials.tableFlat.color.copy(tableColor);
      tableMesh.material = materials.tableFlat;
    } else {
      tableMesh.material = materials.table;
      materials.table.color.setHex(themeScene.table);
    }
  }
}

function applyTheme(theme, { persist = false } = {}) {
  const nextTheme = THEMES[theme] ? theme : "lacquer";
  state.theme = nextTheme;
  document.documentElement.dataset.theme = nextTheme;
  applyStageAppearance();
  if (persist) savePreferences();
}

function applyStageColor(color, { persist = false } = {}) {
  if (color === "auto") {
    state.stageColor = "auto";
  } else if (/^#[0-9a-f]{6}$/i.test(String(color))) {
    state.stageColor = String(color).toLowerCase();
  } else {
    state.stageColor = "auto";
  }
  applyStageAppearance();
  if (persist) savePreferences();
}

function applyTextSize(size, { persist = false } = {}) {
  const nextSize = TEXT_SIZES[size] ? size : "medium";
  state.textSize = nextSize;
  document.documentElement.dataset.textSize = nextSize;
  if (persist) savePreferences();
}

function boardTileMaterial(isLight) {
  const set = materials.boardSets?.[state.boardMaterial] || materials.boardSets?.teak;
  if (!set) return materials.tileA;
  return state.boardStyle === "checkered" && !isLight ? set.dark : set.light;
}

function applyBoardTiles() {
  for (const tile of tileMeshes) {
    tile.material = boardTileMaterial(tile.userData.isLight);
  }
}

function applyBoardStyle(style, { persist = false } = {}) {
  const nextStyle = BOARD_STYLES[style] ? style : "checkered";
  state.boardStyle = nextStyle;
  applyBoardTiles();
  if (persist) savePreferences();
}

function applyBoardMaterial(materialKey, { persist = false } = {}) {
  const nextMaterial = BOARD_MATERIALS[materialKey] ? materialKey : "teak";
  state.boardMaterial = nextMaterial;
  applyBoardTiles();
  if (persist) savePreferences();
}

function refreshPieceGeometry() {
  rebuildPieceMeshes();
  if (!dom.piecePreviewModal.hidden && piecePreview.key) {
    fitPiecePreview(piecePreview.key);
  }
}

function applyPieceSet(setKey, { persist = false } = {}) {
  state.pieceSet = PIECE_SETS[setKey] ? setKey : "court";
  refreshPieceGeometry();
  if (persist) savePreferences();
}

function applyPieceFinish(finishKey, { persist = false } = {}) {
  state.pieceFinish = PIECE_FINISHES[finishKey] ? finishKey : "ruby";
  refreshPieceGeometry();
  if (persist) savePreferences();
}

function stageColorLabel() {
  if (state.stageColor === "auto") {
    return `${t("stageColorAuto")} · ${THEMES[state.theme].name[state.lang]}`;
  }
  const preset = Object.entries(STAGE_COLORS).find(([, value]) => (
    value.color && value.color.toLowerCase() === state.stageColor
  ));
  return preset ? t(preset[1].nameKey) : state.stageColor.toUpperCase();
}

function renderDisplaySettings() {
  dom.themeGrid.innerHTML = Object.entries(THEMES).map(([key, theme]) => {
    const active = state.theme === key;
    return `
      <button class="theme-card${active ? " is-active" : ""}" type="button" data-theme-choice="${key}" aria-pressed="${active}">
        <span class="theme-preview is-${key}" aria-hidden="true"></span>
        <span class="theme-card-copy">
          <strong>${theme.name[state.lang]}</strong>
          <small>${theme.description[state.lang]}</small>
        </span>
        <span class="theme-check" aria-hidden="true">✓</span>
      </button>`;
  }).join("");

  dom.boardStyleControl.innerHTML = Object.entries(BOARD_STYLES).map(([key, style]) => {
    const active = state.boardStyle === key;
    return `
      <button class="board-style-option${active ? " is-active" : ""}" type="button" data-board-style="${key}" aria-pressed="${active}">
        <span class="board-preview is-${key}" aria-hidden="true"></span>
        <span class="board-style-copy">
          <strong>${style.name[state.lang]}</strong>
          <small>${style.description[state.lang]}</small>
        </span>
        <span class="theme-check" aria-hidden="true">✓</span>
      </button>`;
  }).join("");

  dom.boardMaterialControl.innerHTML = Object.entries(BOARD_MATERIALS).map(([key, material]) => {
    const active = state.boardMaterial === key;
    return `
      <button class="board-material-option${active ? " is-active" : ""}" type="button" data-board-material="${key}" aria-pressed="${active}">
        <span class="board-material-preview" aria-hidden="true">
          <i style="background:${material.light}"></i>
          <i style="background:${material.dark}"></i>
        </span>
        <span class="board-material-copy">
          <strong>${material.name[state.lang]}</strong>
          <small>${material.description[state.lang]}</small>
        </span>
        <span class="theme-check" aria-hidden="true">✓</span>
      </button>`;
  }).join("");

  dom.pieceSetControl.innerHTML = Object.entries(PIECE_SETS).map(([key, set]) => {
    const active = state.pieceSet === key;
    return `
      <button class="board-style-option piece-option${active ? " is-active" : ""}" type="button" data-piece-set="${key}" aria-pressed="${active}">
        <span class="piece-set-preview is-${key}" aria-hidden="true">${PIECE_SET_ICONS[key] || ""}</span>
        <span class="board-style-copy">
          <strong>${set.name[state.lang]}</strong>
          <small>${set.description[state.lang]}</small>
        </span>
        <span class="theme-check" aria-hidden="true">✓</span>
      </button>`;
  }).join("");

  dom.pieceFinishControl.innerHTML = Object.entries(PIECE_FINISHES).map(([key, finish]) => {
    const active = state.pieceFinish === key;
    return `
      <button class="board-style-option piece-option${active ? " is-active" : ""}" type="button" data-piece-finish="${key}" aria-pressed="${active}">
        <span class="piece-finish-preview" aria-hidden="true">${PIECE_FINISH_ICONS[key] || ""}</span>
        <span class="board-style-copy">
          <strong>${finish.name[state.lang]}</strong>
          <small>${finish.description[state.lang]}</small>
        </span>
        <span class="theme-check" aria-hidden="true">✓</span>
      </button>`;
  }).join("");

  dom.stageColorControl.innerHTML = Object.entries(STAGE_COLORS).map(([key, preset]) => {
    const active = key === "auto"
      ? state.stageColor === "auto"
      : Boolean(preset.color && preset.color.toLowerCase() === state.stageColor);
    const label = t(preset.nameKey);
    return `
      <button class="stage-color-option${active ? " is-active" : ""}" type="button" data-stage-choice="${key}" aria-pressed="${active}" title="${label}" aria-label="${label}">
        <span class="stage-color-swatch${key === "auto" ? " is-auto" : ""}" style="${preset.color ? `background:${preset.color}` : ""}" aria-hidden="true"></span>
      </button>`;
  }).join("");

  const matchedPreset = Object.entries(STAGE_COLORS).some(([key, preset]) => (
    key !== "auto" && preset.color && preset.color.toLowerCase() === state.stageColor
  ));
  const customActive = state.stageColor !== "auto" && !matchedPreset;
  dom.stageColorInput.value = effectiveStageColor();
  dom.stageColorCurrent.textContent = t("stageColorCurrent", { color: stageColorLabel() });
  dom.stageColorCurrent.closest(".stage-color-custom")?.classList.toggle("is-active", customActive);

  dom.textSizeControl.innerHTML = Object.entries(TEXT_SIZES).map(([key, size]) => {
    const active = state.textSize === key;
    return `
      <button class="text-size-option${active ? " is-active" : ""}" type="button" data-text-choice="${key}" aria-pressed="${active}">
        <span class="size-glyph" aria-hidden="true">Aa</span>
        <small>${size.name[state.lang]}</small>
        <em>${Math.round(size.scale * 100)}%</em>
      </button>`;
  }).join("");
}

function openDisplaySettings() {
  renderDisplaySettings();
  openModal(dom.displayModal);
}

function updateResultContent() {
  if (!state.statusReason) return;
  let title = t("resultDrawTitle");
  let detail = "";
  let emblem = "½";
  let eyebrow = t("resultEyebrow");

  if (state.status === "checkmate") {
    title = t("resultCheckmateTitle");
    emblem = state.winner === "w" ? "♔" : "♚";
    if (state.mode === "ai") {
      detail = state.winner === "w" ? t("resultCheckmateYou") : t("resultCheckmateBot");
    } else {
      detail = state.winner === "w" ? t("resultCheckmateWhite") : t("resultCheckmateBlack");
    }
  } else if (state.status === "stalemate") {
    title = t("resultStalemateTitle");
    emblem = "◌";
    detail = t("resultStalemate");
  } else if (state.statusReason === "repetition") {
    title = t("resultDrawTitle");
    emblem = "↻";
    detail = t("resultRepetition");
  } else if (state.statusReason === "bareKings") {
    title = t("resultDrawTitle");
    emblem = "♔";
    detail = t("resultBareKings");
  }

  dom.resultEmblem.textContent = emblem;
  dom.resultTitle.textContent = title;
  dom.resultDetail.textContent = detail;
  dom.reviewStalemateButton.hidden = state.status !== "stalemate";
  const eyebrowElement = dom.resultModal.querySelector(".eyebrow");
  if (eyebrowElement) eyebrowElement.textContent = eyebrow;
}

function lastMoveLabel(move, lang = state.lang) {
  if (!move) return "";
  const meta = pieceMeta({ type: move.type, promoted: move.promoted });
  const separator = move.captured ? " × " : " – ";
  let text = `${meta.name[lang]} ${coordinateOf(move.from)}${separator}${coordinateOf(move.to)}`;
  if (move.promotionThisMove) text += " ↑";
  return text;
}

function renderStalemateReview() {
  const side = state.turn;
  const sideName = side === "w" ? t("white") : t("black");
  const kingIndex = findKing(state.board, side);
  const kingSquare = kingIndex >= 0 ? coordinateOf(kingIndex) : "—";
  const lastMove = state.history[state.history.length - 1] || state.lastMove;
  const escapes = [];
  const escapeBySquare = new Map();

  if (kingIndex >= 0) {
    const row = rowOf(kingIndex);
    const col = colOf(kingIndex);
    for (const [dr, dc] of KING_STEPS) {
      const r = row + dr;
      const c = col + dc;
      if (!inside(r, c)) continue;
      const index = squareIndex(r, c);
      const occupant = state.board[index];
      let kind = "attacked";
      let attackers = [];
      let blockedPiece = null;

      if (occupant && occupant.color === side) {
        kind = "blocked";
        blockedPiece = occupant;
      } else {
        attackers = attackersOnSquare(state.board, index, opponent(side));
        if (attackers.length === 0) kind = "open";
      }

      const escape = { index, kind, attackers, blockedPiece };
      escapes.push(escape);
      escapeBySquare.set(index, escape);
    }
  }

  dom.stalemateTitle.textContent = t("stalemateReviewTitle");
  dom.stalemateSubtitle.textContent = t("stalemateReviewSubtitle");
  dom.stalemateCheckStatus.innerHTML = `<strong>${t("stalemateNotInCheck", { side: sideName, square: kingSquare })}</strong>`;
  dom.stalemateLastMove.textContent = lastMove ? t("stalemateLastMove", { move: lastMoveLabel(lastMove) }) : "";
  dom.stalemateLastMove.hidden = !lastMove;
  const captured = lastMove?.captured;
  dom.stalemateCause.textContent = lastMove
    ? captured
      ? t("stalemateCauseCaptured", {
        piece: pieceMeta(captured).name[state.lang],
        square: coordinateOf(lastMove.to),
        side: sideName,
      })
      : t("stalemateCause", { side: sideName })
    : "";
  dom.stalemateCause.hidden = !lastMove;
  dom.stalemateEscapesTitle.textContent = t("stalemateEscapesHeading");

  const lastFrom = lastMove?.from;
  const lastTo = lastMove?.to;
  dom.stalemateBoard.innerHTML = "";

  for (let index = 0; index < 64; index += 1) {
    const row = rowOf(index);
    const col = colOf(index);
    const piece = state.board[index];
    const escape = escapeBySquare.get(index);
    const square = document.createElement("div");
    square.className = "mini-square";
    if ((row + col) % 2 === 1) square.classList.add("is-alt");
    if (index === kingIndex) square.classList.add("is-king");
    if (index === lastFrom) square.classList.add("is-last-from");
    if (index === lastTo) square.classList.add("is-last-to");
    if (escape?.kind === "attacked") square.classList.add("is-escape");
    if (escape?.kind === "blocked") square.classList.add("is-blocked");

    const coordinate = coordinateOf(index);
    const descriptors = [coordinate];
    if (piece) descriptors.push(pieceMeta(piece).name[state.lang]);
    if (index === kingIndex) descriptors.push(t("stalemateLegendKing"));
    if (escape?.kind === "attacked") descriptors.push(t("stalemateLegendEscape"));
    if (index === lastFrom || index === lastTo) descriptors.push(t("stalemateLegendMove"));
    square.title = descriptors.join(" — ");
    square.setAttribute("aria-label", descriptors.join(", "));

    if (piece) {
      const glyph = document.createElement("span");
      glyph.className = `mini-piece ${piece.color === "w" ? "is-white" : "is-black"}`;
      glyph.textContent = pieceGlyph(piece);
      square.appendChild(glyph);
    }

    if (index === kingIndex || escape || index === lastFrom || index === lastTo) {
      const label = document.createElement("span");
      label.className = "mini-coord";
      label.textContent = coordinate;
      square.appendChild(label);
    }

    dom.stalemateBoard.appendChild(square);
  }

  const visibleEscapes = escapes.filter((escape) => escape.kind !== "open");
  if (visibleEscapes.length === 0) {
    dom.stalemateEscapesList.innerHTML = `<li><span class="escape-square">—</span><span>${t("stalemateNoEscapes")}</span></li>`;
  } else {
    dom.stalemateEscapesList.innerHTML = visibleEscapes.map((escape) => {
      if (escape.kind === "blocked") {
        const pieceName = pieceMeta(escape.blockedPiece).name[state.lang];
        return `<li class="is-blocked"><span class="escape-square">${coordinateOf(escape.index)}</span> <span>${t("stalemateEscapeBlocked", { piece: `<strong>${pieceName}</strong>` })}</span></li>`;
      }
      const attackerNames = escape.attackers
        .map((attacker) => `${pieceMeta(attacker.piece).name[state.lang]} ${coordinateOf(attacker.index)}`)
        .join(" + ");
      return `<li><span class="escape-square">${coordinateOf(escape.index)}</span> <span>${t("stalemateEscapeAttacked", { attackers: `<strong>${attackerNames}</strong>` })}</span></li>`;
    }).join("");
  }

  dom.stalemateRuleNote.innerHTML = t("stalemateRuleNote");
}

function showStalemateReview() {
  if (state.status !== "stalemate") return;
  renderStalemateReview();
  openModal(dom.stalemateModal);
}

function updateAllUI() {
  applyStaticTranslations();
  updateModeUI();
  updateAssistUI();
  updateSoundUI();
  updateTurnUI();
  renderRecordStatus();
  renderMoveList();
  renderCaptures();
  updateTutor();
  if (!dom.resultModal.hidden) updateResultContent();
  if (!dom.glossaryModal.hidden) renderGlossary();
  if (!dom.piecePreviewModal.hidden && piecePreview.key) renderPiecePreviewCopy(piecePreview.key);
  if (!dom.stalemateModal.hidden) renderStalemateReview();
  if (!dom.displayModal.hidden) renderDisplaySettings();
}

function renderGlossary() {
  dom.glossarySubtitle.textContent = t("glossarySubtitle");
  dom.rulesHeading.textContent = t("rulesHeading");
  dom.rulesIntro.textContent = t("rulesIntro");
  dom.heritageTitle.textContent = t("heritageTitle");
  dom.heritageText.textContent = t("heritageText");

  dom.glossaryGrid.innerHTML = PIECE_ORDER.map((key) => {
    const piece = PIECES[key];
    const otherLang = state.lang === "en" ? "th" : "en";
    const setNote = t(state.pieceSet === "tournament" ? "modelTournamentNote" : "modelCourtNote");
    return `
      <article class="glossary-card" data-piece-key="${key}" role="button" tabindex="0"
        aria-label="${t("viewIn3D")}: ${piece.name[state.lang]}">
        <span class="glossary-glyph" aria-hidden="true">${piece.glyph}</span>
        <button class="glossary-speak" type="button" data-pronounce="${key}"
          aria-label="${t("hearThai")}: ${piece.name.th}" title="${t("hearThai")}">🔊</button>
        <div class="glossary-body">
          <div class="glossary-names">
            <strong>${piece.name[state.lang]}</strong>
            <span class="thai-name">${piece.name[otherLang]}</span>
          </div>
          <span class="glossary-phonetic">${piece.role[state.lang]} · ${piece.phonetic}</span>
          <p class="glossary-lore">${piece.lore[state.lang]}</p>
          <p class="glossary-move"><b>${t("movement")}:</b> ${piece.movement[state.lang]}</p>
          <span class="glossary-model">${piece.model[state.lang]} ${setNote}</span>
          <span class="glossary-view3d">${t("viewIn3D")} <i aria-hidden="true">↗</i></span>
        </div>
      </article>`;
  }).join("");

  const ruleCards = [
    [t("rule1Title"), t("rule1Text")],
    [t("rule2Title"), t("rule2Text")],
    [t("rule3Title"), t("rule3Text")],
    [t("rule4Title"), t("rule4Text")],
    [t("rule5Title"), t("rule5Text")],
    [t("rule6Title"), t("rule6Text")],
  ];
  dom.rulesGrid.innerHTML = ruleCards.map(([title, text]) => `
    <article class="rule-card">
      <span>${title}</span>
      <p>${text}</p>
    </article>`).join("");
}

function initPiecePreview() {
  if (piecePreview.renderer) return true;
  const canvas = dom.piecePreviewCanvas;
  if (!canvas) return false;
  try {
    piecePreview.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    piecePreview.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    piecePreview.renderer.outputColorSpace = THREE.SRGBColorSpace;
    piecePreview.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    piecePreview.renderer.toneMappingExposure = 1.16;
    piecePreview.renderer.shadowMap.enabled = true;
    piecePreview.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    piecePreview.renderer.setClearColor(0x000000, 0);
  } catch (error) {
    console.warn(error);
    return false;
  }

  if (!materials.ivory) createMaterials();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 40);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 0.5;
  controls.maxDistance = 8;
  controls.minPolarAngle = 0.1;
  controls.maxPolarAngle = Math.PI * 0.53;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 0.8;

  scene.add(new THREE.HemisphereLight(0xffe6bd, 0x140b06, 1.15));
  const key = new THREE.DirectionalLight(0xffd28a, 2.35);
  key.position.set(2.4, 4.2, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 20;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fd6ff, 1.55);
  rim.position.set(-3.2, 2.5, -2.6);
  scene.add(rim);
  const fill = new THREE.PointLight(0xffb15a, 1.1, 10, 2);
  fill.position.set(0.4, 1.1, 2.4);
  scene.add(fill);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1, 64),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.34 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  shadow.receiveShadow = true;
  scene.add(shadow);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.012, 8, 72),
    new THREE.MeshStandardMaterial({ color: 0xd1a84c, metalness: 0.85, roughness: 0.28 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.004;
  scene.add(ring);

  const pivot = new THREE.Group();
  scene.add(pivot);

  piecePreview.scene = scene;
  piecePreview.camera = camera;
  piecePreview.controls = controls;
  piecePreview.pivot = pivot;
  piecePreview.shadow = shadow;
  piecePreview.ring = ring;
  piecePreview.clock = new THREE.Clock(false);

  piecePreview.stageObserver = new ResizeObserver(resizePiecePreview);
  piecePreview.stageObserver.observe(dom.piecePreviewStage);
  window.addEventListener("resize", resizePiecePreview);
  resizePiecePreview();
  return true;
}

function resizePiecePreview() {
  if (!piecePreview.renderer || !dom.piecePreviewStage) return;
  const width = Math.max(1, dom.piecePreviewStage.clientWidth);
  const height = Math.max(1, dom.piecePreviewStage.clientHeight);
  piecePreview.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  piecePreview.renderer.setSize(width, height, false);
  if (piecePreview.camera) {
    piecePreview.camera.aspect = width / height;
    piecePreview.camera.updateProjectionMatrix();
  }
}

function fitPiecePreview(key) {
  if (!piecePreview.pivot || !PIECES[key]) return;
  const meta = PIECES[key];
  const created = createPieceGroup({
    type: meta.type,
    color: "w",
    promoted: key === "biaNgua",
  });

  if (piecePreview.group) {
    piecePreview.pivot.remove(piecePreview.group);
    disposeGroup(piecePreview.group);
  }

  piecePreview.pivot.rotation.y = 0;
  piecePreview.pivot.add(created);
  created.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(created);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  created.position.x -= center.x;
  created.position.z -= center.z;
  created.position.y -= box.min.y;
  created.updateMatrixWorld(true);

  const height = Math.max(0.3, size.y);
  const footprint = Math.max(0.24, size.x, size.z);
  piecePreview.shadow.scale.setScalar(footprint * 2.1);
  piecePreview.ring.scale.setScalar(footprint * 1.18);
  piecePreview.group = created;
  piecePreview.key = key;

  const targetY = height * 0.46;
  const distance = Math.max(0.85, height * 2.05, footprint * 3.1);
  piecePreview.controls.target.set(0, targetY, 0);
  piecePreview.camera.position.set(distance * 0.72, targetY + height * 0.62 + distance * 0.18, distance * 0.96);
  piecePreview.controls.minDistance = Math.max(0.42, height * 0.9);
  piecePreview.controls.maxDistance = Math.max(2.2, height * 5.5);
  piecePreview.controls.update();
}

function renderPiecePreviewFrame() {
  if (!piecePreview.renderer || !piecePreview.scene || !piecePreview.camera) return;
  const delta = Math.min(piecePreview.clock.getDelta(), 0.05);
  if (piecePreview.autoRotate && piecePreview.pivot) {
    piecePreview.pivot.rotation.y += delta * 0.52;
  }
  piecePreview.controls.update();
  piecePreview.renderer.render(piecePreview.scene, piecePreview.camera);
}

function renderPiecePreviewCopy(key) {
  const meta = PIECES[key];
  if (!meta) return;
  if (dom.piecePreviewTitle) dom.piecePreviewTitle.textContent = meta.name[state.lang];
  if (dom.piecePreviewStageName) dom.piecePreviewStageName.textContent = meta.name[state.lang];
  if (dom.piecePreviewGlyph) dom.piecePreviewGlyph.textContent = meta.glyph;
  if (dom.piecePreviewRole) dom.piecePreviewRole.textContent = `${meta.role[state.lang]} · ${meta.phonetic}`;
  if (dom.piecePreviewLore) dom.piecePreviewLore.textContent = meta.lore[state.lang];
  if (dom.piecePreviewMovement) dom.piecePreviewMovement.textContent = meta.movement[state.lang];
  if (dom.piecePreviewModel) {
    const setNote = t(state.pieceSet === "tournament" ? "modelTournamentNote" : "modelCourtNote");
    dom.piecePreviewModel.textContent = `${meta.model[state.lang]} ${setNote}`;
  }
  if (dom.piecePronounceButton) {
    dom.piecePronounceButton.setAttribute("aria-label", `${t("hearThai")}: ${meta.name.th}`);
  }
}

function openPiecePreview(key) {
  if (!PIECES[key]) return;
  preloadPronunciationAudio();
  if (!initPiecePreview()) {
    showToast(t("previewUnavailable"), "error", "!");
    return;
  }
  openModal(dom.piecePreviewModal);
  renderPiecePreviewCopy(key);
  if (dom.pieceAutoRotate) {
    dom.pieceAutoRotate.classList.toggle("is-active", piecePreview.autoRotate);
    dom.pieceAutoRotate.setAttribute("aria-pressed", String(piecePreview.autoRotate));
    dom.pieceAutoRotate.textContent = t("piecePreviewAuto");
  }
  fitPiecePreview(key);
  piecePreview.clock.start();
  piecePreview.renderer.setAnimationLoop(renderPiecePreviewFrame);
  window.requestAnimationFrame(resizePiecePreview);
  audio.click();
}

function stopPiecePreview() {
  if (piecePreview.renderer) piecePreview.renderer.setAnimationLoop(null);
  if (piecePreview.clock) piecePreview.clock.stop();
  stopThaiPronunciation();
  stopThaiSpeech();
}

function resetPiecePreviewView() {
  if (!piecePreview.key) return;
  fitPiecePreview(piecePreview.key);
  audio.click();
}

function togglePiecePreviewAutoRotate() {
  piecePreview.autoRotate = !piecePreview.autoRotate;
  if (dom.pieceAutoRotate) {
    dom.pieceAutoRotate.classList.toggle("is-active", piecePreview.autoRotate);
    dom.pieceAutoRotate.setAttribute("aria-pressed", String(piecePreview.autoRotate));
    dom.pieceAutoRotate.textContent = t("piecePreviewAuto");
  }
  showToast(piecePreview.autoRotate ? t("piecePreviewAutoOn") : t("piecePreviewAutoOff"), "info", "↻");
  audio.click();
}

function clearThaiSpeechHighlights() {
  thaiSpeech.buttons.forEach((button) => button.classList.remove("is-speaking"));
  thaiSpeech.buttons.clear();
  clearTimeout(thaiSpeech.watchdog);
  thaiSpeech.watchdog = null;
}

function stopThaiSpeech() {
  thaiSpeech.token += 1;
  thaiSpeech.queue = [];
  thaiSpeech.active = null;
  thaiSpeech.utterance = null;
  clearThaiSpeechHighlights();
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  } catch {
    // Some embedded browsers expose speechSynthesis but reject calls.
  }
}

function playNextThaiUtterance() {
  if (thaiSpeech.active || !("speechSynthesis" in window)) return;
  const item = thaiSpeech.queue.shift();
  if (!item) {
    clearThaiSpeechHighlights();
    return;
  }

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.lang = "th-TH";
  utterance.rate = 0.82;
  utterance.pitch = 1.02;
  utterance.volume = 0.95;
  if (item.voice) utterance.voice = item.voice;

  const token = thaiSpeech.token;
  thaiSpeech.active = utterance;
  thaiSpeech.utterance = utterance;

  const finish = () => {
    if (thaiSpeech.active !== utterance) return;
    clearTimeout(thaiSpeech.watchdog);
    thaiSpeech.watchdog = null;
    thaiSpeech.active = null;
    thaiSpeech.utterance = null;
    if (token !== thaiSpeech.token) return;
    window.setTimeout(() => {
      if (token === thaiSpeech.token) playNextThaiUtterance();
    }, 55);
  };

  utterance.onend = finish;
  utterance.onerror = (event) => {
    finish();
    if (event?.error === "not-allowed") {
      showToast(t("speechUnavailable"), "error", "!");
    }
  };

  // A phantom "speaking" flag can survive a previous browser interruption.
  // Only clear it when we do not own an active utterance.
  if (synth.speaking || synth.pending) {
    try {
      synth.cancel();
      if (synth.paused) synth.resume();
    } catch {
      // Continue anyway.
    }
  }

  try {
    if (synth.paused) synth.resume();
    synth.speak(utterance);
  } catch (error) {
    console.warn("Thai speech failed", error);
    finish();
    showToast(t("speechUnavailable"), "error", "!");
    return;
  }

  // If a browser never fires end/error, allow the next queued phrase through.
  clearTimeout(thaiSpeech.watchdog);
  thaiSpeech.watchdog = window.setTimeout(finish, 5000);
}

function preloadPronunciationAudio() {
  if (typeof Audio === "undefined") return;
  for (const [key, src] of Object.entries(PRONUNCIATION_FILES)) {
    if (pronunciationAudio.players.has(key)) continue;
    const player = new Audio();
    player.preload = "auto";
    player.src = src;
    player.load();
    pronunciationAudio.players.set(key, player);
  }
}

function clearPronunciationHighlights() {
  pronunciationAudio.buttons.forEach((button) => button.classList.remove("is-speaking"));
  pronunciationAudio.buttons.clear();
}

function stopThaiPronunciation() {
  pronunciationAudio.token += 1;
  clearPronunciationHighlights();
  if (pronunciationAudio.active) {
    try {
      pronunciationAudio.active.pause();
      pronunciationAudio.active.currentTime = 0;
    } catch {
      // Ignore media reset errors.
    }
    pronunciationAudio.active = null;
  }
  pronunciationAudio.players.forEach((player) => {
    if (player !== pronunciationAudio.active) {
      try {
        player.pause();
        player.currentTime = 0;
      } catch {
        // Ignore media reset errors.
      }
    }
  });
}

function playRecordedPronunciation(key, originButton = null) {
  if (typeof Audio === "undefined") return false;
  const src = PRONUNCIATION_FILES[key];
  if (!src) return false;

  // The recordings are primary; browser speech is only a fallback.
  stopThaiSpeech();
  stopThaiPronunciation();
  const token = pronunciationAudio.token;
  const buttons = [dom.piecePronounceButton, originButton].filter(Boolean);
  buttons.forEach((button) => button.classList.add("is-speaking"));
  pronunciationAudio.buttons = new Set(buttons);

  let player = pronunciationAudio.players.get(key);
  if (!player) {
    player = new Audio(src);
    player.preload = "auto";
    pronunciationAudio.players.set(key, player);
  }

  let fellBack = false;
  const fallback = () => {
    if (token !== pronunciationAudio.token || fellBack) return;
    fellBack = true;
    clearPronunciationHighlights();
    pronunciationAudio.active = null;
    speakThaiWithBrowser(key, originButton);
  };

  player.onended = () => {
    if (token !== pronunciationAudio.token) return;
    clearPronunciationHighlights();
    pronunciationAudio.active = null;
  };
  player.onerror = fallback;
  pronunciationAudio.active = player;

  try {
    player.pause();
    player.currentTime = 0;
    player.volume = 0.95;
    const playback = player.play();
    if (playback?.catch) playback.catch(fallback);
    return true;
  } catch {
    fallback();
    return true;
  }
}

function speakThaiWithBrowser(key, originButton = null) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    showToast(t("speechUnavailable"), "error", "!");
    return;
  }
  const meta = PIECES[key];
  if (!meta) return;

  warmSpeechVoices();
  const voices = window.speechSynthesis.getVoices() || [];
  const thaiVoice = voices.find((voice) => /^th/i.test(voice.lang))
    || voices.find((voice) => /thai/i.test(voice.name));

  const buttons = [dom.piecePronounceButton, originButton].filter(Boolean);
  buttons.forEach((button) => button.classList.add("is-speaking"));
  buttons.forEach((button) => thaiSpeech.buttons.add(button));

  thaiSpeech.queue.push({ text: meta.name.th, voice: thaiVoice || null });
  if (!thaiSpeech.active) playNextThaiUtterance();
}

function speakThaiPiece(key, originButton = null) {
  if (!state.sound) {
    showToast(t("soundOffSpeech"), "info", "∅");
    return;
  }
  if (!PIECES[key]) return;
  if (playRecordedPronunciation(key, originButton)) return;
  speakThaiWithBrowser(key, originButton);
}

function openModal(modal) {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) window.setTimeout(() => closeButton.focus(), 40);
}

function closeModal(modal) {
  if (!modal) return;
  if (modal === dom.piecePreviewModal) stopPiecePreview();
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  if (
    dom.glossaryModal.hidden &&
    dom.resultModal.hidden &&
    dom.stalemateModal.hidden &&
    dom.displayModal.hidden &&
    dom.piecePreviewModal.hidden
  ) {
    document.body.classList.remove("modal-open");
  }
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function closeEndModals() {
  if (!dom.stalemateModal.hidden) closeModal(dom.stalemateModal);
  if (!dom.resultModal.hidden) closeModal(dom.resultModal);
}

function showGlossary() {
  preloadPronunciationAudio();
  renderGlossary();
  openModal(dom.glossaryModal);
}

function showResultModal() {
  if (!isTerminal()) return;
  updateResultContent();
  openModal(dom.resultModal);
}

let toastCounter = 0;
function showToast(message, type = "info", icon = "✦") {
  if (!message) return;
  toastCounter += 1;
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " is-error" : ""}${type === "success" ? " is-success" : ""}`;
  toast.dataset.toastId = String(toastCounter);
  const iconElement = document.createElement("span");
  iconElement.className = "toast-icon";
  iconElement.textContent = icon;
  const text = document.createElement("span");
  text.textContent = message;
  toast.append(iconElement, text);
  dom.toastStack.appendChild(toast);

  while (dom.toastStack.children.length > 4) {
    dom.toastStack.firstElementChild.remove();
  }

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 260);
  }, 3500);
}

/* =========================================================================
   Interaction and match flow
   ========================================================================= */

function selectSquare(index) {
  const piece = state.board[index];
  if (!piece || piece.color !== state.turn) return false;

  state.selected = index;
  const allMoves = getLegalMoves(piece.color, state.board);
  state.selectedMoves = allMoves.filter((move) => move.from === index);
  audio.select();
  renderHighlights();
  updateTutor();
  return true;
}

function clearSelection() {
  state.selected = null;
  state.selectedMoves = [];
  renderHighlights();
  updateTutor();
}

function handleSquareClick(index) {
  if (!canHumanInteract()) {
    if (isTerminal()) showToast(t("toastGameOver"));
    else if (state.aiThinking || (state.mode === "ai" && state.turn === "b")) showToast(t("toastBotTurn"));
    return;
  }

  const piece = state.board[index];

  if (state.selected !== null) {
    const move = state.selectedMoves.find((candidate) => candidate.to === index);
    if (move) {
      performMove(move.from, move.to, { fromAI: false });
      return;
    }
    if (index === state.selected) {
      clearSelection();
      return;
    }
    if (piece && piece.color === state.turn) {
      selectSquare(index);
      return;
    }
    if (!piece) {
      showToast(t("toastIllegal"), "error", "!");
      clearSelection();
      return;
    }
    showToast(t("toastSelect"), "info", "✦");
    return;
  }

  if (!piece) {
    showToast(t("toastSelect"), "info", "✦");
    return;
  }

  if (piece.color !== state.turn) {
    showToast(t("toastNotTurn"), "error", "!");
    return;
  }

  selectSquare(index);
}

function boardPointerUp(event) {
  if (event.button !== undefined && event.button !== 0) return;
  if (!sceneReady || !camera) return;

  const rect = renderer.domElement.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  ) return;

  const start = renderer.domElement.dataset.pointerStart;
  if (start) {
    const [startX, startY] = start.split(",").map(Number);
    if (Math.hypot(event.clientX - startX, event.clientY - startY) > 7) return;
  }

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(pickables, false);
  if (!intersections.length) return;
  handleSquareClick(intersections[0].object.userData.square);
}

function boardPointerDown(event) {
  if (event.button !== undefined && event.button !== 0) return;
  renderer.domElement.dataset.pointerStart = `${event.clientX},${event.clientY}`;
}

function suppressCameraClick(event) {
  if (event.target === renderer?.domElement) {
    // OrbitControls handles drag; nothing to prevent, but ensure focus.
    renderer.domElement.focus?.();
  }
}

function performMove(from, to, { fromAI = false } = {}) {
  const legalMoves = getLegalMoves(state.turn, state.board);
  const legal = legalMoves.find((move) => move.from === from && move.to === to);
  if (!legal) return false;

  const movingPiece = state.board[from];
  const capturedPiece = state.board[to];
  const movingColor = movingPiece.color;
  const promotionThisMove = legal.promoted;

  applyMoveRaw(state.board, from, to);
  const pieceIsPromoted = movingPiece.promoted;
  if (capturedPiece) {
    state.captured[movingColor].push({
      type: capturedPiece.type,
      color: capturedPiece.color,
      promoted: capturedPiece.promoted,
    });
  }

  state.turn = opponent(state.turn);
  state.halfmove = capturedPiece || movingPiece.type === "P" ? 0 : state.halfmove + 1;
  state.lastMove = {
    from,
    to,
    color: movingColor,
    type: movingPiece.type,
    promoted: pieceIsPromoted,
    promotionThisMove,
    captured: capturedPiece ? capturedPiece.type : null,
  };
  state.selected = null;
  state.selectedMoves = [];
  state.history.push({
    from,
    to,
    color: movingColor,
    type: movingPiece.type,
    promoted: pieceIsPromoted,
    promotionThisMove,
    captured: capturedPiece
      ? { type: capturedPiece.type, color: capturedPiece.color, promoted: capturedPiece.promoted }
      : null,
    check: false,
    mate: false,
  });

  registerPosition();
  updateGameStatus();

  const lastHistory = state.history[state.history.length - 1];
  lastHistory.check = state.inCheck;
  lastHistory.mate = state.status === "checkmate";

  if (promotionThisMove) audio.promote();
  else if (capturedPiece) audio.capture();
  else audio.move();

  if (state.inCheck && state.status === "playing") {
    window.setTimeout(() => audio.check(), 95);
  }

  syncPieceMeshes({ animate: true });
  renderHighlights();
  updateAllUI();
  saveGameToStorage();
  savePreferences();

  if (promotionThisMove) showToast(t("toastPromotion"), "success", "◎");
  if (state.inCheck && state.status === "playing") showToast(t("toastCheck"), "error", "!");
  if (isTerminal()) scheduleResult();
  else scheduleAI();

  return true;
}

function scheduleAI() {
  clearTimeout(aiTimer);
  aiTimer = null;
  if (state.mode !== "ai" || state.turn !== "b" || isTerminal()) {
    if (state.aiThinking) {
      state.aiThinking = false;
      updateAllUI();
    }
    return;
  }

  state.aiThinking = true;
  updateAllUI();
  aiTimer = window.setTimeout(() => {
    if (state.mode !== "ai" || state.turn !== "b" || isTerminal()) {
      state.aiThinking = false;
      updateAllUI();
      return;
    }

    let move = null;
    try {
      move = chooseAIMove();
    } catch (error) {
      console.error("AI search failed", error);
    }

    state.aiThinking = false;
    if (!move) {
      updateAllUI();
      return;
    }
    performMove(move.from, move.to, { fromAI: true });
  }, 420);
}

function scheduleResult() {
  clearTimeout(resultTimer);
  resultTimer = window.setTimeout(() => {
    if (!isTerminal()) return;
    if (state.statusReason === "checkmate") {
      if (state.mode === "ai") {
        if (state.winner === "w") audio.win();
        else audio.lose();
      } else {
        audio.win();
      }
    } else {
      audio.draw();
    }
    showResultModal();
    const message = state.statusReason === "checkmate" ? t("toastCheckmate") : t("toastDraw");
    showToast(message, state.statusReason === "checkmate" ? "success" : "info", state.statusReason === "checkmate" ? "♔" : "½");
  }, 700);
}

function newGame({ announce = true, resetView = false } = {}) {
  clearTimeout(aiTimer);
  clearTimeout(resultTimer);
  state.aiThinking = false;
  closeEndModals();
  resetGameState();
  rebuildPieceMeshes();
  clearSelection();
  updateAllUI();
  saveGameToStorage();
  savePreferences();
  if (resetView) resetCamera();
  if (announce) showToast(t("toastNewGame"), "success", "↻");
}

function changeMode(mode) {
  if (mode === state.mode) return;
  if (state.history.length > 0 && !window.confirm(t("confirmMode"))) {
    updateModeUI();
    return;
  }
  clearTimeout(aiTimer);
  state.mode = mode;
  state.aiThinking = false;
  closeEndModals();
  resetGameState();
  rebuildPieceMeshes();
  clearSelection();
  updateAllUI();
  saveGameToStorage();
  savePreferences();
  showToast(mode === "ai" ? t("toastModeAi") : t("toastModeLocal"), "success", mode === "ai" ? "🤖" : "⚭");
}

function toggleAssist() {
  state.assist = dom.assistToggle.checked;
  state.selectedMoves = state.selected !== null
    ? getLegalMoves(state.turn, state.board).filter((move) => move.from === state.selected)
    : [];
  renderHighlights();
  updateAssistUI();
  updateTutor();
  saveGameToStorage();
  savePreferences();
  audio.click();
  showToast(state.assist ? t("toastAssistOn") : t("toastAssistOff"), "info", state.assist ? "◉" : "○");
}

function toggleSound() {
  state.sound = !state.sound;
  audio.enabled = state.sound;
  updateSoundUI();
  savePreferences();
  if (state.sound) {
    audio.unlock();
    audio.click();
    showToast(t("toastSoundOn"), "success", "♪");
  } else {
    stopThaiPronunciation();
    stopThaiSpeech();
    showToast(t("toastSoundOff"), "info", "∅");
  }
}

function toggleLanguage() {
  state.lang = state.lang === "en" ? "th" : "en";
  updateAllUI();
  savePreferences();
  saveGameToStorage();
  audio.click();
}

/* =========================================================================
   Persistence
   ========================================================================= */

function serializePiece(piece) {
  return {
    t: piece.type,
    c: piece.color,
    p: Boolean(piece.promoted),
  };
}

function serializeBoard(board = state.board) {
  return board.map((piece) => (piece ? serializePiece(piece) : null));
}

function exportPayload() {
  return {
    format: SAVE_FORMAT,
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    app: "Makruk 3D — Thai Chess Academy & Beginner Studio",
    credits: APP_CREDIT,
    game: {
      board: serializeBoard(),
      turn: state.turn,
      mode: state.mode,
      assist: state.assist,
      lang: state.lang,
      sound: state.sound,
      history: state.history,
      captured: state.captured,
      lastMove: state.lastMove,
      status: state.status,
      statusReason: state.statusReason,
      winner: state.winner,
      halfmove: state.halfmove,
      positionCounts: state.positionCounts,
      startedAt: state.startedAt,
    },
  };
}

function saveGameToStorage() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(exportPayload()));
  } catch (error) {
    console.warn("Could not autosave match", error);
  }
}

function savePreferences() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({
      lang: state.lang,
      sound: state.sound,
      assist: state.assist,
      mode: state.mode,
      botLevel: state.botLevel,
      thinkTimeMs: state.thinkTimeMs,
      theme: state.theme,
      textSize: state.textSize,
      boardStyle: state.boardStyle,
      boardMaterial: state.boardMaterial,
      pieceSet: state.pieceSet,
      pieceFinish: state.pieceFinish,
      stageColor: state.stageColor,
    }));
  } catch {
    // Storage can be unavailable in private modes; the game still works.
  }
}

function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (prefs.lang === "en" || prefs.lang === "th") state.lang = prefs.lang;
    if (typeof prefs.sound === "boolean") state.sound = prefs.sound;
    if (typeof prefs.assist === "boolean") state.assist = prefs.assist;
    if (prefs.mode === "ai" || prefs.mode === "local") state.mode = prefs.mode;
    if (AI_LEVELS[prefs.botLevel]) state.botLevel = prefs.botLevel;
    if (Number.isFinite(prefs.thinkTimeMs)) {
      const clamped = Math.min(
        THINK_TIME_MAX_MS,
        Math.max(THINK_TIME_MIN_MS, prefs.thinkTimeMs),
      );
      state.thinkTimeMs = Math.round(clamped / THINK_TIME_STEP_MS) * THINK_TIME_STEP_MS;
    }
    if (THEMES[prefs.theme]) state.theme = prefs.theme;
    if (TEXT_SIZES[prefs.textSize]) state.textSize = prefs.textSize;
    if (BOARD_STYLES[prefs.boardStyle]) state.boardStyle = prefs.boardStyle;
    if (BOARD_MATERIALS[prefs.boardMaterial]) state.boardMaterial = prefs.boardMaterial;
    if (PIECE_SETS[prefs.pieceSet]) state.pieceSet = prefs.pieceSet;
    if (PIECE_FINISHES[prefs.pieceFinish]) state.pieceFinish = prefs.pieceFinish;
    if (prefs.stageColor === "auto" || /^#[0-9a-f]{6}$/i.test(String(prefs.stageColor))) {
      state.stageColor = String(prefs.stageColor).toLowerCase();
    }
  } catch {
    // Ignore malformed preferences.
  }
}

function validateLoadedGame(game) {
  if (!game || !Array.isArray(game.board) || game.board.length !== 64) return false;
  if (game.turn !== "w" && game.turn !== "b") return false;
  if (game.mode !== "ai" && game.mode !== "local") return false;

  let whiteKings = 0;
  let blackKings = 0;
  for (const entry of game.board) {
    if (entry === null) continue;
    if (!entry || !["K", "M", "B", "N", "R", "P"].includes(entry.t)) return false;
    if (entry.c !== "w" && entry.c !== "b") return false;
    if (entry.t === "K" && entry.c === "w") whiteKings += 1;
    if (entry.t === "K" && entry.c === "b") blackKings += 1;
  }
  if (whiteKings !== 1 || blackKings !== 1) return false;
  return true;
}

function deserializeBoard(boardData) {
  return boardData.map((entry) => {
    if (!entry) return null;
    return {
      id: pieceIdCounter++,
      type: entry.t,
      color: entry.c,
      promoted: Boolean(entry.p),
    };
  });
}

function restoreGameFromPayload(payload, { announce = true, auto = false } = {}) {
  const game = payload?.game || payload;
  if (!validateLoadedGame(game)) {
    showToast(t("toastInvalidSave"), "error", "!");
    return false;
  }

  clearTimeout(aiTimer);
  clearTimeout(resultTimer);
  closeEndModals();

  state.board = deserializeBoard(game.board);
  state.turn = game.turn;
  state.mode = game.mode;
  state.assist = typeof game.assist === "boolean" ? game.assist : state.assist;
  state.lang = game.lang === "th" ? "th" : "en";
  state.sound = typeof game.sound === "boolean" ? game.sound : state.sound;
  state.history = Array.isArray(game.history) ? game.history : [];
  state.captured = game.captured && Array.isArray(game.captured.w) && Array.isArray(game.captured.b)
    ? { w: game.captured.w, b: game.captured.b }
    : { w: [], b: [] };
  state.lastMove = game.lastMove && typeof game.lastMove === "object" ? game.lastMove : null;
  state.halfmove = Number.isFinite(game.halfmove) ? game.halfmove : 0;
  state.positionCounts = game.positionCounts && typeof game.positionCounts === "object"
    ? game.positionCounts
    : {};
  state.startedAt = Number.isFinite(game.startedAt) ? game.startedAt : Date.now();
  state.selected = null;
  state.selectedMoves = [];
  state.aiThinking = false;

  if (Object.keys(state.positionCounts).length === 0) {
    state.positionCounts[positionKey()] = 1;
  }

  updateGameStatus();
  rebuildPieceMeshes();
  clearSelection();
  updateAllUI();
  saveGameToStorage();
  savePreferences();

  if (announce) {
    showToast(auto ? t("toastAutoRestored") : t("toastLoaded"), "success", auto ? "↺" : "📂");
  }
  if (!isTerminal()) {
    scheduleAI();
  } else if (announce) {
    window.setTimeout(() => {
      if (isTerminal()) showResultModal();
    }, 450);
  }
  return true;
}

function tryRestoreAutoSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const payload = JSON.parse(raw);
    const game = payload?.game || payload;
    if (!validateLoadedGame(game)) return false;
    const restored = restoreGameFromPayload(payload, { announce: false, auto: true });
    if (restored) {
      window.setTimeout(() => showToast(t("toastAutoRestored"), "success", "↺"), 600);
    }
    return restored;
  } catch {
    return false;
  }
}

function downloadSave() {
  const payload = exportPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "makruk_save.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 800);
  saveGameToStorage();
  audio.click();
  showToast(t("toastSaved"), "success", "💾");
}

function handleLoadFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result));
      const game = payload?.game || payload;
      if (!validateLoadedGame(game)) {
        showToast(t("toastInvalidSave"), "error", "!");
        return;
      }
      if (state.history.length > 0 && !window.confirm(t("confirmLoad"))) return;
      restoreGameFromPayload(payload, { announce: true });
      audio.click();
    } catch {
      showToast(t("toastInvalidSave"), "error", "!");
    }
  };
  reader.onerror = () => showToast(t("toastInvalidSave"), "error", "!");
  reader.readAsText(file);
}

/* =========================================================================
   Event wiring
   ========================================================================= */

function bindEvents() {
  dom.langToggle.addEventListener("click", toggleLanguage);
  dom.soundToggle.addEventListener("click", toggleSound);
  dom.glossaryButton.addEventListener("click", showGlossary);
  dom.sidebarGlossary.addEventListener("click", showGlossary);

  dom.tutorContent.addEventListener("click", (event) => {
    const link = event.target.closest("[data-tutor-view3d]");
    if (!link) return;
    event.preventDefault();
    openPiecePreview(link.dataset.tutorView3d);
  });

  dom.glossaryGrid.addEventListener("click", (event) => {
    const pronounce = event.target.closest("[data-pronounce]");
    if (pronounce) {
      event.preventDefault();
      event.stopPropagation();
      speakThaiPiece(pronounce.dataset.pronounce, pronounce);
      return;
    }
    const card = event.target.closest("[data-piece-key]");
    if (card) openPiecePreview(card.dataset.pieceKey);
  });

  dom.glossaryGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("[data-pronounce]")) return;
    const card = event.target.closest("[data-piece-key]");
    if (!card) return;
    event.preventDefault();
    openPiecePreview(card.dataset.pieceKey);
  });

  dom.piecePronounceButton.addEventListener("click", () => {
    speakThaiPiece(piecePreview.key, dom.piecePronounceButton);
  });
  dom.pieceResetView.addEventListener("click", resetPiecePreviewView);
  dom.pieceAutoRotate.addEventListener("click", togglePiecePreviewAutoRotate);
  dom.displayButton.addEventListener("click", () => {
    openDisplaySettings();
    audio.click();
  });
  dom.assistToggle.addEventListener("change", toggleAssist);
  dom.resetView.addEventListener("click", () => {
    resetCamera();
    audio.click();
  });
  dom.panToggle.addEventListener("click", () => {
    setPanMode(!panMode);
    audio.click();
  });
  dom.fullSizeToggle.addEventListener("click", () => {
    setBoardFocus(!boardFocus);
    audio.click();
  });
  dom.saveButton.addEventListener("click", downloadSave);
  dom.loadButton.addEventListener("click", () => {
    audio.click();
    dom.loadFileInput.click();
  });
  dom.loadFileInput.addEventListener("change", handleLoadFile);

  dom.newGameButton.addEventListener("click", () => {
    if (state.history.length > 0 && !window.confirm(t("confirmNewGame"))) return;
    newGame({ announce: true });
    audio.click();
  });

  dom.resultNewGame.addEventListener("click", () => {
    newGame({ announce: true });
  });

  dom.reviewStalemateButton.addEventListener("click", () => {
    showStalemateReview();
    audio.click();
  });

  dom.stalemateNewGame.addEventListener("click", () => {
    newGame({ announce: true });
    audio.click();
  });

  dom.modeCards.forEach((card) => {
    card.addEventListener("click", () => {
      changeMode(card.dataset.mode);
      audio.click();
    });
  });

  dom.botLevelControl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-bot-level]");
    if (!button) return;
    applyBotLevel(button.dataset.botLevel);
    showToast(t("botLevelChanged", { level: t(AI_LEVELS[state.botLevel].nameKey) }), "info", "◈");
    audio.click();
  });

  dom.thinkTimeInput.addEventListener("input", () => {
    state.thinkTimeMs = Math.min(
      THINK_TIME_MAX_MS,
      Math.max(THINK_TIME_MIN_MS, Math.round(Number(dom.thinkTimeInput.value) / THINK_TIME_STEP_MS) * THINK_TIME_STEP_MS),
    );
    if (dom.thinkTimeValue) dom.thinkTimeValue.textContent = formatThinkTime(state.thinkTimeMs);
  });

  dom.thinkTimeInput.addEventListener("change", () => {
    applyThinkTime(dom.thinkTimeInput.value);
    showToast(t("thinkTimeChanged", { seconds: (state.thinkTimeMs / 1000).toFixed(1) }), "info", "◷");
    audio.click();
  });

  dom.themeGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-theme-choice]");
    if (!card) return;
    applyTheme(card.dataset.themeChoice, { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.boardStyleControl.addEventListener("click", (event) => {
    const option = event.target.closest("[data-board-style]");
    if (!option) return;
    applyBoardStyle(option.dataset.boardStyle, { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.boardMaterialControl.addEventListener("click", (event) => {
    const option = event.target.closest("[data-board-material]");
    if (!option) return;
    applyBoardMaterial(option.dataset.boardMaterial, { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.pieceSetControl.addEventListener("click", (event) => {
    const option = event.target.closest("[data-piece-set]");
    if (!option) return;
    applyPieceSet(option.dataset.pieceSet, { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.pieceFinishControl.addEventListener("click", (event) => {
    const option = event.target.closest("[data-piece-finish]");
    if (!option) return;
    applyPieceFinish(option.dataset.pieceFinish, { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.stageColorControl.addEventListener("click", (event) => {
    const option = event.target.closest("[data-stage-choice]");
    if (!option) return;
    const preset = STAGE_COLORS[option.dataset.stageChoice];
    if (!preset) return;
    applyStageColor(preset.color || "auto", { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.stageColorInput.addEventListener("input", () => {
    applyStageColor(dom.stageColorInput.value);
    dom.stageColorCurrent.textContent = t("stageColorCurrent", {
      color: dom.stageColorInput.value.toUpperCase(),
    });
    dom.stageColorCurrent.closest(".stage-color-custom")?.classList.add("is-active");
    dom.stageColorControl.querySelectorAll(".stage-color-option").forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
  });

  dom.stageColorInput.addEventListener("change", () => {
    applyStageColor(dom.stageColorInput.value, { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.textSizeControl.addEventListener("click", (event) => {
    const option = event.target.closest("[data-text-choice]");
    if (!option) return;
    applyTextSize(option.dataset.textChoice, { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.displayReset.addEventListener("click", () => {
    applyTheme("lacquer", { persist: true });
    applyTextSize("medium", { persist: true });
    applyBoardStyle("checkered", { persist: true });
    applyBoardMaterial("maple", { persist: true });
    applyPieceSet("court", { persist: true });
    applyPieceFinish("ruby", { persist: true });
    applyStageColor("auto", { persist: true });
    renderDisplaySettings();
    audio.click();
  });

  dom.brandHome.addEventListener("click", (event) => {
    event.preventDefault();
    resetCamera();
    audio.click();
  });

  $$("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", () => {
      const name = element.dataset.closeModal;
      const modal = name === "glossary"
        ? dom.glossaryModal
        : name === "piecePreview"
          ? dom.piecePreviewModal
          : name === "stalemate"
            ? dom.stalemateModal
            : name === "display"
              ? dom.displayModal
              : dom.resultModal;
      closeModal(modal);
      audio.click();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!dom.piecePreviewModal.hidden) closeModal(dom.piecePreviewModal);
    else if (!dom.displayModal.hidden) closeModal(dom.displayModal);
    else if (!dom.stalemateModal.hidden) closeModal(dom.stalemateModal);
    else if (!dom.resultModal.hidden) closeModal(dom.resultModal);
    else if (!dom.glossaryModal.hidden) closeModal(dom.glossaryModal);
    else if (boardFocus) setBoardFocus(false);
  });

  dom.scene.addEventListener("pointerdown", boardPointerDown);
  dom.scene.addEventListener("pointerup", boardPointerUp);
  dom.scene.addEventListener("click", suppressCameraClick);

  document.addEventListener("pointerdown", () => audio.unlock(), { once: true });

  window.addEventListener("beforeunload", () => {
    if (state.history.length > 0) saveGameToStorage();
  });

  // Keep keyboard users oriented inside modal dialogs.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const openModalElement = !dom.piecePreviewModal.hidden
      ? dom.piecePreviewModal
      : !dom.displayModal.hidden
      ? dom.displayModal
      : !dom.stalemateModal.hidden
        ? dom.stalemateModal
        : !dom.resultModal.hidden
          ? dom.resultModal
          : !dom.glossaryModal.hidden
            ? dom.glossaryModal
            : null;
    if (!openModalElement) return;
    const focusable = Array.from(openModalElement.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* =========================================================================
   Boot
   ========================================================================= */

function boot() {
  loadPreferences();
  warmSpeechVoices();
  applyTextSize(state.textSize);
  applyTheme(state.theme);
  applyStageColor(state.stageColor);
  applyBoardMaterial(state.boardMaterial);
  applyBoardStyle(state.boardStyle);
  resetGameState();
  const restored = tryRestoreAutoSave();
  if (!restored) {
    evaluateGameState();
    updateAllUI();
  } else {
    updateAllUI();
  }

  const sceneStarted = initScene();
  if (!sceneStarted) {
    updateAllUI();
    return;
  }

  bindEvents();
  applyTheme(state.theme);
  applyStageColor(state.stageColor);
  applyBoardMaterial(state.boardMaterial);
  applyBoardStyle(state.boardStyle);
  setPanMode(false, { announce: false });
  setBoardFocus(false, { announce: false });
  rebuildPieceMeshes();
  renderHighlights();
  updateAllUI();
  window.setTimeout(() => {
    if (state.mode === "ai" && state.turn === "b" && !isTerminal()) scheduleAI();
    if (state.history.length > 0) {
      saveGameToStorage();
    }
  }, 360);

  window.setTimeout(preloadPronunciationAudio, 1200);

  if (state.history.length === 0) {
    window.setTimeout(() => {
      if (state.history.length === 0) showToast(t("toastBoardReady"), "info", "ม");
    }, 950);
  }
}

boot();

/* A small, deliberately read-friendly surface for teachers and automated
   smoke tests. It does not expose any private player information. */
window.Makruk3D = {
  version: "1.8.0",
  credits: APP_CREDIT,
  getState: () => ({
    turn: state.turn,
    mode: state.mode,
    botLevel: state.botLevel,
    thinkTimeMs: state.thinkTimeMs,
    assist: state.assist,
    lang: state.lang,
    sound: state.sound,
    theme: state.theme,
    textSize: state.textSize,
    boardStyle: state.boardStyle,
    boardMaterial: state.boardMaterial,
    pieceSet: state.pieceSet,
    pieceFinish: state.pieceFinish,
    stageColor: state.stageColor,
    panMode,
    boardFocus,
    status: state.status,
    statusReason: state.statusReason,
    winner: state.winner,
    inCheck: state.inCheck,
    moveCount: state.history.length,
    selected: state.selected,
    aiThinking: state.aiThinking,
  }),
  getLegalMoves: () => getLegalMoves(state.turn, state.board).map((move) => ({
    from: move.from,
    to: move.to,
    promotion: move.promoted,
  })),
  getScreenPoint: (index) => {
    if (!sceneReady || !camera || !renderer) return null;
    const point = worldPosition(index);
    point.y = WORLD.boardTop + 0.02;
    point.project(camera);
    const rect = renderer.domElement.getBoundingClientRect();
    return {
      x: rect.left + (point.x * 0.5 + 0.5) * rect.width,
      y: rect.top + (-point.y * 0.5 + 0.5) * rect.height,
    };
  },
  selectSquare,
  playMove: (from, to) => performMove(from, to),
  setBotLevel: (level) => applyBotLevel(level),
  setThinkTime: (ms) => applyThinkTime(ms),
  setPieceSet: (setKey) => applyPieceSet(setKey),
  setPieceFinish: (finishKey) => applyPieceFinish(finishKey),
  setBoardMaterial: (materialKey) => applyBoardMaterial(materialKey),
  previewBotMove: () => {
    const move = chooseAIMove();
    return move ? { from: move.from, to: move.to } : null;
  },
  getSearchStats: () => ({ ...searchStats }),
  newGame: () => newGame({ announce: false }),
  getView: () => ({
    panMode,
    target: controls ? controls.target.toArray() : null,
    camera: camera ? camera.position.toArray() : null,
  }),
};
