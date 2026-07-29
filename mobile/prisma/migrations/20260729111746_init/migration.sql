-- CreateTable
CREATE TABLE "Lesson" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "jpTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "syllabus" JSONB NOT NULL,
    "kanji" TEXT[],
    "vocabulary" TEXT[],

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kana" (
    "id" TEXT NOT NULL,
    "char" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "vocab" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "notes" TEXT,
    "example" JSONB,

    CONSTRAINT "Kana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KanaStroke" (
    "id" SERIAL NOT NULL,
    "kanaId" TEXT NOT NULL,
    "pathIndex" INTEGER NOT NULL,
    "d" TEXT NOT NULL,

    CONSTRAINT "KanaStroke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "type" TEXT,
    "lesson" INTEGER NOT NULL,
    "example" JSONB NOT NULL,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kanji" (
    "char" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "onyomi" TEXT NOT NULL,
    "kunyomi" TEXT NOT NULL,

    CONSTRAINT "Kanji_pkey" PRIMARY KEY ("char")
);

-- CreateTable
CREATE TABLE "KanjiStroke" (
    "id" SERIAL NOT NULL,
    "kanjiChar" TEXT NOT NULL,
    "pathIndex" INTEGER NOT NULL,
    "d" TEXT NOT NULL,

    CONSTRAINT "KanjiStroke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaiwaScenario" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jpTitle" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dialogue" JSONB NOT NULL,

    CONSTRAINT "KaiwaScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PronunciationPhrase" (
    "id" TEXT NOT NULL,
    "japanese" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pitchName" TEXT NOT NULL,
    "pitchType" TEXT NOT NULL,
    "moras" TEXT[],
    "moraPitches" TEXT[],
    "pitchDropIndex" INTEGER,
    "notes" TEXT NOT NULL,

    CONSTRAINT "PronunciationPhrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadicalPuzzle" (
    "id" TEXT NOT NULL,
    "targetKanji" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "onyomi" TEXT NOT NULL,
    "kunyomi" TEXT NOT NULL,
    "radicals" JSONB NOT NULL,
    "candidates" JSONB NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "RadicalPuzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'external',
    "targetJlptLevel" VARCHAR(4) NOT NULL DEFAULT 'N5',
    "n5TargetDate" TEXT,
    "studyMode" VARCHAR(10) NOT NULL DEFAULT 'zen',
    "cyberTheme" VARCHAR(10) NOT NULL DEFAULT 'dark',
    "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "hapticsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "userId" TEXT NOT NULL,
    "masteredKana" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "starredVocab" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "practicedKanji" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "solvedLessons" INTEGER[] DEFAULT ARRAY[1]::INTEGER[],
    "solvedNodes" INTEGER[] DEFAULT ARRAY[1]::INTEGER[],
    "activeLessonId" INTEGER NOT NULL DEFAULT 1,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "dailyTasksCompleted" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SrsCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kanaId" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SrsCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "attendanceDate" CHAR(10) NOT NULL,
    "studentUserId" TEXT NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "markedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deck" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KanaStroke_kanaId_pathIndex_key" ON "KanaStroke"("kanaId", "pathIndex");

-- CreateIndex
CREATE INDEX "Vocabulary_tag_idx" ON "Vocabulary"("tag");

-- CreateIndex
CREATE INDEX "Kanji_level_idx" ON "Kanji"("level");

-- CreateIndex
CREATE UNIQUE INDEX "KanjiStroke_kanjiChar_pathIndex_key" ON "KanjiStroke"("kanjiChar", "pathIndex");

-- CreateIndex
CREATE INDEX "UserProfile_role_idx" ON "UserProfile"("role");

-- CreateIndex
CREATE INDEX "SrsCard_userId_dueDate_idx" ON "SrsCard"("userId", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "SrsCard_userId_kanaId_key" ON "SrsCard"("userId", "kanaId");

-- CreateIndex
CREATE INDEX "Attendance_studentUserId_idx" ON "Attendance"("studentUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_attendanceDate_studentUserId_key" ON "Attendance"("attendanceDate", "studentUserId");

-- CreateIndex
CREATE INDEX "UploadedFile_uploadedBy_idx" ON "UploadedFile"("uploadedBy");

-- CreateIndex
CREATE INDEX "QuizRun_userId_idx" ON "QuizRun"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "KanaStroke" ADD CONSTRAINT "KanaStroke_kanaId_fkey" FOREIGN KEY ("kanaId") REFERENCES "Kana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanjiStroke" ADD CONSTRAINT "KanjiStroke_kanjiChar_fkey" FOREIGN KEY ("kanjiChar") REFERENCES "Kanji"("char") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SrsCard" ADD CONSTRAINT "SrsCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_markedBy_fkey" FOREIGN KEY ("markedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizRun" ADD CONSTRAINT "QuizRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
